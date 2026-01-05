import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import type { VaultItem, VaultPayload } from '../types';
import { VaultItemCard } from '../components/VaultItemCard';
import { getVaultItems } from '../services/sui';
import { downloadFromWalrus } from '../services/walrus';
import { decryptData } from '../services/encryption';
import { useVault } from '../context/VaultContext';

interface DecryptedItem {
    item: VaultItem;
    title: string;
    created_at: number;
}

export function VaultListPage() {
    const [items, setItems] = useState<DecryptedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'password' | 'note'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const account = useCurrentAccount();
    const { masterKey } = useVault();
    const location = useLocation();

    // Fetch and decrypt vault items
    const fetchItems = async () => {
        if (!account?.address || !masterKey) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setLoadingProgress({ current: 0, total: 0 });

        try {
            // Fetch vault items from Sui blockchain
            const vaultItems = await getVaultItems(account.address);
            setLoadingProgress({ current: 0, total: vaultItems.length });

            if (vaultItems.length === 0) {
                setItems([]);
                setIsLoading(false);
                return;
            }

            // Decrypt each item to get titles
            const decryptedItems: DecryptedItem[] = [];

            for (let i = 0; i < vaultItems.length; i++) {
                const item = vaultItems[i];
                setLoadingProgress({ current: i + 1, total: vaultItems.length });

                try {
                    // Download encrypted data from Walrus
                    const encryptedData = await downloadFromWalrus(item.walrus_blob_id);

                    // Decrypt with master key
                    const decryptedPayload = await decryptData(encryptedData, masterKey) as VaultPayload;

                    decryptedItems.push({
                        item,
                        title: decryptedPayload.title,
                        created_at: decryptedPayload.created_at || item.created_at,
                    });
                } catch (decryptError) {
                    console.error(`Failed to decrypt item ${item.id}:`, decryptError);
                    // Add with fallback title
                    decryptedItems.push({
                        item,
                        title: 'Unable to decrypt',
                        created_at: item.created_at,
                    });
                }
            }

            setItems(decryptedItems);
        } catch (err) {
            console.error('Failed to fetch vault items:', err);
            setError('Failed to load vault items. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch when navigating to this page (handles returning from /new or /edit)
    useEffect(() => {
        fetchItems();
    }, [account?.address, masterKey, location.key]);

    // Filter and search
    const filteredItems = items.filter((entry) => {
        // Category filter
        if (filter !== 'all' && entry.item.category !== filter) return false;

        // Search filter
        if (searchQuery) {
            return entry.title.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
    });

    const passwordCount = items.filter((e) => e.item.category === 'password').length;
    const noteCount = items.filter((e) => e.item.category === 'note').length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 border-b-2 border-border pb-6">
                <div className="bg-bg-primary inline-block pr-4">
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Your Vault</h1>
                    <p className="text-text-secondary mt-1 font-mono text-sm">
                        {items.length === 0
                            ? 'VAULT IS EMPTY.'
                            : `[ ${items.length} ENCRYPTED ${items.length === 1 ? 'ITEM' : 'ITEMS'} ]`
                        }
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Link
                        to="/change-password"
                        className="brutalist-btn brutalist-btn-secondary flex-1 sm:flex-none justify-center items-center gap-2"
                        title="Change Master Password"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                        <span className="hidden sm:inline">Change Password</span>
                    </Link>
                    <Link to="/new" className="brutalist-btn flex-1 sm:flex-none justify-center items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span className="sm:inline">New Entry</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="brutalist-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-border bg-accent-primary flex items-center justify-center font-bold text-xl shrink-0">
                        Σ
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-none">{items.length}</p>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Total Items</p>
                    </div>
                </div>

                <div className="brutalist-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-border bg-bg-secondary flex items-center justify-center font-bold shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-none">{passwordCount}</p>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Passwords</p>
                    </div>
                </div>

                <div className="brutalist-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-border bg-accent-primary flex items-center justify-center font-bold shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-none">{noteCount}</p>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Notes</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {items.length > 0 && (
                <div className="mb-6">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-border bg-bg-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            {items.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                    {(['all', 'password', 'note'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                px-6 py-2 border-2 border-border text-sm font-bold uppercase tracking-wider transition-all flex-1 sm:flex-none
                ${filter === f
                                    ? 'bg-text-primary text-bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                    : 'bg-white text-text-primary hover:bg-bg-secondary'
                                }
              `}
                        >
                            {f === 'all' ? 'All Items' : f === 'password' ? 'Passwords' : 'Notes'}
                        </button>
                    ))}
                </div>
            )}

            {/* Items List */}
            {error ? (
                <div className="flex items-center justify-center py-16 border-2 border-danger border-dashed bg-danger/5">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-danger bg-danger/10 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-xl font-bold text-danger mb-2">ERROR LOADING VAULT</p>
                        <p className="text-text-secondary text-sm mb-4 font-mono">{error}</p>
                        <button
                            onClick={() => fetchItems()}
                            className="brutalist-btn"
                        >
                            RETRY
                        </button>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center py-16 border-2 border-border border-dashed bg-bg-secondary/50">
                    <div className="text-center">
                        <p className="text-xl font-bold animate-pulse mb-2">DECRYPTING VAULT...</p>
                        {loadingProgress.total > 0 && (
                            <>
                                <p className="text-sm text-text-secondary font-mono mb-4">
                                    {loadingProgress.current} / {loadingProgress.total} items
                                </p>
                                <div className="w-64 h-2 bg-bg-secondary border border-border mx-auto">
                                    <div
                                        className="h-full bg-accent-primary transition-all"
                                        style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 border-2 border-border border-dashed bg-bg-primary">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-border bg-bg-secondary mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-text-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">
                        {items.length === 0 ? 'Vault Empty' : searchQuery ? 'No matches found' : 'No matches found'}
                    </h3>
                    <p className="text-text-secondary font-mono mb-8">
                        {items.length === 0
                            ? 'Initialize your secure storage by creating an entry.'
                            : searchQuery
                                ? `No items match "${searchQuery}"`
                                : 'Adjust filters to locate items.'
                        }
                    </p>
                    {items.length === 0 && (
                        <Link to="/new" className="brutalist-btn inline-flex items-center gap-2">
                            Initialize Entry
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map((entry) => (
                        <VaultItemCard
                            key={entry.item.id}
                            item={{
                                ...entry.item,
                                created_at: entry.created_at
                            }}
                            title={entry.title}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
