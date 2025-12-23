import * as CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@config/config';

/**
 * Utility class for AES encryption/decryption
 * Used for encrypting note content on server side if needed
 */
export default class CryptoService {
    /**
     * Encrypt data using AES encryption
     */
    static encrypt(data: string): string {
        try {
            return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
        } catch (error) {
            throw new Error('Encryption failed');
        }
    }

    /**
     * Decrypt AES encrypted data
     */
    static decrypt(encryptedData: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedData) {
                throw new Error('Decryption resulted in empty string');
            }
            return decryptedData;
        } catch (error) {
            throw new Error('Decryption failed');
        }
    }

    /**
     * Verify if string is encrypted
     */
    static isEncrypted(data: string): boolean {
        try {
            CryptoJS.AES.decrypt(data, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            return true;
        } catch {
            return false;
        }
    }
}
