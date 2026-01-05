import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { AutoLockSettings } from './AutoLockSettings';

export function Header() {
    const location = useLocation();
    const { isUnlocked, lock, setWalletAddress, timeUntilLock } = useVault();
    const account = useCurrentAccount();
    const [showAutoLockSettings, setShowAutoLockSettings] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);

    // Sync wallet address to vault context
    useEffect(() => {
        setWalletAddress(account?.address || null);
    }, [account, setWalletAddress]);

    // Handle blinking animation when < 30 seconds
    useEffect(() => {
        if (timeUntilLock <= 30 && timeUntilLock > 0 && isUnlocked) {
            // Blink every 500ms
            const blinkInterval = setInterval(() => {
                setIsBlinking(prev => !prev);
            }, 500);
            return () => clearInterval(blinkInterval);
        } else {
            setIsBlinking(false);
        }
    }, [timeUntilLock, isUnlocked]);

    const isActive = (path: string) => location.pathname === path;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isWarning = timeUntilLock <= 30 && timeUntilLock > 0;

    return (
        <header className="bg-bg-primary border-b-2 border-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-border overflow-hidden rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <img
                            src="/owly.jpg"
                            alt="Owly"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-lg sm:text-xl font-bold font-mono uppercase tracking-tight">Owly</span>
                </Link>

                {/* Navigation - Hidden on mobile */}
                <nav className="hidden sm:flex items-center gap-6 md:gap-8">
                    {isUnlocked && (
                        <>
                            <Link
                                to="/"
                                className={`text-sm font-bold uppercase tracking-wider hover:underline decoration-2 underline-offset-4 ${isActive('/')
                                    ? 'underline decoration-accent-primary'
                                    : 'text-text-primary'
                                    }`}
                            >
                                Vault
                            </Link>
                            <Link
                                to="/new"
                                className={`text-sm font-bold uppercase tracking-wider hover:underline decoration-2 underline-offset-4 ${isActive('/new')
                                    ? 'underline decoration-accent-primary'
                                    : 'text-text-primary'
                                    }`}
                            >
                                + New
                            </Link>
                        </>
                    )}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {isUnlocked && (
                        <>
                            {/* Auto-Lock Timer Button */}
                            <button
                                onClick={() => setShowAutoLockSettings(true)}
                                className={`
                                    flex items-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border-2 text-xs font-bold font-mono transition-all
                                    ${isWarning
                                        ? isBlinking
                                            ? 'border-danger bg-danger text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            : 'border-danger bg-danger/20 text-danger shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'border-border bg-bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
                                    }
                                `}
                                title="Auto-lock settings"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 ${isWarning ? 'animate-pulse' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="hidden sm:inline">{formatTime(timeUntilLock)}</span>
                            </button>

                            {/* Lock Button */}
                            <button
                                onClick={lock}
                                className="brutalist-btn brutalist-btn-secondary !py-1.5 sm:!py-2 !px-2 sm:!px-4 !text-xs"
                                title="Lock vault"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Lock</span>
                            </button>
                        </>
                    )}

                    <div className="[&_button]:!bg-accent-primary [&_button]:!text-text-primary [&_button]:!font-mono [&_button]:!font-bold [&_button]:!border-2 [&_button]:!border-border [&_button]:!shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] [&_button]:active:!translate-x-1 [&_button]:active:!translate-y-1 [&_button]:active:!box-shadow-none [&_button]:!rounded-none [&_button]:!px-2 sm:[&_button]:!px-4 [&_button]:!py-1.5 sm:[&_button]:!py-2 [&_button]:!text-xs sm:[&_button]:!text-sm">
                        <ConnectButton />
                    </div>
                </div>
            </div>

            {/* Auto-Lock Settings Modal */}
            <AutoLockSettings
                isOpen={showAutoLockSettings}
                onClose={() => setShowAutoLockSettings(false)}
            />
        </header>
    );
}
