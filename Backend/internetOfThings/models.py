# Author: xskopa17 + xmrazf00

from django.db import models
from datetime import date

# Author: xmrazf00
class User(models.Model):
    MALE = 'male'
    FEMALE = 'female'
    UNDEFINED = 'undefined'

    SEX_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (UNDEFINED, 'Undefined'),
    ]
    username = models.CharField(max_length=10,unique = True, null=False)
    password = models.CharField(max_length=100, null=False)
    first_name = models.CharField(max_length=20, default='')
    last_name = models.CharField(max_length=20, default='')
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, default=UNDEFINED)
    birth_date = models.DateField(default=date.today)
    is_admin = models.BooleanField(default=False)

# Author: xmrazf00
class System(models.Model):
    system_name = models.CharField(max_length=40, unique=True)
    description = models.TextField(max_length=1000, default='')
    date_created = models.DateTimeField("date created", default=date.today)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='systems')

    # Owner cant have two system with same name
    class Meta:
        unique_together = ['system_name', 'owner']


# Author: xmrazf00
class Sharing(models.Model):
    WAITING = 'waiting'
    ACCEPTED = 'accepted'
    DECLINED = 'declined'

    SHARE_STATES = [
        (WAITING, 'Waiting'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
    ]

    USER_TO_SYSTEM = 'user_to_system'
    OWNER_TO_USER = 'owner_to_user'

    SHARE_TYPES = [
        (USER_TO_SYSTEM, 'User to System'),
        (OWNER_TO_USER, 'Owner to User'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    system = models.ForeignKey(System, on_delete=models.CASCADE)
    state = models.CharField(max_length=10, choices=SHARE_STATES, default=WAITING)
    share_type = models.CharField(max_length=20, choices=SHARE_TYPES)

    class Meta:
        unique_together = ['user', 'system', 'share_type']

# Author: xmrazf00
class XDevice(models.Model):
    name = models.CharField(max_length=40, unique=True)
    description = models.TextField(max_length=1000, default='')
    system = models.ForeignKey(System, on_delete=models.CASCADE, related_name='device')
    value = models.IntegerField()

    # System can't have two same name devices
    class Meta:
        unique_together = ['name', 'system']

# # Author: xskopa17
# class DeviceType(models.Model):
#     name = models.CharField(unique = True)

# # Author: xskopa17
# class DeviceTypeParam(models.Model):
#     INT = 'int'
#     FLOAT = 'float'
#     STRING = 'string'
#     TYPE_LIST = [
#         (INT,'integer'),
#         (FLOAT, 'float'),
#         (STRING, 'string')
#     ]
#     deviceType = models.ForeignKey(DeviceType,on_delete=models.CASCADE)
#     typeName = models.CharField(choices=TYPE_LIST)
#     name = models.CharField()    
#     class Meta:
#         constraints = [
#             models.UniqueConstraint(fields=['name','typeName'], name = 'UN_DeviceTypeParam_typeName_name'),]

# # Author: xskopa17
# class Device(models.Model):
#     name = models.CharField(unique = True)
#     deviceType = models.ForeignKey(DeviceType, on_delete=models.CASCADE)

# # Author: xskopa17
# class SystemDevice(models.Model):
#     device = models.ForeignKey(Device(), on_delete=models.CASCADE)    
#     system = models.ForeignKey(System, on_delete=models.CASCADE)
#     class Meta:
#         constraints = [models.UniqueConstraint(fields=['device','system'], name= 'UN_SystemDevice_device_system')]

# # Author: xskopa17
# class DeviceParamValue(models.Model):
#     device = models.ForeignKey(Device(), on_delete=models.CASCADE)
#     param = models.ForeignKey(DeviceTypeParam(), on_delete=models.CASCADE)
#     value = models.CharField()
#     timestamp = models.DateTimeField(auto_now_add = True)
#     class Meta:
#         constraints = [models.UniqueConstraint(fields=['device','param','timestamp'], name = 'UN_DeviceParamValue_device_param_timestamp')]
        