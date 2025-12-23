import type { NextFunction, Request, Response } from 'express';
import { HttpException } from '@common/exceptions/HttpException';
import { logger } from '@utils/logger';
import { RESPONSE_CODE, RESPONSE_FAILURE } from '@common/Constants';
import { sendResponse } from '@utils/common';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR;
        const message: string = error.message || 'Something went wrong';

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        
        return sendResponse(res, undefined, message, RESPONSE_FAILURE, status);
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
