import { body } from 'express-validator';
import { locale } from '@config/locales';

export const registerValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage(locale('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(locale('INVALID_EMAIL'))
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage(locale('PASSWORD_REQUIRED'))
        .isLength({ min: 6 })
        .withMessage(locale('INVALID_PASSWORD')),
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage(locale('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(locale('INVALID_EMAIL'))
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage(locale('PASSWORD_REQUIRED')),
];
