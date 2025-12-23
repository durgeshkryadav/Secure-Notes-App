import type { Request } from 'express';
import { IUser } from '@models/User';

export interface IAuthRequest extends Request {
    user?: IUser;
    body: any;
    query: any;
    params: any;
    headers: any;
}
