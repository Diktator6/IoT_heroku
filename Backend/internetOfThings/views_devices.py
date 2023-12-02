from django.contrib.auth.hashers import check_password

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .views_func_enum import ShareStates, getUserIdFromRequest


from .models import Device, DeviceType, DeviceParamValue, DeviceTypeParam, User
from .serializers import DeviceSerializer, DeviceTypeSerializer, DeviceParamValueSerializer, DeviceTypeParamSerializer


##### DeviceTypes #####

class CreateDeviceType(APIView):
    def post(self, request):

        # Get user id if is logged in
        userId = getUserIdFromRequest(request)
        # Non registere user can make these post
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            ) 
        
        data = request.data
        devtype = DeviceType(name= data['deviceType'])
        devtype.save()

class AddDeviceTypeParam(APIView):
    def post(self, request):

        # Get user id if is logged in
        userId = getUserIdFromRequest(request)
        # Non registere user can make these post
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            ) 
        data = request.data
        param = DeviceTypeParamSerializer(data)
        param.save()


class GetDeviceTypes(APIView):
    def get(self,request):
        dvt = DeviceType.objects.all().values('id', 'name')
        response = Response(dvt)
        return response
        
        
##### Devices #####


class CreateDeviceView(APIView):
    def post(self, request):

        # Get user id if is logged in
        userId = getUserIdFromRequest(request)
        # Non registere user can make these post
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            ) 
        

class AddDeviceToSytemView(APIView):
    def post(self, request):
        
        # Get user id if is logged in
        userId = getUserIdFromRequest(request)
        # Non registere user can make these post
        if not userId:
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            ) 
        
        data = request.data
        user = User(id = data['id'])
    
    
class InsertDeviceData(APIView):
    def post(self, request):
        # token = request.COOKIES.get('jwt')

        # if not token:
        #     return Response(
        #         {'error': "Unauthorized!"},
        #         status=status.HTTP_401_UNAUTHORIZED
        #     )
        
        # try:
        #     payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"]) 
        # except jwt.ExpiredSignatureError:
        #     return Response(
        #         {'error': "Unauthorized!"},
        #         status=status.HTTP_401_UNAUTHORIZED
        #     )

        # uid = getUserIdFromRequest(request)
        # user = User.objects.all().filter(id=uid)

        req_data = request.data

        devdata_ser = DeviceParamValueSerializer(data=req_data)
        devdata_ser.is_valid(raise_exception=True)
        devdata_ser.save()
        return Response()
        
       
