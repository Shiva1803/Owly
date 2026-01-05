// Walrus Storage Service
// Handles uploading and downloading encrypted blobs

import { getNetworkConfig } from '../config/network';

interface WalrusStoreResponse {
    newlyCreated?: {
        blobObject: {
            id: string;
            blobId: string;
            size: number;
        };
    };
    alreadyCertified?: {
        blobId: string;
    };
}

/**
 * Uploads encrypted data to Walrus
 * Returns the blob ID for retrieval
 */
export async function uploadToWalrus(data: Uint8Array): Promise<string> {
    const config = getNetworkConfig();

    // Create a copy of the data as ArrayBuffer for fetch compatibility
    const arrayBuffer = new ArrayBuffer(data.length);
    new Uint8Array(arrayBuffer).set(data);

    const response = await fetch(`${config.walrusPublisherUrl}/v1/blobs`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload to Walrus: ${response.statusText}`);
    }

    const result: WalrusStoreResponse = await response.json();

    // Return blob ID (either newly created or already existing)
    if (result.newlyCreated) {
        return result.newlyCreated.blobObject.blobId;
    } else if (result.alreadyCertified) {
        return result.alreadyCertified.blobId;
    }

    throw new Error('Unexpected Walrus response format');
}

/**
 * Downloads encrypted data from Walrus
 */
export async function downloadFromWalrus(blobId: string): Promise<Uint8Array> {
    const config = getNetworkConfig();

    const response = await fetch(`${config.walrusAggregatorUrl}/v1/blobs/${blobId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Failed to download from Walrus: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
}
