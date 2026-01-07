// Encryption service using Mysten Seal
// Zero-knowledge: Encryption happens locally, keys are managed by decentralized Seal network

import { SealClient, SessionKey, type SealCompatibleClient, type KeyServerConfig } from '@mysten/seal';
import { Transaction } from '@mysten/sui/transactions';
import { getNetworkConfig } from '../config/network';
import { suiClient } from './sui';
import type { VaultPayload, VaultItem } from '../types';

let sealClientInstance: SealClient | null = null;

/**
 * Initializes the Seal Client with network configuration
 */
export function getSealClient(): SealClient {
    if (sealClientInstance) return sealClientInstance;

    const config = getNetworkConfig();

    // We cast the suiClient to SealCompatibleClient as the types are compatible enough for runtime
    sealClientInstance = new SealClient({
        suiClient: suiClient as unknown as SealCompatibleClient,
        serverConfigs: config.sealKeyServers as unknown as KeyServerConfig[],
        verifyKeyServers: true,
    });

    return sealClientInstance;
}

/**
 * Creates a SessionKey for the user
 * This must be called during unlock and the user must sign the personal message
 */
export async function createSessionKey(
    address: string,
    ttlMinutes: number = 15
): Promise<SessionKey> {
    const config = getNetworkConfig();

    const sessionKey = await SessionKey.create({
        address,
        packageId: config.vaultContractPackageId,
        ttlMin: ttlMinutes,
        suiClient: suiClient as unknown as SealCompatibleClient,
    });

    return sessionKey;
}

/**
 * Gets the personal message bytes that the user needs to sign
 */
export function getPersonalMessage(sessionKey: SessionKey): Uint8Array {
    return sessionKey.getPersonalMessage();
}

/**
 * Sets the personal message signature on the session key
 */
export async function setPersonalMessageSignature(
    sessionKey: SessionKey,
    signature: string
): Promise<void> {
    await sessionKey.setPersonalMessageSignature(signature);
}

/**
 * Normalizes a Sui address to a full 64-character hex string with 0x prefix
 * This ensures consistent bytes when Seal SDK calls fromHex() on it,
 * matching Move's address.to_bytes() output.
 */
function normalizeAddress(address: string): string {
    // Remove 0x prefix if present
    const hex = address.startsWith('0x') ? address.slice(2) : address;
    // Pad to 64 characters (32 bytes) if needed
    const paddedHex = hex.padStart(64, '0');
    return '0x' + paddedHex;
}

/**
 * Encrypts vault data using Seal (Identity-Based Encryption)
 * The 'id' is the user's wallet address (normalized hex format).
 */
export async function encryptData(
    data: VaultPayload,
    ownerAddress: string
): Promise<Uint8Array> {
    const client = getSealClient();
    const config = getNetworkConfig();
    const encoder = new TextEncoder();

    // Serialize data
    const jsonData = JSON.stringify(data);
    const plaintext = encoder.encode(jsonData);

    // Normalize address to ensure consistent encoding
    const normalizedAddress = normalizeAddress(ownerAddress);

    // Encrypt using Seal
    // The id is the owner's normalized address - this is what seal_approve verifies
    const result = await client.encrypt({
        threshold: 1,
        packageId: config.vaultContractPackageId,
        id: normalizedAddress,
        data: plaintext,
    });

    return result.encryptedObject;
}

/**
 * Converts a hex address string (with or without 0x prefix) to raw bytes
 * This matches Move's address.to_bytes() output
 */
function addressToBytes(address: string): Uint8Array {
    // Remove 0x prefix if present
    const hex = address.startsWith('0x') ? address.slice(2) : address;
    // Pad to 64 characters (32 bytes) if needed
    const paddedHex = hex.padStart(64, '0');
    // Convert hex string to Uint8Array
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        bytes[i] = parseInt(paddedHex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

/**
 * Builds transaction bytes for seal_approve call
 * This is needed for decryption - proves to key servers that user has access
 */
export async function buildSealApproveTransaction(
    vaultItem: VaultItem,
    ownerAddress: string
): Promise<Uint8Array> {
    const config = getNetworkConfig();

    const tx = new Transaction();

    // Convert address to raw bytes (matching Move's address.to_bytes())
    const addressBytes = addressToBytes(ownerAddress);

    // Call seal_approve with the key_id (owner address bytes) and the vault item
    tx.moveCall({
        target: `${config.vaultContractPackageId}::${config.vaultContractModuleName}::seal_approve`,
        arguments: [
            // key_id: the owner's address as raw bytes (matching Move's to_bytes())
            tx.pure.vector('u8', Array.from(addressBytes)),
            // item: the VaultItem object
            tx.object(vaultItem.id),
        ],
    });

    // Build only the transaction kind (not a full transaction)
    const txBytes = await tx.build({
        client: suiClient,
        onlyTransactionKind: true,
    });

    return txBytes;
}

/**
 * Decrypts vault data using Seal
 * Requires a valid session key with signed personal message
 */
export async function decryptData(
    encryptedData: Uint8Array,
    sessionKey: SessionKey,
    vaultItem: VaultItem,
    ownerAddress: string
): Promise<VaultPayload> {
    const client = getSealClient();

    // Build the transaction bytes for seal_approve
    const txBytes = await buildSealApproveTransaction(vaultItem, ownerAddress);

    // Decrypt
    const plaintext = await client.decrypt({
        data: encryptedData,
        sessionKey,
        txBytes,
    });

    // Parse JSON
    const decoder = new TextDecoder();
    const jsonData = decoder.decode(plaintext);
    return JSON.parse(jsonData) as VaultPayload;
}

/**
 * Generates a strong password
 */
export function generatePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }
    return password;
}

/**
 * Calculates password strength (0-4)
 */
export function calculatePasswordStrength(password: string): number {
    let score = 0;
    if (!password) return 0;

    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4);
}
