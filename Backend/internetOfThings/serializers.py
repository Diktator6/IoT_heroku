#autor: xmrazf00

from django.contrib.auth.hashers import make_password

from rest_framework import serializers

from . models import User, System, Sharing, XDevice
#from . models import Device, DeviceParamValue,DeviceType, DeviceTypeParam


# Author: xmrazf00
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'sex', 'birth_date', 'is_admin']
        extra_kwargs = {
            'password' : {"write_only" : True}
        }   
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = System
        fields = ['id', 'system_name','description', 'date_created', 'owner']

class SharingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sharing
        fields = ['user', 'system', 'state', 'share_type']

class XDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = XDevice
        fields = ['name', 'description', 'system', 'value']


# Author: xskopa17
# class DeviceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Device
#         fields = ['name', 'devicetypeid']

# class DeviceParamValueSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DeviceParamValue
#         fields = ['device', 'param', 'value']

# class DeviceTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DeviceType
#         fields = '__all__'


# class DeviceTypeParamSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DeviceTypeParam
#         fields = '__all__'
       

