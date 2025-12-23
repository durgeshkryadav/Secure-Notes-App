import { RESPONSE_CODE, RESPONSE_FAILURE, RESPONSE_SUCCESS } from '@common/Constants';
import { locale } from '@config/locales';
import { sendResponse } from '@utils/common';
import { logger } from '@utils/logger';
import type { NextFunction, Request, Response } from 'express';
import UserService from '@services/UserService';

class AuthController {
    /**
     * Middleware to check if email already exists
     */
    static async checkEmailExistOrNot(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const exists = await UserService.emailExists(email);
            
            if (exists) {
                return sendResponse(
                    res,
                    undefined,
                    locale('EMAIL_ALREADY_EXISTS'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.BAD_REQUEST
                );
            }
            
            next();
        } catch (error: any) {
            logger.error(`Error checking email existence: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('SERVER_ERROR'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Register a new user
     * POST /api/auth/register
     */
    static async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Create user (password will be hashed by the pre-save hook in the model)
            const user = await UserService.create({
                email,
                password,
            });

            logger.info(`New user registered: ${email}`);

            return sendResponse(
                res,
                {
                    _id: user._id,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                locale('REGISTER_SUCCESS'),
                RESPONSE_SUCCESS,
                RESPONSE_CODE.CREATED
            );
        } catch (error: any) {
            logger.error(`Error in user registration: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('REGISTER_FAILED'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.BAD_REQUEST
            );
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     * Sets res.user for JWT encoding middleware
     */
    static async login(req: Request, res: any, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Find user with password field
            const user = await UserService.findByEmailWithPassword(email);

            if (!user) {
                return sendResponse(
                    res,
                    undefined,
                    locale('INVALID_CREDENTIAL'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.BAD_REQUEST
                );
            }

            // Compare password
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return sendResponse(
                    res,
                    undefined,
                    locale('INVALID_CREDENTIAL'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.BAD_REQUEST
                );
            }

            // Set user in response for JWT encoding middleware
            res.user = {
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt,
            };

            logger.info(`User logged in: ${email}`);
            
            next();
        } catch (error: any) {
            logger.error(`Error in user login: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('INVALID_CREDENTIAL'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.BAD_REQUEST
            );
        }
    }
}

export default AuthController;
