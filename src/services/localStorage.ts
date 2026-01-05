// Local storage service for demo mode
// This allows testing the app without deploying the smart contract

import type { VaultItem, VaultCategory } from '../types';

const STORAGE_KEY = 'owly_demo_items';

interface StoredItem {
    id: string;
    blobId: string;
    encryptedData: string; // Base64 encoded
    category: VaultCategory;
    created_at: number;
}

/**
 * Save encrypted data locally and return a mock blob ID
 */
export function saveLocalItem(
    encryptedData: Uint8Array,
    category: VaultCategory
): { id: string; blobId: string } {
    const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const blobId = `local_blob_${id}`;

    // Convert to base64 for localStorage
    const base64Data = btoa(String.fromCharCode(...encryptedData));

    const items = getStoredItems();
    items.push({
        id,
        blobId,
        encryptedData: base64Data,
        category,
        created_at: Math.floor(Date.now() / 1000),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    return { id, blobId };
}

/**
 * Get all local vault items
 */
export function getLocalItems(owner: string): VaultItem[] {
    const items = getStoredItems();
    return items.map((item) => ({
        id: item.id,
        owner,
        walrus_blob_id: item.blobId,
        created_at: item.created_at,
        category: item.category,
    }));
}

/**
 * Get encrypted data for a specific item
 */
export function getLocalItemData(id: string): Uint8Array | null {
    const items = getStoredItems();
    const item = items.find((i) => i.id === id);

    if (!item) return null;

    // Convert from base64
    const binaryString = atob(item.encryptedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

/**
 * Update an existing local item
 */
export function updateLocalItem(
    id: string,
    encryptedData: Uint8Array,
    category: VaultCategory
): boolean {
    const items = getStoredItems();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return false;

    // Convert to base64 for localStorage
    const base64Data = btoa(String.fromCharCode(...encryptedData));

    items[index] = {
        ...items[index],
        encryptedData: base64Data,
        category,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
}

/**
 * Delete a local item
 */
export function deleteLocalItem(id: string): boolean {
    const items = getStoredItems();
    const filtered = items.filter((i) => i.id !== id);

    if (filtered.length === items.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

function getStoredItems(): StoredItem[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

