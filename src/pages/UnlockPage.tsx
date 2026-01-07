import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { useVault } from '../context/VaultContext';
import { getVaultItems } from '../services/sui';
import { createSessionKey, getPersonalMessage, setPersonalMessageSignature } from '../services/encryption';

export function UnlockPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingVault, setIsCheckingVault] = useState(true);
    const [hasItems, setHasItems] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { setSessionKey } = useVault();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

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
                setHasItems(items.length > 0);
            } catch (err) {
                console.error('Failed to check vault:', err);
                setHasItems(false);
            } finally {
                setIsCheckingVault(false);
            }
        }

        checkExistingVault();
    }, [account?.address]);

    const handleUnlock = async () => {
        if (!account?.address) {
            setError('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Step 1: Create a SessionKey for this session
            const sessionKey = await createSessionKey(account.address, 15); // 15 min TTL

            // Step 2: Get the personal message to sign
            const personalMessage = getPersonalMessage(sessionKey);

            // Step 3: Have user sign the personal message
            const result = await signPersonalMessage({
                message: personalMessage,
            });

            // Step 4: Set the signature on the session key
            await setPersonalMessageSignature(sessionKey, result.signature);

            // Step 5: Store the session key in context
            setSessionKey(sessionKey);

            // Navigate to vault
            navigate('/');
        } catch (err) {
            console.error('Failed to unlock vault:', err);
            setError('Failed to unlock vault. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-8 md:py-12 px-4">
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

                {/* Unlock Form */}
                <div className="brutalist-card p-6 md:p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold uppercase mb-2">
                            {isCheckingVault ? 'Checking Vault...' : 'Unlock Vault'}
                        </h2>
                        <div className="h-0.5 bg-border w-12 mx-auto mb-4"></div>
                        <p className="text-sm text-text-secondary font-mono">
                            {isCheckingVault
                                ? 'Please wait...'
                                : 'Sign with your wallet to prove you are the owner'
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

                    {error && (
                        <div className="text-sm font-bold text-danger border-2 border-danger p-3 bg-danger/10">
                            ! {error}
                        </div>
                    )}

                    <button
                        onClick={handleUnlock}
                        disabled={isLoading || isCheckingVault || !account?.address}
                        className="brutalist-btn w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                    >
                        {isLoading ? 'CREATING SESSION...' : 'SIGN TO UNLOCK'}
                    </button>
                </div>



                {/* New User Help - Wallet Setup Button */}
                {!hasItems && !isCheckingVault && account?.address && (
                    <div className="mt-8 border-t-2 border-border pt-6 text-center">
                        <Link
                            to="/how-to-use#wallet-setup"
                            className="inline-flex items-center gap-2 bg-accent-primary text-black border-2 border-black px-4 py-3 font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-sm">
                                ?
                            </span>
                            <span className="text-left">
                                <span className="block text-xs">Don't have a Sui wallet yet?</span>
                                <span className="block text-[10px] font-normal">Learn how to get started</span>
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
