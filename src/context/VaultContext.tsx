import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { SessionKey } from '@mysten/seal';

const DEFAULT_AUTO_LOCK_MINUTES = 15;
const AUTO_LOCK_STORAGE_KEY = 'owly_auto_lock_minutes';

interface VaultContextType {
    // Session state - now uses proper Seal SessionKey
    sessionKey: SessionKey | null;
    setSessionKey: (key: SessionKey | null) => void;

    isUnlocked: boolean;

    // Actions
    lock: () => void;

    // Wallet address (set when connected)
    walletAddress: string | null;
    setWalletAddress: (address: string | null) => void;

    // Auto-lock settings
    autoLockMinutes: number;
    setAutoLockMinutes: (minutes: number) => void;
    timeUntilLock: number; // seconds remaining
    resetInactivityTimer: () => void;
}

const VaultContext = createContext<VaultContextType | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
    const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    // Auto-lock state
    const [autoLockMinutes, setAutoLockMinutesState] = useState<number>(() => {
        const stored = localStorage.getItem(AUTO_LOCK_STORAGE_KEY);
        return stored ? parseInt(stored, 10) : DEFAULT_AUTO_LOCK_MINUTES;
    });
    const [timeUntilLock, setTimeUntilLock] = useState<number>(autoLockMinutes * 60);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const isUnlocked = sessionKey !== null;

    const lock = useCallback(() => {
        setSessionKey(null);
        // Reset timer when locked
        setTimeUntilLock(autoLockMinutes * 60);
    }, [autoLockMinutes]);

    // Save auto-lock preference to localStorage
    const setAutoLockMinutes = useCallback((minutes: number) => {
        setAutoLockMinutesState(minutes);
        localStorage.setItem(AUTO_LOCK_STORAGE_KEY, minutes.toString());
        setTimeUntilLock(minutes * 60);
        lastActivityRef.current = Date.now();
    }, []);

    // Reset inactivity timer (called on user activity)
    const resetInactivityTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (isUnlocked) {
            setTimeUntilLock(autoLockMinutes * 60);
        }
    }, [autoLockMinutes, isUnlocked]);

    // Handle inactivity detection
    useEffect(() => {
        if (!isUnlocked) {
            // Clear timer when locked
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Reset timer when unlocked
        setTimeUntilLock(autoLockMinutes * 60);
        lastActivityRef.current = Date.now();

        // Activity event handlers
        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            setTimeUntilLock(autoLockMinutes * 60);
        };

        // Listen for user activity
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        // Start countdown timer
        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
            const remaining = Math.max(0, autoLockMinutes * 60 - elapsed);
            setTimeUntilLock(remaining);

            if (remaining === 0) {
                lock();
            }
        }, 1000);

        // Lock on tab close/visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Tab hidden - continue timer
            }
        };

        const handleBeforeUnload = () => {
            // Lock vault when tab/browser closes
            lock();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isUnlocked, autoLockMinutes, lock]);

    return (
        <VaultContext.Provider
            value={{
                sessionKey,
                setSessionKey,
                isUnlocked,
                lock,
                walletAddress,
                setWalletAddress,
                autoLockMinutes,
                setAutoLockMinutes,
                timeUntilLock,
                resetInactivityTimer,
            }}
        >
            {children}
        </VaultContext.Provider>
    );
}

export function useVault() {
    const context = useContext(VaultContext);
    if (!context) {
        throw new Error('useVault must be used within a VaultProvider');
    }
    return context;
}
