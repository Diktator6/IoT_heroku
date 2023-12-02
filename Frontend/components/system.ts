// Author: xmrazf00

export interface System {
    id: number;
    system_name: string;
    date_created: string;
    owner__username: string;
    description: string;
    right: Right;
  }

 export enum Right{
    OWNED = 'owned',
    SHARED = 'shared',
    WAITING_USER_TO_OWNER = 'waiting_user_to_owner',
    WAITING_OWNER_TO_USER = 'waiting_owner_to_user',
    DECLINED = 'declined',
    REGISTERED = 'registered',
    NONREGISTERD = 'nonregistered',
  }
  