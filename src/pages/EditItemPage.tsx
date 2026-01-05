import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useVault } from '../context/VaultContext';
import { encryptData, decryptData } from '../services/encryption';
import { PasswordInput } from '../components/PasswordInput';
import type { NotePayload, PasswordPayload, VaultCategory, VaultPayload } from '../types';

export function EditItemPage() {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [originalData, setOriginalData] = useState<VaultPayload | null>(null);

    // Password form
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');

    // Note form
    const [noteTitle, setNoteTitle] = useState('');
    const [noteBody, setNoteBody] = useState('');
    const [noteTags, setNoteTags] = useState('');
    const [noteBgColor, setNoteBgColor] = useState('#ffffff');
    const [showColorPalette, setShowColorPalette] = useState(false);
    const [lastEditedTime, setLastEditedTime] = useState<Date | null>(null);

    // Light pastel colors for note background
    const noteColors = [
        { name: 'White', color: '#ffffff' },
        { name: 'Red', color: '#ffcdd2' },
        { name: 'Yellow', color: '#fff9c4' },
        { name: 'Blue', color: '#bbdefb' },
        { name: 'Green', color: '#c8e6c9' },
        { name: 'Orange', color: '#ffe0b2' },
    ];

    // Ref for color palette click-outside detection
    const colorPaletteRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close color palette
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
                setShowColorPalette(false);
            }
        };

        if (showColorPalette) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPalette]);

    // Format last edited timestamp
    const formatLastEdited = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 24) {
            return `Edited ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}`;
        } else {
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getFullYear();
            return `Edited at ${day} ${month} ${year}`;
        }
    };

    // Update last edited time when note body changes
    const handleNoteBodyChange = (value: string) => {
        setNoteBody(value);
        setLastEditedTime(new Date());
    };

    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { masterKey } = useVault();

    // Fetch and decrypt existing item
    const fetchItem = useCallback(async () => {
        if (!id || !masterKey) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { getLocalItemData } = await import('../services/localStorage');
            const encryptedData = getLocalItemData(id);

            if (!encryptedData) {
                throw new Error('Item not found');
            }

            const decryptedData = await decryptData(encryptedData, masterKey);
            setOriginalData(decryptedData);

            // Populate form fields based on type
            if (decryptedData.type === 'password') {
                setTitle(decryptedData.title);
                setUsername(decryptedData.username);
                setPassword(decryptedData.password);
                setUrl(decryptedData.url || '');
                setNotes(decryptedData.notes || '');
            } else {
                setNoteTitle(decryptedData.title);
                setNoteBody(decryptedData.body);
                setNoteTags(decryptedData.tags.join(', '));
                setNoteBgColor(decryptedData.backgroundColor || '#ffffff');
            }
        } catch (err) {
            console.error('Failed to fetch/decrypt item:', err);
            setError(err instanceof Error ? err.message : 'Failed to decrypt. Wrong master password?');
        } finally {
            setIsLoading(false);
        }
    }, [id, masterKey]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!masterKey || !account?.address || !id || !originalData) {
            setError('Please unlock your vault first');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const now = Math.floor(Date.now() / 1000);
            let payload: NotePayload | PasswordPayload;
            let category: VaultCategory;

            if (originalData.type === 'password') {
                if (!title || !password) {
                    setError('Title and password are required');
                    setIsSaving(false);
                    return;
                }

                payload = {
                    type: 'password',
                    title,
                    username,
                    password,
                    url: url || undefined,
                    notes: notes || undefined,
                    created_at: originalData.created_at,
                    updated_at: now,
                };
                category = 'password';
            } else {
                if (!noteTitle || !noteBody) {
                    setError('Title and body are required');
                    setIsSaving(false);
                    return;
                }

                payload = {
                    type: 'note',
                    title: noteTitle,
                    body: noteBody,
                    tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
                    backgroundColor: noteBgColor !== '#ffffff' ? noteBgColor : undefined,
                    created_at: originalData.created_at,
                    updated_at: now,
                };
                category = 'note';
            }

            // Encrypt data locally
            const encryptedData = await encryptData(payload, masterKey);

            // Update in localStorage
            const { updateLocalItem } = await import('../services/localStorage');
            updateLocalItem(id, encryptedData, category);

            // Navigate back to view
            navigate(`/vault/${id}`);
        } catch (err) {
            console.error('Failed to update vault item:', err);
            setError(err instanceof Error ? err.message : 'Failed to update entry. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <p className="text-xl font-bold animate-pulse">LOADING...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !originalData) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
                >
                    ← Back to Vault
                </Link>
                <div className="brutalist-card text-center py-12">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Failed to Load</h2>
                    <p className="text-text-secondary mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
            {/* Header */}
            <div className="mb-8 border-b-2 border-border pb-6 bg-bg-primary">
                <Link
                    to={`/vault/${id}`}
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-danger transition-colors mb-4 font-bold uppercase text-sm group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    Cancel Edit
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight">Edit Entry</h1>
                <p className="text-text-secondary mt-1 font-mono text-sm">
                    [ MODIFYING ENCRYPTED DATA ]
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="brutalist-card p-6 md:p-8 space-y-8">
                {originalData?.type === 'password' ? (
                    <>
                        {/* Password Form */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Title / App Name *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., GitHub, Gmail, Netflix"
                                    className="brutalist-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Username / Email
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your@email.com"
                                    className="brutalist-input"
                                />
                            </div>

                            <PasswordInput
                                id="edit-password"
                                value={password}
                                onChange={setPassword}
                                placeholder="Enter or generate password"
                                label="Password *"
                                showStrength
                                showGenerate
                                showCopy
                            />

                            <div>
                                <label htmlFor="url" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Website URL
                                </label>
                                <input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://github.com"
                                    className="brutalist-input"
                                />
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Additional notes (2FA codes, security questions, etc.)"
                                    rows={3}
                                    className="brutalist-input resize-none"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Note Form */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="note-title" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Title *
                                </label>
                                <input
                                    id="note-title"
                                    type="text"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                    placeholder="Note title"
                                    className="brutalist-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="note-body" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Content *
                                </label>
                                <div className="relative border-2 border-border" style={{ backgroundColor: noteBgColor }}>
                                    <textarea
                                        id="note-body"
                                        value={noteBody}
                                        onChange={(e) => handleNoteBodyChange(e.target.value)}
                                        placeholder="Write your secure note here... Markdown supported."
                                        rows={8}
                                        className="w-full p-4 pb-14 resize-none font-mono text-sm focus:outline-none bg-transparent"
                                        required
                                    />
                                    {/* Formatting Toolbar - Sticky at bottom */}
                                    <div className="sticky bottom-0 left-0 right-0 bg-bg-secondary border-t-2 border-border px-3 py-2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = noteBody;
                                                const selectedText = text.substring(start, end);
                                                const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                                                setNoteBody(newText);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all font-bold"
                                            title="Bold"
                                        >
                                            B
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = noteBody;
                                                const selectedText = text.substring(start, end);
                                                const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                                                setNoteBody(newText);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all italic"
                                            title="Italic"
                                        >
                                            I
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = noteBody;
                                                const selectedText = text.substring(start, end);
                                                const newText = text.substring(0, start) + `<u>${selectedText}</u>` + text.substring(end);
                                                setNoteBody(newText);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all underline"
                                            title="Underline"
                                        >
                                            U
                                        </button>
                                        <div className="w-px h-5 bg-border mx-1"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const cleanText = noteBody
                                                    .replace(/\*\*(.+?)\*\*/g, '$1')
                                                    .replace(/\*(.+?)\*/g, '$1')
                                                    .replace(/<u>(.+?)<\/u>/g, '$1');
                                                setNoteBody(cleanText);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Clear Formatting"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="w-px h-5 bg-border mx-1"></div>
                                        <button
                                            type="button"
                                            onClick={() => document.execCommand('undo')}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Undo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 014 4v2M3 10l4-4m-4 4l4 4" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => document.execCommand('redo')}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Redo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a4 4 0 00-4 4v2m14-6l-4-4m4 4l-4 4" />
                                            </svg>
                                        </button>
                                        <div className="w-px h-5 bg-border mx-1"></div>
                                        {/* Cut, Copy, Paste */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const selectedText = noteBody.substring(start, end);
                                                if (selectedText) {
                                                    navigator.clipboard.writeText(selectedText);
                                                    const newText = noteBody.substring(0, start) + noteBody.substring(end);
                                                    setNoteBody(newText);
                                                }
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Cut"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const selectedText = noteBody.substring(start, end);
                                                if (selectedText) {
                                                    navigator.clipboard.writeText(selectedText);
                                                }
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Copy"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const textarea = document.getElementById('note-body') as HTMLTextAreaElement;
                                                const start = textarea.selectionStart;
                                                const clipboardText = await navigator.clipboard.readText();
                                                const newText = noteBody.substring(0, start) + clipboardText + noteBody.substring(start);
                                                setNoteBody(newText);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                            title="Paste"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </button>
                                        <div className="w-px h-5 bg-border mx-1"></div>
                                        {/* Color Palette */}
                                        <div className="relative" ref={colorPaletteRef}>
                                            <button
                                                type="button"
                                                onClick={() => setShowColorPalette(!showColorPalette)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-bg-primary border border-transparent hover:border-border transition-all"
                                                title="Change Background Color"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                </svg>
                                            </button>
                                            {showColorPalette && (
                                                <div className="absolute bottom-full left-0 mb-2 bg-bg-primary border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex gap-2">
                                                    {noteColors.map((c) => (
                                                        <button
                                                            key={c.color}
                                                            type="button"
                                                            onClick={() => {
                                                                setNoteBgColor(c.color);
                                                                setShowColorPalette(false);
                                                            }}
                                                            className={`w-6 h-6 border-2 transition-all hover:scale-110 ${noteBgColor === c.color ? 'border-text-primary' : 'border-border'}`}
                                                            style={{ backgroundColor: c.color }}
                                                            title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {/* Spacer to push timestamp to the right */}
                                        <div className="flex-1"></div>
                                        {/* Last Edited Timestamp */}
                                        {lastEditedTime && (
                                            <span className="text-xs text-text-secondary font-mono">
                                                {formatLastEdited(lastEditedTime)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="note-tags" className="block text-sm font-bold uppercase text-text-primary mb-2">
                                    Tags
                                </label>
                                <input
                                    id="note-tags"
                                    type="text"
                                    value={noteTags}
                                    onChange={(e) => setNoteTags(e.target.value)}
                                    placeholder="work, personal, crypto (comma separated)"
                                    className="brutalist-input"
                                />
                            </div>
                        </div>
                    </>
                )}

                {error && (
                    <div className="text-sm font-bold text-danger border-2 border-danger p-3 bg-danger/10">
                        ! {error}
                    </div>
                )}

                <div className="flex gap-4 pt-4 border-t-2 border-border">
                    <Link
                        to={`/vault/${id}`}
                        className="brutalist-btn brutalist-btn-secondary flex-1 text-center decoration-0"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="brutalist-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center gap-2">
                                SAVING...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>

                <p className="text-xs text-center text-text-secondary font-mono">
                    [ CLIENT-SIDE ENCRYPTION ENABLED ]
                </p>
            </form>
        </div>
    );
}
