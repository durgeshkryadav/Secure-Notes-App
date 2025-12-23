import Database from '@common/Database';
import { IRoutes } from '@common/interfaces/IRoutes';
import errorMiddleware from '@common/middlewares/error';
import * as config from '@config/config';
import { IndexRoute } from '@routes/index';
import { initializeLogger, logger } from '@utils/logger';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import * as http from 'http';
import { RESPONSE_CODE, RESPONSE_FAILURE } from './common/Constants';
import { sendResponse } from './utils/common';

export default class App {
    public app: Application;
    public port: string | number;
    public env: string;
    private server?: http.Server;

    constructor() {
        this.app = express();
        this.port = config.PORT;
        this.env = config.CONF_ENV;
        initializeLogger(this.app);
    }

    public async initialize(): Promise<void> {
        await Database.connectDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(new IndexRoute());
        this.initializeErrorHandling();
    }

    public async start(): Promise<void> {
        this.server = this.app.listen(this.port, () => {
            logger.info(`==========================================`);
            logger.info(`🚀 Secure Notes API (${this.env}) listening on port ${this.port}`);
            logger.info(`==========================================`);
        });
    }

    public async disconnect(): Promise<void> {
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server?.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        }
    }

    public getServer(): Application {
        return this.app;
    }

    private initializeMiddlewares(): void {
        // Security middleware
        this.app.use(
            cors({
                origin: '*',
                credentials: true,
            })
        );
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());

        // Body parsing middleware
        this.app.use(bodyParser.json({ limit: '2mb' }));
        this.app.use(
            express.urlencoded({
                limit: '3mb',
                extended: true,
            })
        );

        // CORS headers
        this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, content-type');
            
            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }
            next();
        });
    }

    private initializeRoutes(routes: IRoutes): void {
        // Mount API routes under /api prefix
        this.app.use('/api', routes.router);

        // Root endpoint
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                success: true,
                message: 'Welcome to Secure Notes API',
                version: '1.0.0',
                endpoints: {
                    health: 'GET /api/health',
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    notes: {
                        getAll: 'GET /api/notes',
                        create: 'POST /api/notes',
                        delete: 'DELETE /api/notes/:id',
                    },
                },
            });
        });

        // 404 handler
        this.app.use('*', (req: Request, res: Response) => {
            return sendResponse(
                res,
                undefined,
                `Cannot ${req.method} ${req.originalUrl}`,
                RESPONSE_FAILURE,
                RESPONSE_CODE.NOT_FOUND
            );
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(errorMiddleware);
    }
}
