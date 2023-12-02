# Author: xmrazf00

from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import jwt, datetime

from .views_func_enum import getUserIdFromRequest
from .models import User
from .serializers import UserSerializer
##### User #####

# /register
class RegisterView(APIView):
    def post(self, request):

        # Check if username is already taken
        username = request.data.get('username', '')
        if(User.objects.filter(username=username).exists()):
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make new database object "user"
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # User was succesfully created
        if(User.objects.filter(username=username).exists()):
            return Response(
                {'success': "Account created"},
                status=status.HTTP_201_CREATED
            ) 
        # User was not created unexpected internal error
        else:
            return Response(
                {'error': 'Something went wrong when trying to create account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# /login  
class LoginView(APIView):
    def post(self, request):

        # Get data from request
        username = request.data['username']
        password = request.data['password']

        # Get user from database
        user = User.objects.filter(username=username).first()

        # User existance check
        if user is None:
            return Response(
                {'error': "User not found!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Password checking
        if not check_password(password, user.password):
            return Response(
                {'error': "Incorrect password!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Making session cookie ("jwt")
        cookie_expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=60)        
        payload = {
            'id': user.id,
            'exp': cookie_expiration,
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256",) 

        # Make response and set session cookie to it
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True, expires=cookie_expiration)
        
        return response
    
#  /user
class UserView(APIView):
    def get(self,request):
        # Get session token from request head
        token = request.COOKIES.get('jwt')
        
        # There is no session token user is not logged in
        if not token:
            return Response(
                {'error': "Unauthorized!"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': "Unauthorized!"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)

        return Response(serializer.data)

# /logout  
class LogoutView(APIView):
    def post(self, request):
        # Delete session cookie response
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'messege': "Success!"
        }
        return response

# /user/delete/<userId>  
class DeleteUser(APIView):
    def delete(self, request, deleteUser):

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

        # User has no right to delete
        if (not is_admin) and (userId != user.id):
            return Response(
            {'error': "Unauthorized!"},
            status=status.HTTP_401_UNAUTHORIZED
            )  
        
        # Get the User object or return a 404 response if not found
        userToDelete = get_object_or_404(User, id=deleteUser)
        userToDelete.delete()
        response = Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        if not is_admin:
            response.delete_cookie('jwt')
        return response
    
        