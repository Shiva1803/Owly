import { useVault } from '../context/VaultContext';

interface AutoLockSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRESET_TIMES = [1, 5, 15, 30, 60];

export function AutoLockSettings({ isOpen, onClose }: AutoLockSettingsProps) {
    const { autoLockMinutes, setAutoLockMinutes, timeUntilLock } = useVault();

    if (!isOpen) return null;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-bg-primary/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="brutalist-card max-w-sm w-full animate-fadeIn p-6 border-2 border-border">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold uppercase">Auto Lock Settings</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center border-2 border-border hover:bg-bg-secondary transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Current Time Remaining */}
                <div className="border-2 border-border p-4 mb-6 bg-bg-secondary text-center">
                    <p className="text-xs font-bold uppercase text-text-secondary mb-1">Time Until Lock</p>
                    <p className="text-3xl font-bold font-mono">{formatTime(timeUntilLock)}</p>
                </div>

                {/* Current Setting */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-text-secondary mb-3">Auto Lock After</p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                const currentIndex = PRESET_TIMES.indexOf(autoLockMinutes);
                                if (currentIndex > 0) {
                                    setAutoLockMinutes(PRESET_TIMES[currentIndex - 1]);
                                }
                            }}
                            disabled={autoLockMinutes === PRESET_TIMES[0]}
                            className="w-10 h-10 border-2 border-border flex items-center justify-center font-bold text-xl hover:bg-accent-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            −
                        </button>
                        <div className="text-center min-w-[100px]">
                            <p className="text-2xl font-bold">{autoLockMinutes}</p>
                            <p className="text-xs text-text-secondary uppercase">minutes</p>
                        </div>
                        <button
                            onClick={() => {
                                const currentIndex = PRESET_TIMES.indexOf(autoLockMinutes);
                                if (currentIndex < PRESET_TIMES.length - 1) {
                                    setAutoLockMinutes(PRESET_TIMES[currentIndex + 1]);
                                } else if (!PRESET_TIMES.includes(autoLockMinutes)) {
                                    // If not on preset, find next higher
                                    const next = PRESET_TIMES.find(t => t > autoLockMinutes);
                                    if (next) setAutoLockMinutes(next);
                                }
                            }}
                            disabled={autoLockMinutes >= PRESET_TIMES[PRESET_TIMES.length - 1]}
                            className="w-10 h-10 border-2 border-border flex items-center justify-center font-bold text-xl hover:bg-accent-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Presets */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-text-secondary mb-3">Quick Select</p>
                    <div className="grid grid-cols-5 gap-2">
                        {PRESET_TIMES.map((time) => (
                            <button
                                key={time}
                                onClick={() => setAutoLockMinutes(time)}
                                className={`py-2 border-2 font-bold text-sm transition-all ${autoLockMinutes === time
                                        ? 'bg-accent-primary border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-bg-primary border-border hover:bg-bg-secondary'
                                    }`}
                            >
                                {time}m
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <p className="text-xs text-text-secondary text-center font-mono">
                    Timer resets on activity. Vault locks when timer reaches 0.
                </p>
            </div>
        </div>
    );
}
