/// Owly Smart Contract
/// Stores metadata and Walrus blob references for encrypted vault items
module vault::vault {
    use sui::event;

    /// Category: 0 = note, 1 = password
    public struct VaultItem has key, store {
        id: UID,
        walrus_blob_id: vector<u8>,
        created_at: u64,
        category: u8,
    }

    /// Event emitted when a vault item is created
    public struct VaultItemCreated has copy, drop {
        item_id: ID,
        owner: address,
        category: u8,
    }

    /// Event emitted when a vault item is deleted
    public struct VaultItemDeleted has copy, drop {
        item_id: ID,
        owner: address,
    }

    /// Create a new vault item
    /// The encrypted data is stored on Walrus, identified by blob_id
    public entry fun create_vault_item(
        walrus_blob_id: vector<u8>,
        category: u8,
        ctx: &mut TxContext
    ) {
        let item = VaultItem {
            id: object::new(ctx),
            walrus_blob_id,
            created_at: tx_context::epoch(ctx),
            category,
        };
        
        let item_id = object::id(&item);
        let owner = tx_context::sender(ctx);
        
        // Emit creation event
        event::emit(VaultItemCreated {
            item_id,
            owner,
            category,
        });
        
        // Transfer to sender (owner controls the object)
        transfer::transfer(item, owner);
    }

    /// Delete a vault item
    /// Only the owner can delete their items (enforced by ownership)
    public entry fun delete_vault_item(item: VaultItem, ctx: &TxContext) {
        let item_id = object::id(&item);
        let owner = tx_context::sender(ctx);
        
        // Emit deletion event
        event::emit(VaultItemDeleted {
            item_id,
            owner,
        });
        
        // Destructure and delete
        let VaultItem { 
            id, 
            walrus_blob_id: _, 
            created_at: _, 
            category: _ 
        } = item;
        object::delete(id);
    }

    /// Get the Walrus blob ID from a vault item
    public fun get_blob_id(item: &VaultItem): vector<u8> {
        item.walrus_blob_id
    }

    /// Get the category of a vault item
    public fun get_category(item: &VaultItem): u8 {
        item.category
    }

    /// Get the creation timestamp of a vault item
    public fun get_created_at(item: &VaultItem): u64 {
        item.created_at
    }

    /// Seal Access Control
    /// Error: Caller does not have access to decrypt
    const ENoAccess: u64 = 1;

    /// Seal approve function - called by Seal SDK to verify decryption access
    /// Only the owner of the VaultItem can decrypt its contents
    /// The key_id must match the owner's address (set during encryption)
    /// Key format: [owner address bytes]
    entry fun seal_approve(key_id: vector<u8>, _item: &VaultItem, ctx: &TxContext) {
        // Get the caller's address (owner of the item, enforced by Sui)
        let caller = tx_context::sender(ctx);
        
        // The key_id used for encryption should be the owner's address
        // This ensures only the owner can decrypt
        assert!(key_id == caller.to_bytes(), ENoAccess);
    }
}
