import { Request } from 'express';
import { IUser } from '@models/User';

export interface IAuthRequest extends Request {
    user?: IUser;
}
