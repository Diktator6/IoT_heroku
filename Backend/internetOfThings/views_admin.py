# Author: xmrazf00

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .views_func_enum import getUserIdFromRequest
from .models import Sharing, System, User

##### Sharing #####

##### System #####

#/admin/getAll
class GetAll(APIView):
    def get(self, request):
        # Get pagination and type of data
        option = request.GET.get('option', None)
        page = request.GET.get('page', None)  

        # Index of first database object
        page_num = int(page) * settings.PAGINATION_OBJECTS_CNT 

        # Get user Id
        userId = getUserIdFromRequest(request)
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  
        
        # Get the User object or return a 404 response if not found
        user = get_object_or_404(User, id=userId)
        # Access the is_admin field
        is_admin = user.is_admin

        # Only for admin
        if not is_admin:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  

        # Users
        if option == 'users':

            data = User.objects.all().values(
                        'id',
                        'username',
                        'first_name',
                        'last_name',
                        'sex',
                        'is_admin'
                    )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT ]
                     

        # System
        elif option == 'systems':
            data = System.objects.all().values(
                        'id',
                        'system_name',
                        'date_created',
                        'owner__username'
                    )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT ]

        # Sharing
        elif option == 'sharings':
           data = Sharing.objects.all().values(
                        'id',
                        'system',
                        'user__username',
                        'state',
                        'share_type'
                    )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT ]
        else:
            return Response(
            {'error': "Option does not exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )

        return Response(data)