import * as dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '5000', 10);
export const CONF_ENV: string = process.env.NODE_ENV || 'development';
export const MONGO_APP_URL: string = process.env.MONGO_APP_URL || 'mongodb://localhost:27017/secure-notes';
export const MONGO_DEBUG: string = process.env.MONGO_DEBUG || 'false';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '24h';
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
export const JWT_REFRESH_EXPIRY: string = process.env.JWT_REFRESH_EXPIRY || '7d';
export const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key';
