import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useVault } from '../context/VaultContext';
import { decryptData } from '../services/encryption';
import { downloadFromWalrus } from '../services/walrus';
import { getVaultItems, deleteVaultItemTransaction } from '../services/sui';
import type { VaultPayload, PasswordPayload, NotePayload } from '../types';

export function ViewItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const { sessionKey } = useVault();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteStep, setDeleteStep] = useState<'signing' | 'confirming' | null>(null);
    const [error, setError] = useState('');
    const [data, setData] = useState<VaultPayload | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch and decrypt item
    const fetchItem = useCallback(async () => {
        if (!id || !account?.address) {
            setIsLoading(false);
            return;
        }

        if (!sessionKey) {
            // If not unlocked, redirect to unlock
            navigate('/unlock');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Find the vault item to get its blob ID
            const vaultItems = await getVaultItems(account.address);
            const vaultItem = vaultItems.find(item => item.id === id);

            if (!vaultItem) {
                throw new Error('Item not found');
            }

            // Download encrypted data from Walrus
            const encryptedData = await downloadFromWalrus(vaultItem.walrus_blob_id);

            // Decrypt locally using Seal with SessionKey
            const decryptedData = await decryptData(
                encryptedData,
                sessionKey,
                vaultItem,
                account.address
            );
            setData(decryptedData);
        } catch (err) {
            console.error('Failed to fetch/decrypt item:', err);
            setError(err instanceof Error ? err.message : 'Failed to decrypt. Please try unlocking again.');
        } finally {
            setIsLoading(false);
        }
    }, [id, sessionKey, account?.address, navigate]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleDelete = async () => {
        if (!id) return;

        setIsDeleting(true);
        setDeleteStep('signing');
        try {
            // Create delete transaction
            const tx = deleteVaultItemTransaction(id);

            // Sign and execute transaction
            signAndExecuteTransaction(
                { transaction: tx },
                {
                    onSuccess: async () => {
                        // Wait for blockchain to index the deletion
                        setDeleteStep('confirming');
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        setDeleteStep(null);
                        navigate('/');
                    },
                    onError: (err) => {
                        console.error('Failed to delete item:', err);
                        setError('Failed to delete item. Please try again.');
                        setIsDeleting(false);
                        setDeleteStep(null);
                        setShowDeleteConfirm(false);
                    },
                }
            );
        } catch (err) {
            console.error('Failed to delete item:', err);
            setError('Failed to delete item. Please try again.');
            setIsDeleting(false);
            setDeleteStep(null);
            setShowDeleteConfirm(false);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const isPasswordEntry = (d: VaultPayload): d is PasswordPayload => d.type === 'password';
    const isNoteEntry = (d: VaultPayload): d is NotePayload => d.type === 'note';

    // Render markdown formatting (bold, italic, underline)
    const renderFormattedText = (text: string): React.ReactNode => {
        // Process in order: underline, bold, italic
        const parts = text.split(/(<u>.*?<\/u>|\*\*.*?\*\*|\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('<u>') && part.endsWith('</u>')) {
                return <u key={index}>{part.slice(3, -4)}</u>;
            } else if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <em key={index}>{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <svg className="animate-spin w-12 h-12 text-owly-teal mx-auto mb-4" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <p className="text-text-secondary">Decrypting...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-danger transition-colors mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Vault
                </Link>

                <div className="card text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Failed to Decrypt</h2>
                    <p className="text-text-secondary mb-4">{error || 'Unable to load this item'}</p>
                    <button onClick={fetchItem} className="btn-secondary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b-2 border-border pb-6 bg-bg-primary">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-danger transition-colors font-bold uppercase text-sm group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    Back to Vault
                </Link>

                <div className="flex items-center gap-4">
                    {/* View on SuiScan */}
                    <a
                        href={`https://suiscan.xyz/testnet/object/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-2 py-1 border-2 border-border bg-bg-secondary font-bold uppercase text-sm hover:bg-bg-primary transition-colors"
                        title="View on SuiScan"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">SuiScan</span>
                    </a>

                    {/* Edit Button */}
                    <Link
                        to={`/edit/${id}`}
                        className="inline-flex items-center gap-2 px-2 py-1 bg-accent-primary font-bold uppercase text-sm hover:opacity-80 transition-opacity"
                        title="Edit entry"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        EDIT
                    </Link>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-text-secondary hover:text-danger transition-colors font-mono text-sm underline decoration-2 underline-offset-4 hover:decoration-danger"
                        title="Delete item"
                    >
                        [ DELETE ENTRY ]
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="brutalist-card p-6 md:p-8 space-y-8">
                {/* Title */}
                <div className="flex items-center gap-6">
                    <div className={`
            w-16 h-16 border-2 border-border flex items-center justify-center font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            ${isPasswordEntry(data)
                            ? 'bg-bg-secondary'
                            : 'bg-accent-primary'
                        }
          `}>
                        {isPasswordEntry(data) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight">{data.title}</h1>
                        <p className="text-sm text-text-secondary font-mono mt-1">
                            CREATED: {formatDate(data.created_at)}
                        </p>
                    </div>
                </div>

                <div className="h-0.5 bg-border w-full"></div>

                {/* Password Entry Fields */}
                {isPasswordEntry(data) && (
                    <div className="space-y-6">
                        {/* Username */}
                        {data.username && (
                            <div className="border-2 border-border p-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-bg-primary">
                                <label className="text-xs font-bold uppercase tracking-wider block mb-2">Username / Email</label>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-lg">{data.username}</span>
                                    <button
                                        onClick={() => handleCopy(data.username, 'username')}
                                        className="text-sm font-bold uppercase hover:bg-accent-primary px-2 py-1 border border-transparent hover:border-border transition-all"
                                    >
                                        {copied === 'username' ? 'COPIED!' : 'COPY'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="border-2 border-border p-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-bg-primary">
                            <label className="text-xs font-bold uppercase tracking-wider block mb-2">Password</label>
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-lg tracking-wider">
                                    {showPassword ? data.password : '•'.repeat(Math.min(data.password.length, 24))}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(data.password, 'password')}
                                        className="text-sm font-bold uppercase hover:bg-accent-primary px-2 py-1 border border-transparent hover:border-border transition-all"
                                    >
                                        {copied === 'password' ? 'COPIED!' : 'COPY'}
                                    </button>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-sm font-bold uppercase hover:bg-accent-primary px-2 py-1 border border-transparent hover:border-border transition-all"
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* URL */}
                        {data.url && (
                            <div className="border-2 border-border p-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-bg-primary">
                                <label className="text-xs font-bold uppercase tracking-wider block mb-2">Website</label>
                                <div>
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-mono hover:underline decoration-2 underline-offset-4 decoration-accent-primary"
                                    >
                                        {data.url}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {data.notes && (
                            <div className="border-2 border-border p-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-bg-primary">
                                <label className="text-xs font-bold uppercase tracking-wider block mb-2">Notes</label>
                                <p className="text-text-secondary whitespace-pre-wrap font-mono text-sm leading-relaxed">{data.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Note Entry Fields */}
                {isNoteEntry(data) && (
                    <div className="space-y-6">
                        {/* Tags */}
                        {data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 border border-border bg-accent-primary text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Body */}
                        <div
                            className="border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
                        >
                            <p className="text-text-primary whitespace-pre-wrap font-mono leading-relaxed">
                                {data.body.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {renderFormattedText(line)}
                                        {i < data.body.split('\n').length - 1 && <br />}
                                    </span>
                                ))}
                            </p>
                        </div>

                        {/* Attached Images */}
                        {data.images && data.images.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase text-text-secondary">Attached Images ({data.images.length})</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {data.images.map((img, index) => (
                                        <div key={index} className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                                            <img
                                                src={img}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => window.open(img, '_blank')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-bg-primary/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="brutalist-card max-w-md w-full animate-fadeIn p-8 border-2 border-danger shadow-[8px_8px_0px_0px_#ef4444]">
                        <h3 className="text-2xl font-bold text-danger mb-4 uppercase">Delete Entry?</h3>
                        <p className="text-text-primary mb-8 font-mono text-sm leading-relaxed">
                            WARNING: This action will permanently remove "{data.title}" from your encrypted vault. This cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="brutalist-btn brutalist-btn-secondary flex-1"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="brutalist-btn flex-1 !bg-danger !text-white !border-danger hover:!bg-danger/90"
                            >
                                {isDeleting ? (
                                    deleteStep === 'signing' ? 'SIGNING...' :
                                        deleteStep === 'confirming' ? 'CONFIRMING ON BLOCKCHAIN...' :
                                            'DELETING...'
                                ) : 'CONFIRM DELETE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
