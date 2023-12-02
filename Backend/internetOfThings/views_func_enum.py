# Author: xmrazf00

from enum import Enum
from django.conf import settings

import jwt

from .models import Sharing

##### enums #####

class Right(Enum):
    OWNED = 'owned'
    SHARED = 'shared'
    WAITING_USER_TO_OWNER = 'waiting_user_to_owner'
    WAITING_OWNER_TO_USER = 'waiting_owner_to_user'
    DECLINED = 'declined'
    REGISTERED = 'registered'
    NONREGISTERED = 'nonregistered'

class ShareStates(Enum):
    USER_TO_SYSTEM = 'user_to_system'
    OWNER_TO_USER = 'owner_to_user'

##### functions #####
def getUserIdFromRequest(request):
    token = request.COOKIES.get('jwt')

    if not token:
        return ''
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return ''
    
    return payload['id']

def getUserRightOfSystem(userId, ownerID, sysId):
     # User is also owner
    if userId == ownerID:
        right = Right.OWNED.value
    # Registered user
    elif userId != '':
        sharing_info = Sharing.objects.filter(
            user=userId,
            system=sysId
        ).values('state', 'share_type').first()
        
        # There is a coresponding sharing record
        if sharing_info:
            # User has a sharing record
            if sharing_info['state'] == Sharing.ACCEPTED:
                right = Right.SHARED.value
            elif sharing_info['state'] == Sharing.WAITING:
                if sharing_info['share_type'] == Sharing.OWNER_TO_USER:
                    right = Right.WAITING_OWNER_TO_USER.value
                else:
                    right = Right.WAITING_USER_TO_OWNER.value
            elif sharing_info['state'] == Sharing.DECLINED:
                right = Right.DECLINED.value
        else:
            right = Right.REGISTERED.value
    # Non registered user
    else:  
        right = Right.NONREGISTERED.value
    return right