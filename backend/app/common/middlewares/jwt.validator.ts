import { JWT_SECRET } from '@config/config';
import { locale } from '@config/locales';
import { sendResponse } from '@utils/common';
import jwt from 'jsonwebtoken';
import { RESPONSE_CODE, RESPONSE_FAILURE } from '@common/Constants';
import { NextFunction, Response } from 'express';
import { IAuthRequest } from '@common/interfaces/IAuthRequest';
import UserService from '@services/UserService';

export default class JWTAuthenticator {
    /**
     * Middleware to decode and validate JWT token
     */
    static decode = async (req: IAuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return sendResponse(res, undefined, locale('TOKEN_REQUIRED'), RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            if (!token) {
                return sendResponse(res, undefined, locale('TOKEN_REQUIRED'), RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }

            // Verify token
            const decoded: any = jwt.verify(token, JWT_SECRET);

            // Fetch user from database
            const user = await UserService.readById(decoded.id);

            if (!user) {
                return sendResponse(res, undefined, locale('INVALID_TOKEN'), RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return sendResponse(res, undefined, locale('TOKEN_EXPIRED'), RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }
            return sendResponse(res, undefined, locale('INVALID_TOKEN'), RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
        }
    };

    /**
     * Middleware to encode JWT token after successful authentication
     */
    static encode = (req: IAuthRequest, res: any, next: NextFunction) => {
        try {
            if (!res.user) {
                return sendResponse(res, undefined, locale('USER_NOT_FOUND'), RESPONSE_FAILURE, RESPONSE_CODE.BAD_REQUEST);
            }

            const token = jwt.sign(
                {
                    email: res.user.email,
                    id: res.user._id,
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return token and user profile
            return sendResponse(
                res,
                {
                    token,
                    profile: {
                        _id: res.user._id,
                        email: res.user.email,
                        createdAt: res.user.createdAt,
                    },
                },
                locale('LOGIN_SUCCESS'),
                true,
                RESPONSE_CODE.SUCCESS
            );
        } catch (error) {
            return sendResponse(res, undefined, locale('SERVER_ERROR'), RESPONSE_FAILURE, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }
    };
}
