// Owly Type Definitions

export type VaultCategory = 'note' | 'password';

// Encrypted payload stored on Walrus
export interface NotePayload {
    type: 'note';
    title: string;
    body: string;
    tags: string[];
    backgroundColor?: string;
    images?: string[]; // Base64 encoded images
    created_at: number;
    updated_at: number;
}

export interface PasswordPayload {
    type: 'password';
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
    created_at: number;
    updated_at: number;
}

export type VaultPayload = NotePayload | PasswordPayload;

// On-chain VaultItem object (from Sui)
export interface VaultItem {
    id: string;
    owner: string;
    walrus_blob_id: string;
    created_at: number;
    category: VaultCategory;
}

// Decrypted vault entry (combined on-chain + decrypted data)
export interface DecryptedVaultEntry {
    item: VaultItem;
    data: VaultPayload;
}



// Form states
export interface NewNoteForm {
    title: string;
    body: string;
    tags: string[];
}

export interface NewPasswordForm {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
}
