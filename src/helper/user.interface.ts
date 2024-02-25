import { Request } from 'express';

export interface UserData {
    id: number;
    name: string;
    email: string;
}

export interface UserDataJWT extends Request {
    userData?: UserData
}