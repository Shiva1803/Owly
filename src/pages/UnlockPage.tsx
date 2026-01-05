import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useVault } from '../context/VaultContext';
import { deriveKey } from '../services/encryption';
import { getVaultItems } from '../services/sui';
import { PasswordInput } from '../components/PasswordInput';

export function UnlockPage() {
    const [masterPassword, setMasterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingVault, setIsCheckingVault] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { setMasterKey } = useVault();

    // Check if user has existing vault items
    useEffect(() => {
        async function checkExistingVault() {
            if (!account?.address) {
                setIsCheckingVault(false);
                return;
            }

            setIsCheckingVault(true);
            try {
                const items = await getVaultItems(account.address);
                setIsNewUser(items.length === 0);
            } catch (err) {
                console.error('Failed to check vault:', err);
                // Assume new user if check fails
                setIsNewUser(true);
            } finally {
                setIsCheckingVault(false);
            }
        }

        checkExistingVault();
    }, [account?.address]);

    const handleUnlock = async (e: FormEvent) => {
        e.preventDefault();

        if (!account?.address) {
            setError('Please connect your wallet first');
            return;
        }

        if (!masterPassword) {
            setError('Please enter your master password');
            return;
        }

        if (masterPassword.length < 8) {
            setError('Master password must be at least 8 characters');
            return;
        }

        // For new users, validate password confirmation
        if (isNewUser) {
            if (!confirmPassword) {
                setError('Please confirm your master password');
                return;
            }
            if (masterPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setIsLoading(true);
        setError('');

        try {
            // Derive encryption key from master password + wallet address
            const key = await deriveKey(masterPassword, account.address);
            setMasterKey(key);

            // Clear passwords from state immediately
            setMasterPassword('');
            setConfirmPassword('');

            // Navigate to vault
            navigate('/');
        } catch (err) {
            console.error('Failed to derive key:', err);
            setError('Failed to unlock vault. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fadeIn">
                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 border-4 border-border rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-bg-primary mb-4 transition-transform duration-200 hover:scale-110 cursor-pointer">
                        <img
                            src="/owly.jpg"
                            alt="Owly"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="bg-bg-primary px-4 py-2 text-center">
                        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">Owly</h1>
                        <p className="text-text-secondary font-mono text-sm">
                            [ The Zero-Knowledge Notes & Passwords Manager ]
                        </p>
                    </div>
                </div>

                {/* Unlock/Create Form */}
                <div className="brutalist-card p-6 md:p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold uppercase mb-2">
                            {isCheckingVault ? 'Checking Vault...' : isNewUser ? 'Create Master Password' : 'Unlock Vault'}
                        </h2>
                        <div className="h-0.5 bg-border w-12 mx-auto mb-4"></div>
                        <p className="text-sm text-text-secondary font-mono">
                            {isCheckingVault
                                ? 'Please wait...'
                                : isNewUser
                                    ? 'Create a strong password to encrypt your vault'
                                    : 'Enter master password to decrypt'
                            }
                        </p>
                    </div>

                    {/* Wallet Status */}
                    {!account?.address ? (
                        <div className="border-2 border-border border-dashed p-4 text-center bg-bg-secondary">
                            <p className="text-sm font-bold mb-1">
                                WALLET NOT CONNECTED
                            </p>
                            <p className="text-xs text-text-secondary font-mono">
                                Connect wallet to proceed
                            </p>
                        </div>
                    ) : (
                        <div className="border-2 border-border p-3 flex items-center gap-3 bg-bg-secondary">
                            <div className="w-8 h-8 flex items-center justify-center border-2 border-border bg-accent-primary font-bold">
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
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase">Connected</p>
                                <p className="text-sm font-mono truncate">
                                    {account.address}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* New User Warning */}
                    {isNewUser && !isCheckingVault && account?.address && (
                        <div className="border-2 border-danger p-4 bg-danger/10">
                            <p className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                IMPORTANT
                            </p>
                            <p className="text-xs font-mono text-text-primary leading-relaxed">
                                This password <span className="font-bold text-danger">cannot be recovered</span>.
                                If you forget it, you will lose access to all your encrypted data.
                                Write it down and store it safely!
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase" htmlFor="master-password">
                                {isNewUser ? 'Create Master Password' : 'Master Password'}
                            </label>
                            <PasswordInput
                                id="master-password"
                                value={masterPassword}
                                onChange={setMasterPassword}
                                placeholder="****************"
                                label=""
                            />
                        </div>

                        {/* Confirm Password for New Users */}
                        {isNewUser && !isCheckingVault && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase" htmlFor="confirm-password">
                                    Confirm Password
                                </label>
                                <PasswordInput
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    placeholder="****************"
                                    label=""
                                />
                            </div>
                        )}

                        {error && (
                            <div className="text-sm font-bold text-danger border-2 border-danger p-3 bg-danger/10">
                                ! {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || isCheckingVault || !account?.address || !masterPassword}
                            className="brutalist-btn w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        >
                            {isLoading
                                ? (isNewUser ? 'CREATING...' : 'UNLOCKING...')
                                : (isNewUser ? 'CREATE VAULT' : 'UNLOCK VAULT')
                            }
                        </button>
                    </form>
                </div>

                {/* New User Help */}
                <div className="mt-8 border-t-2 border-border pt-6 text-center">
                    <Link
                        to="/how-to-use"
                        className="inline-flex items-center gap-3 border-2 border-border bg-accent-primary px-5 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="flex flex-col items-start text-left">
                            <span className="text-xs uppercase tracking-wider">Don't have a Sui wallet yet?</span>
                            <span className="text-sm uppercase font-bold">Learn How to Get Started</span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

