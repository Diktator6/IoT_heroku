# Author: xmrazf00

from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .views_func_enum import ShareStates, getUserIdFromRequest
from .models import Sharing, System, User
from .serializers import SharingSerializer

##### Sharing #####

# /sharing/new
class newSharing(APIView):
    def post(self, request):

        # Get user id if is logged in
        userId = getUserIdFromRequest(request)
        # Non registere user can make these post
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )       

        share_type = request.data['share_type']
        sysId = request.data['system']
        
        owner = System.objects.filter(id=sysId).values_list('owner', flat=True).first()

        # System does not exists
        if not owner:
            return Response(
            {'error': "System does not exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )

        # Owner can't apply for sharing on his own system
        if owner == userId and share_type == ShareStates.USER_TO_SYSTEM:
            return Response(
            {'error': "Owner can't apply for sharing!"},
            status=status.HTTP_400_BAD_REQUEST
            )
        
        # User can't ofer sharing as owner if he is not owner
        if owner != userId and share_type == ShareStates.OWNER_TO_USER:
            return Response(
            {'error': "User is not owner and cant offer sharing!"},
            status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to find post in table sharing
        sharing_post = Sharing.objects.filter(user=userId, system=sysId)

        # If post is present can't make another one
        if sharing_post:
            return Response(
            {'error': "Post already exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )
            
        # Everything is good now make new sharing post
        request.data['user'] = userId
        # Make new database object sharing
        serializer = SharingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response()
        
      
# /sharing/<sysId>
class getAllSystemSharings(APIView):
    def get(self, request, sysId):

         # Get user id if is logged in
        userId = getUserIdFromRequest(request)

        # Non registered user can't see sharing posts
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get the owner of the system
        owner = System.objects.filter(id=sysId).values_list('owner', flat=True).first()

        # System does not exists
        if not owner:
            return Response(
            {'error': "System does not exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )
        
        # User that is not owner of the system can't get the list of all systems sharing posts
        if owner != userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )
        
         # Get pagination and type of sharing
        option = request.GET.get('option', None)
        page = request.GET.get('page', None) 

        # Index of first database object
        page_num = int(page) * settings.PAGINATION_OBJECTS_CNT 

        if option == 'all':
            sharing = Sharing.objects.filter(system_id=sysId)\
                .values(
                    'id',
                    'user__username',
                    'state',
                    'share_type'
                )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT]
        elif option == 'waiting' or option == 'declined' or option == 'accepted':
            sharing = Sharing.objects.filter(system_id=sysId, state=option)\
                .values(
                    'id',
                    'user__username',
                    'state',
                    'share_type'
                )[page_num: page_num + settings.PAGINATION_OBJECTS_CNT]
        else:
            return Response(
            {'error': "Option does not exists!"},
            status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(sharing)

# /sharing/patch/<sysId>
class setSharing(APIView):
    def patch(self, request, sharingId):

         # Get user id if is logged in
        userId = getUserIdFromRequest(request)

        # Non registere user can make changes
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            ) 

        # Get the Sharing instance or return a 404 response if not found
        sharing = get_object_or_404(Sharing, id=sharingId)

        # Extract the new state from the request data
        new_state = request.data.get('state')

        # Check if the user is the owner of the system in the sharing instance
        is_owner = sharing.system.owner_id == userId

        # Get the User object or return a 404 response if not found
        user = get_object_or_404(User, id=userId)
        # Access the is_admin field
        is_admin = user.is_admin

        # Control permissions 
        if (not is_admin) and (not is_owner):
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  

        # Bad state
        if new_state not in [Sharing.WAITING, Sharing.ACCEPTED, Sharing.DECLINED]:
            return Response({'error': 'Invalid state'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the state of the Sharing instance
        sharing.state = new_state
        sharing.save()

        return Response(
            {'message': f'Sharing state updated to {new_state}'},
              status=status.HTTP_200_OK
            )
    

# /sharing/delete/<sharingId>  
class DeleteSharing(APIView):
    def delete(self, request, sharingId):

        # Get user Id
        userId = getUserIdFromRequest(request)
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  

        # Get the Sharing object or return a 404 response if not found
        sharing = get_object_or_404(Sharing, id=sharingId)

        # Get the User object or return a 404 response if not found
        user = get_object_or_404(User, id=userId)
        # Access the is_admin field
        is_admin = user.is_admin

        # Get the User object or return a 404 response if not found
        system = get_object_or_404(System, id=sharing.system.id)

        # User has no right to delete
        if (not is_admin) and (userId != system.owner.id):
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  
        

        # Delete Sharing
        sharing.delete()
        return Response({'message': f'Sharing post id:{sharingId} deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            