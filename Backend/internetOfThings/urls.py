#autor: xmrazf00

from django.urls import path

from . import views_user, views_sharing, views_system, views_admin, views_xdevice
# from . import views_devices

urlpatterns = [
    # Admin
    path("admin/getAll", views_admin.GetAll.as_view()),
    # User
    path("register", views_user.RegisterView.as_view()),
    path("login", views_user.LoginView.as_view()),
    path("user", views_user.UserView.as_view()),
    path("logout", views_user.LogoutView.as_view()),
    path("user/delete/<int:deleteUser>", views_user.DeleteUser.as_view()),
    # System
    path("newSystem", views_system.CreateSystemView.as_view()),
    path("getAllSystems", views_system.GetAllSystemsView.as_view()),
    path("system/<int:sysId>", views_system.SystemView.as_view()),
    path("system/delete/<int:sysId>", views_system.DeleteSystem.as_view()),
    # Sharing
    path("sharing/new", views_sharing.newSharing.as_view()),
    path("sharing/<int:sysId>", views_sharing.getAllSystemSharings.as_view()),
    path("sharing/patch/<int:sharingId>", views_sharing.setSharing.as_view()),
    path("sharing/delete/<int:sharingId>", views_sharing.DeleteSharing.as_view()),
    # XDevices
    path("device/new/<int:sysId>", views_xdevice.newDeviceView.as_view()),
    path("device/system/<int:sysId>", views_xdevice.getSysDevicesView.as_view()),
    path("device/value/<int:devId>", views_xdevice.SetValueDeviceView.as_view()),
    
    # Device Types
    # path("deviceTypes/new", views_devices.CreateDeviceType.as_view()),
    # path("deviceTypes/list", views_devices.GetDeviceTypes.as_view()),
    # Devices
    # path("devices/new", views_devices.CreateDeviceView.as_view()),
    # path("devices/addToSystem", views_devices.AddDeviceToSytemView.as_view()),
    # path("devices/addData", views_devices.InsertDeviceData.as_view()),
]
