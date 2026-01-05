import { useState, useCallback } from 'react';
import { generatePassword, calculatePasswordStrength } from '../services/encryption';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showStrength?: boolean;
    showGenerate?: boolean;
    showCopy?: boolean;
    label?: string;
    id?: string;
}

export function PasswordInput({
    value,
    onChange,
    placeholder = 'Enter password',
    showStrength = false,
    showGenerate = false,
    showCopy = false,
    label,
    id = 'password',
}: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const strength = showStrength ? calculatePasswordStrength(value) : 0;

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColors = [
        '#ff4444', // red - weak
        '#ffaa00', // orange - fair
        '#cccc00', // yellow - good
        '#44cc44', // light green - strong
        '#00cc00', // green - excellent
    ];

    const handleGenerate = useCallback(() => {
        const newPassword = generatePassword(20);
        onChange(newPassword);
    }, [onChange]);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [value]);

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold uppercase text-text-primary">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    id={id}
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="brutalist-input pr-24 font-mono text-sm"
                    autoComplete="off"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {showGenerate && (
                        <button
                            type="button"
                            onClick={handleGenerate}
                            className="p-1.5 text-text-secondary hover:text-text-primary border border-transparent hover:border-border transition-all hover:bg-bg-secondary"
                            title="Generate password"
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    )}

                    {showCopy && value && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-1.5 text-text-secondary hover:text-text-primary border border-transparent hover:border-border transition-all hover:bg-bg-secondary"
                            title={copied ? 'Copied!' : 'Copy password'}
                        >
                            {copied ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-success"
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
                            ) : (
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
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            )}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="p-1.5 text-text-secondary hover:text-text-primary border border-transparent hover:border-border transition-all hover:bg-bg-secondary"
                        title={isVisible ? 'Hide password' : 'Show password'}
                    >
                        {isVisible ? (
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
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        ) : (
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Strength indicator */}
            {showStrength && value && (
                <div className="space-y-1">
                    <div className="flex gap-1 h-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex-1 border border-border"
                                style={{ backgroundColor: i <= strength ? strengthColors[strength] : 'transparent' }}
                            />
                        ))}
                    </div>
                    <p className="text-xs font-mono uppercase text-right">
                        Strength: <span className="font-bold">{strengthLabels[strength]}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
