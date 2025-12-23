import { body } from 'express-validator';
import { locale } from '@config/locales';

export const createNoteValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage(locale('TITLE_REQUIRED'))
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage(locale('CONTENT_REQUIRED')),
];
