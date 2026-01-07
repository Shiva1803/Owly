// Walrus Storage Service
// Handles uploading and downloading encrypted blobs

import { getNetworkConfig } from '../config/network';

interface WalrusStoreResponse {
    newlyCreated?: {
        blobObject: {
            id: string;
            blobId: string;
            size: number;
            endEpoch: number;
        };
    };
    alreadyCertified?: {
        blobId: string;
        endEpoch: number;
    };
}

// Storage duration in epochs
// Testnet: 1 epoch = ~1 day, so 200 epochs = ~200 days
// Mainnet: 1 epoch = ~2 weeks, so 200 epochs = ~7.5 years
const STORAGE_EPOCHS = 200;

/**
 * Uploads encrypted data to Walrus
 * Returns the blob ID for retrieval
 * Stores for STORAGE_EPOCHS epochs (approximately 200 days on testnet, 7.5 years on mainnet)
 */
export async function uploadToWalrus(data: Uint8Array): Promise<string> {
    const config = getNetworkConfig();

    // Create a copy of the data as ArrayBuffer for fetch compatibility
    const arrayBuffer = new ArrayBuffer(data.length);
    new Uint8Array(arrayBuffer).set(data);

    // Add epochs parameter for longer storage duration
    const response = await fetch(`${config.walrusPublisherUrl}/v1/blobs?epochs=${STORAGE_EPOCHS}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload to Walrus: ${response.statusText} - ${errorText}`);
    }

    const result: WalrusStoreResponse = await response.json();

    // Return blob ID (either newly created or already existing)
    if (result.newlyCreated) {
        console.log(`Blob stored until epoch ${result.newlyCreated.blobObject.endEpoch}`);
        return result.newlyCreated.blobObject.blobId;
    } else if (result.alreadyCertified) {
        console.log(`Blob already exists, expires at epoch ${result.alreadyCertified.endEpoch}`);
        return result.alreadyCertified.blobId;
    }

    throw new Error('Unexpected Walrus response format');
}

/**
 * Downloads encrypted data from Walrus
 * Throws error if blob has expired or cannot be found
 */
export async function downloadFromWalrus(blobId: string): Promise<Uint8Array> {
    const config = getNetworkConfig();

    try {
        const response = await fetch(`${config.walrusAggregatorUrl}/v1/blobs/${blobId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Blob not found or expired. The data may have been stored with insufficient epochs.`);
            }
            throw new Error(`Failed to download from Walrus: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Network error downloading from Walrus: ${String(error)}`);
    }
}
