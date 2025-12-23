import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '../constants';

/**
 * Encrypt text using AES encryption
 */
export const encryptText = (text: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY);
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text using AES encryption
 */
export const decryptText = (encryptedText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const text = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!text) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return text;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};
