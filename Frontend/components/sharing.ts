// Author: xmrazf00

export interface Sharing {
    id: number;
    user: string;
    system: string;
    state: State;
    share_type: string;
    user__username: string
  }

export enum Share_type{
  USER_TO_SYSTEM = 'user_to_system',
  OWNER_TO_USER = 'owner_to_user'
}

export enum State{
  WAITING = 'waiting',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}