import { Router } from 'express';
import { IRoutes } from '@common/interfaces/IRoutes';
import AuthController from '@controllers/AuthController';
import NotesController from '@controllers/NotesController';
import JWTAuthenticator from '@common/middlewares/jwt.validator';
import { validateRequest } from '@common/middlewares/schema.validator';
import { registerValidation, loginValidation } from '@/validators/auth.validator';
import { createNoteValidation } from '@/validators/notes.validator';

export class IndexRoute implements IRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes(): void {
        // Health check route
        this.router.get('/health', (req, res) => {
            res.status(200).json({ 
                success: true, 
                message: 'Secure Notes API is running',
                timestamp: new Date().toISOString()
            });
        });

        // Authentication Routes
        this.router.post(
            '/auth/register',
            registerValidation,
            validateRequest,
            AuthController.checkEmailExistOrNot,
            AuthController.register
        );

        this.router.post(
            '/auth/login',
            loginValidation,
            validateRequest,
            AuthController.login,
            JWTAuthenticator.encode
        );

        // Notes Routes (Protected with JWT)
        this.router.get(
            '/notes',
            JWTAuthenticator.decode,
            NotesController.getAllNotes
        );

        this.router.post(
            '/notes',
            JWTAuthenticator.decode,
            createNoteValidation,
            validateRequest,
            NotesController.createNote
        );

        this.router.delete(
            '/notes/:id',
            JWTAuthenticator.decode,
            NotesController.deleteNote
        );
    }
}
