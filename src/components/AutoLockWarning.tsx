import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVault } from '../context/VaultContext';

const WARNING_THRESHOLD = 60; // Show warning at 60 seconds

export function AutoLockWarning() {
    const { timeUntilLock, resetInactivityTimer, isUnlocked, lock } = useVault();
    const location = useLocation();
    const [showWarning, setShowWarning] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Check if on edit pages (where unsaved changes may exist)
    const isOnEditPage = location.pathname === '/new' || location.pathname.startsWith('/edit/');

    // Show warning when time is <= 60 seconds
    useEffect(() => {
        if (timeUntilLock <= WARNING_THRESHOLD && timeUntilLock > 0 && isUnlocked && !dismissed) {
            setShowWarning(true);
        } else if (timeUntilLock > WARNING_THRESHOLD) {
            // Reset dismissed state when timer is extended
            setDismissed(false);
            setShowWarning(false);
        } else if (timeUntilLock === 0) {
            setShowWarning(false);
        }
    }, [timeUntilLock, isUnlocked, dismissed]);

    const handleExtendTime = () => {
        resetInactivityTimer();
        setShowWarning(false);
        setDismissed(true);
    };

    const handleLockNow = () => {
        setShowWarning(false);
        lock();
    };

    if (!showWarning || !isUnlocked) return null;

    return (
        <div className="fixed inset-0 bg-bg-primary/95 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-fadeIn">
            <div className={`brutalist-card max-w-md w-full p-6 border-2 ${isOnEditPage ? 'border-danger shadow-[8px_8px_0px_0px_#ef4444]' : 'border-border'}`}>
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 flex items-center justify-center border-2 ${isOnEditPage ? 'border-danger bg-danger/20' : 'border-border bg-accent-primary'}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-8 h-8 ${isOnEditPage ? 'text-danger' : 'text-text-primary'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold uppercase text-center mb-2 ${isOnEditPage ? 'text-danger' : ''}`}>
                    Auto Lock Warning
                </h3>

                {/* Countdown */}
                <div className="text-center mb-4">
                    <p className="text-4xl font-bold font-mono">{timeUntilLock}s</p>
                    <p className="text-sm text-text-secondary">until Owly locks</p>
                </div>

                {/* Warning Message */}
                <div className={`border-2 p-4 mb-6 ${isOnEditPage ? 'border-danger bg-danger/10' : 'border-border bg-bg-secondary'}`}>
                    {isOnEditPage ? (
                        <p className="text-sm font-mono text-center">
                            <span className="font-bold text-danger">⚠ UNSAVED CHANGES DETECTED</span>
                            <br /><br />
                            You are currently editing. Any unsaved changes will be <span className="font-bold text-danger">permanently lost</span> when Owly auto-locks due to inactivity.
                        </p>
                    ) : (
                        <p className="text-sm font-mono text-center text-text-secondary">
                            Owly will automatically lock due to inactivity. Click "Stay Unlocked" to continue your session.
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleLockNow}
                        className="brutalist-btn brutalist-btn-secondary flex-1"
                    >
                        Lock Now
                    </button>
                    <button
                        onClick={handleExtendTime}
                        className={`brutalist-btn flex-1 ${isOnEditPage ? '!bg-danger !border-danger !text-white hover:!bg-danger/90' : ''}`}
                    >
                        Stay Unlocked
                    </button>
                </div>
            </div>
        </div>
    );
}
