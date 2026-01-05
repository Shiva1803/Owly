// Sui Blockchain Service
// Handles VaultItem creation and retrieval on-chain

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { getNetworkConfig, SUI_NETWORK } from '../config/network';
import type { VaultItem, VaultCategory } from '../types';

// Initialize Sui client
const config = getNetworkConfig();
export const suiClient = new SuiClient({ url: config.suiRpcUrl });

// Category mapping
const CATEGORY_MAP: Record<VaultCategory, number> = {
    note: 0,
    password: 1,
};

const REVERSE_CATEGORY_MAP: Record<number, VaultCategory> = {
    0: 'note',
    1: 'password',
};

/**
 * Creates a VaultItem transaction (to be signed by wallet)
 */
export function createVaultItemTransaction(
    blobId: string,
    category: VaultCategory
): Transaction {
    const tx = new Transaction();

    tx.moveCall({
        target: `${config.vaultContractPackageId}::${config.vaultContractModuleName}::create_vault_item`,
        arguments: [
            tx.pure.vector('u8', Array.from(new TextEncoder().encode(blobId))),
            tx.pure.u8(CATEGORY_MAP[category]),
        ],
    });

    return tx;
}

/**
 * Creates a delete VaultItem transaction
 */
export function deleteVaultItemTransaction(itemId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
        target: `${config.vaultContractPackageId}::${config.vaultContractModuleName}::delete_vault_item`,
        arguments: [tx.object(itemId)],
    });

    return tx;
}

/**
 * Fetches all VaultItems owned by an address
 */
export async function getVaultItems(owner: string): Promise<VaultItem[]> {
    // For now, we'll use a simple approach without the contract
    // In production, this would query the on-chain VaultItem objects

    // Get objects owned by the address
    const objects = await suiClient.getOwnedObjects({
        owner,
        options: {
            showContent: true,
            showType: true,
        },
    });

    const items: VaultItem[] = [];

    for (const obj of objects.data) {
        if (obj.data?.content?.dataType === 'moveObject') {
            const type = obj.data.content.type;

            // Check if this is a VaultItem
            if (type.includes('::vault::VaultItem')) {
                const fields = obj.data.content.fields as Record<string, unknown>;

                items.push({
                    id: obj.data.objectId,
                    owner,
                    walrus_blob_id: decodeVectorU8(fields.walrus_blob_id as number[]),
                    created_at: Number(fields.created_at),
                    category: REVERSE_CATEGORY_MAP[Number(fields.category)] || 'note',
                });
            }
        }
    }

    return items;
}

/**
 * Helper to decode vector<u8> from Move
 */
function decodeVectorU8(bytes: number[]): string {
    return new TextDecoder().decode(new Uint8Array(bytes));
}

/**
 * Get network name for display
 */
export function getNetworkName(): string {
    return SUI_NETWORK.charAt(0).toUpperCase() + SUI_NETWORK.slice(1);
}
