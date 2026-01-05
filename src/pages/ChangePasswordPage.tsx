import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useVault } from '../context/VaultContext';
import { deriveKey, encryptData, decryptData } from '../services/encryption';
import { getVaultItems, deleteVaultItemTransaction, createVaultItemTransaction } from '../services/sui';
import { uploadToWalrus, downloadFromWalrus } from '../services/walrus';
import { PasswordInput } from '../components/PasswordInput';

type ProgressStep = 'idle' | 'verifying' | 'fetching' | 'reencrypting' | 'uploading' | 'complete';

export function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progressStep, setProgressStep] = useState<ProgressStep>('idle');
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { masterKey, setMasterKey } = useVault();
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();

        if (!account?.address || !masterKey) {
            setError('Please connect your wallet and unlock your vault first');
            return;
        }

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setIsLoading(true);
        setError('');
        setProgressStep('verifying');

        try {
            // Step 1: Verify current password by re-deriving the key
            const verifyKey = await deriveKey(currentPassword, account.address);

            // Step 2: Fetch all vault items
            setProgressStep('fetching');
            const items = await getVaultItems(account.address);

            if (items.length === 0) {
                // No items to re-encrypt, just update the password
                const newKey = await deriveKey(newPassword, account.address);
                setMasterKey(newKey);
                setSuccess(true);
                setProgressStep('complete');
                return;
            }

            setProgress({ current: 0, total: items.length });
            setProgressStep('reencrypting');

            // Step 3: Derive new key
            const newKey = await deriveKey(newPassword, account.address);

            // Step 4: Re-encrypt each item
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                setProgress({ current: i + 1, total: items.length });

                try {
                    // Download encrypted data from Walrus
                    const encryptedData = await downloadFromWalrus(item.walrus_blob_id);

                    // Decrypt with old key
                    const decryptedPayload = await decryptData(encryptedData, verifyKey);

                    // Re-encrypt with new key
                    const reEncryptedData = await encryptData(decryptedPayload, newKey);

                    // Upload to Walrus
                    setProgressStep('uploading');
                    const newBlobId = await uploadToWalrus(reEncryptedData);

                    // Delete old VaultItem from Sui
                    const deleteTx = deleteVaultItemTransaction(item.id);
                    await signAndExecuteTransaction({ transaction: deleteTx });

                    // Create new VaultItem with new blobId
                    const createTx = createVaultItemTransaction(newBlobId, item.category);
                    await signAndExecuteTransaction({ transaction: createTx });

                    setProgressStep('reencrypting');
                } catch (itemError) {
                    console.error(`Failed to re-encrypt item ${item.id}:`, itemError);
                    throw new Error(`Failed to re-encrypt item. Password change aborted.`);
                }
            }

            // Step 5: Update master key in context
            setMasterKey(newKey);
            setSuccess(true);
            setProgressStep('complete');

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error('Password change failed:', err);
            if (err instanceof Error && err.message.includes('decrypt')) {
                setError('Current password is incorrect');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to change password. Please try again.');
            }
            setProgressStep('idle');
        } finally {
            setIsLoading(false);
        }
    };

    const getProgressMessage = () => {
        switch (progressStep) {
            case 'verifying':
                return 'Verifying current password...';
            case 'fetching':
                return 'Fetching vault items...';
            case 'reencrypting':
                return `Re-encrypting items (${progress.current}/${progress.total})...`;
            case 'uploading':
                return `Uploading encrypted data (${progress.current}/${progress.total})...`;
            case 'complete':
                return 'Password changed successfully!';
            default:
                return '';
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md animate-fadeIn">
                    <div className="brutalist-card p-8 text-center space-y-6">
                        <div className="w-16 h-16 mx-auto flex items-center justify-center border-2 border-border bg-accent-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold uppercase">Password Changed!</h2>
                        <p className="text-text-secondary font-mono text-sm">
                            Your master password has been updated and all vault items have been re-encrypted.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="brutalist-btn w-full"
                        >
                            Back to Vault
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fadeIn">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase hover:text-danger transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Vault
                    </Link>
                </div>

                {/* Form */}
                <div className="brutalist-card p-6 md:p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold uppercase mb-2">Change Master Password</h2>
                        <div className="h-0.5 bg-border w-12 mx-auto mb-4"></div>
                        <p className="text-sm text-text-secondary font-mono">
                            All vault items will be re-encrypted with your new password
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="border-2 border-danger p-4 bg-danger/10">
                        <p className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            WARNING
                        </p>
                        <p className="text-xs font-mono text-text-primary">
                            This action cannot be undone. Make sure to remember your new password - it cannot be recovered.
                        </p>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase" htmlFor="current-password">
                                Current Password
                            </label>
                            <PasswordInput
                                id="current-password"
                                value={currentPassword}
                                onChange={setCurrentPassword}
                                placeholder="Enter current password"
                                label=""
                            />
                        </div>

                        <div className="border-t-2 border-border pt-4 space-y-2">
                            <label className="text-sm font-bold uppercase" htmlFor="new-password">
                                New Password
                            </label>
                            <PasswordInput
                                id="new-password"
                                value={newPassword}
                                onChange={setNewPassword}
                                placeholder="Enter new password (min 8 chars)"
                                label=""
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase" htmlFor="confirm-new-password">
                                Confirm New Password
                            </label>
                            <PasswordInput
                                id="confirm-new-password"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                placeholder="Confirm new password"
                                label=""
                            />
                        </div>

                        {/* Progress */}
                        {isLoading && (
                            <div className="border-2 border-accent-primary p-4 bg-accent-primary/10">
                                <p className="text-sm font-mono text-center">{getProgressMessage()}</p>
                                {progress.total > 0 && (
                                    <div className="mt-2 h-2 bg-bg-secondary border border-border">
                                        <div
                                            className="h-full bg-accent-primary transition-all"
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="text-sm font-bold text-danger border-2 border-danger p-3 bg-danger/10">
                                ! {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                            className="brutalist-btn w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        >
                            {isLoading ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
