// Author: xmrazf00

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    sex: Sex;
    is_admin: boolean;
  }

export enum Sex{
    MALE = 'male',
    FEMALE = 'female',
    UNDEFINED = 'undefined'
}