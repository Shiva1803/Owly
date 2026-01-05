import { Link } from 'react-router-dom';
import type { VaultItem } from '../types';

interface VaultItemCardProps {
    item: VaultItem;
    title?: string; // Optional preview title (if already decrypted)
}

export function VaultItemCard({ item, title }: VaultItemCardProps) {
    const isPassword = item.category === 'password';

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Link
            to={`/vault/${item.id}`}
            className="brutalist-card group flex items-center gap-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-4"
        >
            {/* Icon */}
            <div className={`
        w-12 h-12 border-2 border-border flex items-center justify-center font-bold
        ${isPassword
                    ? 'bg-bg-secondary'
                    : 'bg-accent-primary'
                }
      `}>
                {isPassword ? (
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
                ) : (
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
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-text-primary truncate uppercase tracking-tight">
                    {title || 'Encrypted Item'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`
            text-xs font-bold px-2 py-0.5 border border-border uppercase
            ${isPassword
                            ? 'bg-bg-secondary text-text-primary'
                            : 'bg-accent-primary text-text-primary'
                        }
          `}>
                        {isPassword ? 'Password' : 'Note'}
                    </span>
                    <span className="text-xs text-text-secondary font-mono">
                        {formatDate(item.created_at)}
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 flex items-center justify-center border-2 border-transparent group-hover:border-border group-hover:bg-accent-primary transition-all rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-text-primary group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </Link>
    );
}
