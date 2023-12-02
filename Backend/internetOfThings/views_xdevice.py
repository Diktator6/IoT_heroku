# Author: xmrazf00

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .views_func_enum import Right, getUserIdFromRequest, getUserRightOfSystem
from .models import System, User, XDevice
from .serializers import XDeviceSerializer

# Temporary
import random

# /device/new/<int:sysId>
class newDeviceView(APIView):
    def post(self, request, sysId):
        
        # Get user Id
        userId = getUserIdFromRequest(request)
        if userId == '':
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  

        # Get device name
        data = request.data
        device_name = data.get('device_name', '')

        # Update data with system id
        data.update({"system":sysId})
        # Temporary
        data.update({"value":random.randint(1, 100)})

         # Check if device name is already taken
        if(XDevice.objects.filter(name=device_name).exists()):
            return Response(
                {'error': 'Your device with this name already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get system where should be device placed
        system = get_object_or_404(System, id=sysId)
        # Access the is_admin field
        owner_id = system.owner

        # Only owner can add devices to the system
        if userId != owner_id.id:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_403_FORBIDDEN
            ) 
        
        
        serializer = XDeviceSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        return Response(
                {'mes': "Created"},
                status=status.HTTP_201_CREATED
            ) 
        
# /device/system/<int:sysId>
class getSysDevicesView(APIView):
    def get(self, request, sysId):
        # Get user id if is logged in
        userId = getUserIdFromRequest(request)

        # Non registered user can't see device 
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

        # Get user permissions
        permisions = getUserRightOfSystem(userId, owner , sysId)    
        # User that is not owner of the system can't get the list of all systems device
        if permisions != Right.OWNED.value and permisions != Right.SHARED.value:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_403_FORBIDDEN
            )

        device = XDevice.objects.filter(system_id=sysId)\
            .values(
                'id',
                'name',
                'value'
            )
        
        return Response(device)
        

class getValueDeviceView(APIView):
    def get(self, request, devId):
        pass


# Broker 
# /device/value/<int:devId>
class SetValueDeviceView(APIView):
    def patch(self, request, devId):
        # Get the XDevice object or return a 404 response if not found
        device = XDevice.objects.get(pk=devId)

        # Get the new value from the request data
        new_value = request.data.get('value')

        # Update the value field of the device
        device.value = new_value
        device.save()

        return Response({'message': f'Device value updated successfully'}, status=status.HTTP_200_OK)

