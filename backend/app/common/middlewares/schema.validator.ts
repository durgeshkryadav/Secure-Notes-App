import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/common';
import { RESPONSE_CODE, RESPONSE_FAILURE } from '@common/Constants';
import { locale } from '@config/locales';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return sendResponse(res, { errors: errors.array() }, errorMessages[0] || locale('VALIDATION_ERROR'), RESPONSE_FAILURE, RESPONSE_CODE.BAD_REQUEST);
    }
    
    next();
};
