import winston from 'winston';
import { CONF_ENV } from '@config/config';
import { Application } from 'express';
import morgan from 'morgan';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = CONF_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
];

export const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

// Morgan HTTP logger
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

export const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => {
            logger.http(message.trim());
        },
    },
});

export function initializeLogger(app: Application): void {
    app.use(morganMiddleware);
}
