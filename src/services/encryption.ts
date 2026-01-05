// Encryption service using Web Crypto API
// Zero-knowledge: All encryption/decryption happens locally

import type { VaultPayload } from '../types';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Derives an encryption key from master password and wallet address
 * Key = PBKDF2(masterPassword, SHA256(walletAddress))
 */
export async function deriveKey(
    masterPassword: string,
    walletAddress: string
): Promise<CryptoKey> {
    const encoder = new TextEncoder();

    // Use wallet address as salt (hashed)
    const saltBuffer = await crypto.subtle.digest(
        'SHA-256',
        encoder.encode(walletAddress.toLowerCase())
    );

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(masterPassword),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    // Derive AES-GCM key
    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: KEY_LENGTH,
        },
        false, // Not extractable
        ['encrypt', 'decrypt']
    );

    return key;
}

/**
 * Encrypts vault data with the master key
 * Format: [salt(16)] [iv(12)] [ciphertext]
 */
export async function encryptData(
    data: VaultPayload,
    key: CryptoKey
): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const jsonData = JSON.stringify(data);
    const plaintext = encoder.encode(jsonData);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Generate random salt (for additional entropy in storage)
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

    // Encrypt
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        plaintext
    );

    // Combine: salt + iv + ciphertext
    const result = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
    result.set(salt, 0);
    result.set(iv, SALT_LENGTH);
    result.set(new Uint8Array(ciphertext), SALT_LENGTH + IV_LENGTH);

    return result;
}

/**
 * Decrypts vault data with the master key
 */
export async function decryptData(
    encryptedData: Uint8Array,
    key: CryptoKey
): Promise<VaultPayload> {
    // Extract components
    // const salt = encryptedData.slice(0, SALT_LENGTH); // Salt not needed for decryption
    const iv = encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = encryptedData.slice(SALT_LENGTH + IV_LENGTH);

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        ciphertext
    );

    // Parse JSON
    const decoder = new TextDecoder();
    const jsonData = decoder.decode(plaintext);
    return JSON.parse(jsonData) as VaultPayload;
}

/**
 * Generates a secure random password
 */
export function generatePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const randomValues = crypto.getRandomValues(new Uint32Array(length));
    return Array.from(randomValues)
        .map((val) => charset[val % charset.length])
        .join('');
}

/**
 * Calculates password strength (0-4 scale)
 */
export function calculatePasswordStrength(password: string): number {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
}
