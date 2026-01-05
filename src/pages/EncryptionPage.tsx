import { Link } from 'react-router-dom';

export function EncryptionPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
            {/* Header */}
            <div className="mb-8 border-b-2 border-border pb-6 bg-bg-primary">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-danger transition-colors mb-4 font-bold uppercase text-sm group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    Back to Vault
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                    <span>How Encryption Works</span>
                </h1>
            </div>

            {/* Overview Section */}
            <div className="brutalist-card p-6 mb-8 bg-accent-primary">
                <h2 className="text-xl font-bold uppercase mb-4">Overview</h2>
                <p className="mb-4">Owly uses <strong>client-side, end-to-end encryption</strong> to protect your notes and passwords.</p>
                <p className="font-bold mb-2">This means:</p>
                <ul className="space-y-2 font-mono text-sm">
                    <li>• Encryption happens on your device</li>
                    <li>• Decryption happens on your device</li>
                    <li>• No server, blockchain, or storage layer ever sees plaintext data</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Section 1 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        1. Core Principle: Client-Side Encryption
                    </h2>
                    <p className="mb-4 text-text-secondary">When you create or unlock a vault item:</p>
                    <ol className="space-y-2 font-mono text-sm list-decimal list-inside mb-4">
                        <li>Your data is prepared locally in your browser</li>
                        <li>A cryptographic key is derived on your device</li>
                        <li>Your data is encrypted before it leaves your device</li>
                        <li>Only encrypted data is stored or transmitted</li>
                    </ol>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        At no point is unencrypted data sent to any external system.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        2. Master Password & Key Derivation
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly uses a master password to protect your vault.</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• The master password is <strong>never stored</strong></li>
                        <li>• It is used only to derive an encryption key locally</li>
                        <li>• The derived key exists temporarily in memory</li>
                    </ul>
                    <p className="mb-2">The master password acts as the final lock on your data.</p>
                    <div className="bg-danger/10 border-2 border-danger p-4">
                        <p className="font-bold text-danger">
                            ⚠️ If the master password is lost, the data cannot be decrypted.
                        </p>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        3. What Exactly Gets Encrypted
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly encrypts <strong className="text-text-primary">entire vault entries</strong>, not individual fields.</p>
                    <p className="mb-2">For example, a password entry:</p>
                    <div className="bg-bg-secondary p-4 border-2 border-border mb-4 font-mono text-sm overflow-x-auto">
                        <pre>{`{
  "title": "GitHub",
  "username": "user@email.com",
  "password": "••••••••",
  "notes": "2FA enabled"
}`}</pre>
                    </div>
                    <p className="mb-4">The full object is encrypted as a single payload.</p>
                    <div className="bg-bg-secondary p-4 border-2 border-border">
                        <p className="font-bold mb-2">This prevents:</p>
                        <ul className="font-mono text-sm space-y-1">
                            <li>• Partial data leaks</li>
                            <li>• Metadata inference</li>
                            <li>• Field-level exposure</li>
                        </ul>
                    </div>
                </section>

                {/* Section 4 - Seal */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        4. Encryption & Decryption Boundary
                    </h2>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src="/seal.png"
                                alt="Seal"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="mb-4 text-text-secondary">
                                Encryption and decryption happen only inside the client using{' '}
                                <a
                                    href="https://seal.mystenlabs.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#e8ff7f] font-bold hover:underline"
                                >
                                    Seal
                                </a>.
                            </p>
                            <p className="mb-2 font-bold">Seal provides:</p>
                            <ul className="space-y-1 font-mono text-sm">
                                <li>• Secure encryption primitives</li>
                                <li>• Deterministic behavior</li>
                                <li>• Local-only cryptographic operations</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-4 font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Encrypted data is never decrypted outside your device.
                    </p>
                </section>

                {/* Section 5 - Walrus */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        5. Storage of Encrypted Data
                    </h2>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src="/walrus.png"
                                alt="Walrus"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="mb-4 text-text-secondary">Once encrypted:</p>
                            <ul className="space-y-2 font-mono text-sm">
                                <li>• The encrypted payload is stored on{' '}
                                    <a
                                        href="https://www.walrus.xyz/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#33ffea] font-bold hover:underline"
                                    >
                                        Walrus
                                    </a>
                                </li>
                                <li>• Walrus stores opaque binary data only</li>
                                <li>• Walrus cannot inspect or interpret encrypted content</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-4 font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Walrus acts as durable storage, not a trusted party.
                    </p>
                </section>

                {/* Section 6 - Sui */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        6. On-Chain References (No Secrets on Chain)
                    </h2>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src="/sui.png"
                                alt="Sui"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="mb-2 text-text-secondary">
                                Owly uses{' '}
                                <a
                                    href="https://www.sui.io/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#3498db] font-bold hover:underline"
                                >
                                    Sui
                                </a>{' '}
                                to store:
                            </p>
                            <ul className="space-y-1 font-mono text-sm mb-4">
                                <li>• Ownership information</li>
                                <li>• References to encrypted data (CIDs)</li>
                                <li>• Non-sensitive metadata (timestamps, type)</li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="border-2 border-danger p-4">
                            <h3 className="font-bold text-danger mb-2">Sui NEVER stores:</h3>
                            <ul className="font-mono text-sm space-y-1">
                                <li>• Passwords</li>
                                <li>• Notes</li>
                                <li>• Encryption keys</li>
                                <li>• Decrypted content</li>
                            </ul>
                        </div>
                        <div className="bg-bg-secondary p-4 border-2 border-border flex items-center justify-center">
                            <p className="font-bold text-center">The blockchain is used for verification, not secrecy.</p>
                        </div>
                    </div>
                </section>

                {/* Section 7 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        7. Viewing a Vault Item (Decryption Flow)
                    </h2>
                    <p className="mb-4 text-text-secondary">When you open a vault item:</p>
                    <ol className="space-y-2 font-mono text-sm list-decimal list-inside mb-4">
                        <li>Encrypted data is fetched</li>
                        <li>You enter your master password</li>
                        <li>A key is derived locally</li>
                        <li>The data is decrypted in memory</li>
                        <li>Plaintext exists only while viewing</li>
                    </ol>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Once you leave the page or lock the vault, plaintext is gone.
                    </p>
                </section>

                {/* Section 8 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        8. Why This Design Matters
                    </h2>
                    <p className="mb-4 font-mono text-sm">
                        This design ensures:{' '}
                        <span className="text-black px-1 font-bold">No central database of secrets</span>,{' '}
                        <span className="text-black px-1 font-bold">No admin access to user data</span>,{' '}
                        <span className="text-black px-1 font-bold">No recovery backdoors </span>&{' '}
                        <span className="text-black px-1 font-bold">No silent data exposure</span>.
                    </p>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Even a full system compromise results in encrypted data only.
                    </p>
                </section>

                {/* Section 9 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        9. What This Page Does Not Cover
                    </h2>
                    <p className="mb-4 text-text-secondary">This page does not describe:</p>
                    <ul className="space-y-2 font-mono text-sm">
                        <li>
                            • Threat scenarios → see{' '}
                            <Link to="/threat-model" className="text-black hover:underline font-bold bg-accent-primary px-1">
                                Threat Model
                            </Link>
                        </li>
                        <li>
                            • Usage steps → see{' '}
                            <Link to="/how-to-use" className="text-black hover:underline font-bold bg-accent-primary px-1">
                                How to Use Owly
                            </Link>
                        </li>
                        <li>
                            • Privacy guarantees → see{' '}
                            <Link to="/privacy" className="text-black hover:underline font-bold bg-accent-primary px-1">
                                Privacy & Security
                            </Link>
                        </li>
                    </ul>
                </section>

                {/* Final Summary */}
                <section className="brutalist-card p-8 text-center text-white" style={{ backgroundColor: '#000000' }}>
                    <p className="text-lg mb-4">
                        Owly encrypts your data <strong>before storage</strong>, <strong>before transmission</strong>, and <strong>before blockchain interaction</strong>.
                    </p>
                    <p className="text-xl font-bold">
                        <span className="text-accent-primary">Only you hold the final key.</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
