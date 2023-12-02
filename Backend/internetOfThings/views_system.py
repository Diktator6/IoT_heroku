# Author: xmrazf00

from django.conf import settings
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .views_func_enum import getUserIdFromRequest, getUserRightOfSystem
from .models import System, User
from .serializers import SystemSerializer


##### System #####

#/getAllSystems
class GetAllSystemsView(APIView):
    def get(self, request):
        # Get pagination and type of systems
        option = request.GET.get('option', None)
        page = request.GET.get('page', None)  

        # Index of first database object
        page_num = int(page) * settings.PAGINATION_OBJECTS_CNT 

        # Get user Id
        userId = getUserIdFromRequest(request)

        # Only users owned systems
        if option == 'own':
            if userId:
                systems = System.objects.filter(owner=userId).values(
                            'id',
                            'system_name',
                            'date_created',
                            'owner__username'
                        )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT ]
            
            # User does not exists
            else:
                return Response(
                {'error': "Unauthorized!"},
                status=status.HTTP_401_UNAUTHORIZED
            )           

        elif option == 'permission':
            systems = System.objects.filter(
                Q(sharing__user=userId, sharing__state='accepted')
            ).values(
                'id',
                'system_name',
                'date_created',
                'owner__username'
            )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT]

        # All systems
        elif option == 'all':
            # Get right number of database object on specific index
            systems = System.objects.all().values(
                        'id',
                        'system_name',
                        'date_created',
                        'owner__username'
                    ).order_by('system_name')[page_num: page_num + settings.PAGINATION_OBJECTS_CNT]
        else:
            return Response(
            {'error': "Option does not exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )

        return Response(systems)

# /newSystem
class CreateSystemView(APIView):
    def post(self, request):
        
        # Get user Id
        userId = getUserIdFromRequest(request)
        if userId == '':
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
        )  

        # Add owner id to the data
        data = request.data
        data.update({"owner":userId})
        system_name = data.get('system_name', '')

         # Check if system name is already taken
        if(System.objects.filter(system_name=system_name).exists()):
            return Response(
                {'error': 'Your system with this name already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SystemSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 

        system = System.objects.filter(system_name=system_name).first()

         # User was succesfully created
        if system:
            return Response(
                {'mes': system.id},
                status=status.HTTP_201_CREATED
            ) 
        # User was not created unexpected internal error
        else:
            return Response(
                {'error': 'Something went wrong when trying to create system'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# /system/<int:sysId>
class SystemView(APIView):
    def get(self, request, sysId):

        # Get user id if is logged in
        userId = getUserIdFromRequest(request)

        # Get system basic data 
        system = System.objects.filter(id=sysId).values(
                        'id',
                        'system_name',
                        'description',
                        'date_created',
                        'owner',
                        'owner__username'
                    ).first() 

        # System was not found
        if not system:
            return Response(
                {'error': 'System not found'},
                status=status.HTTP_404_NOT_FOUND
            )    

        # Get right on system of calling user
        system['right'] = getUserRightOfSystem(userId=userId, ownerID=system['owner'], sysId=sysId)

        return JsonResponse(system)
    

# /system/delete/<sysId>  
class DeleteSystem(APIView):
    def delete(self, request, sysId):

        # Get user Id
        userId = getUserIdFromRequest(request)
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  

        # Get the System object or return a 404 response if not found
        system = get_object_or_404(System, id=sysId)

        # Get the User object or return a 404 response if not found
        user = get_object_or_404(User, id=userId)
        # Access the is_admin field
        is_admin = user.is_admin

        # User has no right to delete
        if (not is_admin) and (userId != system.owner.id):
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  
        
        # Delete system
        system.delete()
        return Response({'message': 'System deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        
    