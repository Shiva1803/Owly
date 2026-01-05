import { Link } from 'react-router-dom';

export function PrivacyPage() {
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
                    <span>Privacy & Security</span>
                </h1>
            </div>

            {/* TL;DR Section */}
            <div className="brutalist-card p-6 mb-8 bg-accent-primary">
                <h2 className="text-xl font-bold uppercase mb-4">TL;DR</h2>
                <ul className="space-y-2 font-mono text-sm">
                    <li>1. Owly is a <strong>zero-knowledge vault</strong>.</li>
                    <li>2. Your notes and passwords are <strong>encrypted on your device</strong> before being stored.</li>
                    <li>3. Owly <strong>cannot see, read, or recover</strong> your data.</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Section 1 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        1. What Data Owly Sees (and What It Never Does)
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="border-2 border-danger p-4">
                            <h3 className="font-bold text-danger mb-3">Data Owly NEVER sees</h3>
                            <ul className="space-y-1 font-mono text-sm">
                                <li>• Your notes or passwords (plaintext)</li>
                                <li>• Your master password</li>
                                <li>• Encryption keys</li>
                                <li>• Decrypted content</li>
                            </ul>
                            <p className="mt-3 text-xs text-text-secondary font-mono">
                                All sensitive data is encrypted locally on your device.
                            </p>
                        </div>

                        <div className="border-2 border-border p-4" style={{ borderColor: '#00cc00' }}>
                            <h3 className="font-bold mb-3" style={{ color: '#00cc00' }}>Data Owly CAN see</h3>
                            <ul className="space-y-1 font-mono text-sm">
                                <li>• Your wallet address (for ownership)</li>
                                <li>• Encrypted blobs stored on decentralized storage</li>
                                <li>• Non-sensitive metadata (timestamps, item type)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        2. How Your Data Is Protected
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly uses a <strong className="text-text-primary">client-side encryption model</strong>:</p>
                    <ul className="space-y-2 font-mono text-sm list-decimal list-inside">
                        <li>You create or unlock a vault using a master password</li>
                        <li>A cryptographic key is derived locally</li>
                        <li>Your data is encrypted on your device</li>
                        <li>Only encrypted data is stored or transmitted</li>
                    </ul>
                    <p className="mt-4 font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        At no point does Owly handle unencrypted secrets.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        3. Storage & Blockchain Security
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly separates data, ownership, and encryption:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• <strong className="text-[#33ffea]">Encrypted content</strong> is stored on Walrus</li>
                        <li>• <strong className="text-[#3498db]">Ownership & references</strong> are stored on Sui</li>
                        <li>• <strong className="text-[#e8ff7f]">Encryption & decryption</strong> are handled locally using Seal</li>
                    </ul>
                    <div className="bg-bg-secondary p-4 border-2 border-border">
                        <p className="font-bold mb-2">This ensures:</p>
                        <ul className="font-mono text-sm space-y-1">
                            <li>a. No central database</li>
                            <li>b. No single point of failure</li>
                            <li>c. Verifiable ownership</li>
                        </ul>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        4. Wallet-Based Identity
                    </h2>
                    <p className="mb-4 font-mono text-sm">
                        Owly does <strong className="text-text-primary">not</strong> use:{' '}
                        <span className="text-black px-1 font-bold">Email accounts</span>,{' '}
                        <span className="text-black px-1 font-bold">Password-based logins</span> &{' '}
                        <span className="text-black px-1 font-bold">Centralized user databases</span>.
                    </p>
                    <p className="mb-4"><strong>Your wallet acts as your identity.</strong></p>
                    <div className="bg-bg-secondary p-4 border-2 border-border">
                        <p className="font-bold mb-2">This means:</p>
                        <ul className="font-mono text-sm space-y-1">
                            <li>a. Only your wallet can access your vault</li>
                            <li>b. No account recovery by Owly</li>
                            <li>c. No password resets by Owly</li>
                        </ul>
                    </div>
                </section>

                {/* Section 5 */}
                <section className="brutalist-card p-6 border-danger">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-danger pb-2 text-danger">
                        5. Master Password Responsibility ⚠️
                    </h2>
                    <p className="mb-4">Your master password:</p>
                    <ul className="space-y-1 font-mono text-sm mb-4">
                        <li>• Is <strong>never stored</strong></li>
                        <li>• <strong>Cannot be recovered</strong></li>
                        <li>• Is required to decrypt your data</li>
                    </ul>
                    <div className="bg-danger/10 border-2 border-danger p-4">
                        <p className="font-bold text-danger">
                            ⚠️ If you forget your master password, your data cannot be recovered.
                        </p>
                        <p className="mt-2 text-sm text-text-secondary">
                            This is a tradeoff for strong privacy and zero-knowledge security.
                        </p>
                    </div>
                </section>

                {/* Section 6 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        6. What Owly Protects Against
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly is designed to protect against:</p>
                    <ul className="space-y-2 font-mono text-sm">
                        <li>• Data breaches</li>
                        <li>• Server compromise</li>
                        <li>• Unauthorized third-party access</li>
                        <li>• Storage provider access</li>
                    </ul>
                    <p className="mt-4 font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Even if someone gains access to stored data, it remains encrypted.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        7. What Owly Does NOT Protect Against
                    </h2>
                    <p className="mb-4 text-text-secondary">No system is perfect. Owly does not protect against:</p>
                    <ul className="space-y-1 font-mono text-sm mb-4">
                        <li>• Malware on your device</li>
                        <li>• Compromised browser or extensions</li>
                        <li>• Someone physically accessing your unlocked device</li>
                        <li>• You sharing your secrets</li>
                    </ul>
                    <p className="font-bold text-sm bg-accent-primary p-3 border-2 border-border">
                        Use Owly on trusted devices only.
                    </p>
                </section>

                {/* Closing */}
                <section className="brutalist-card p-8 text-center text-white" style={{ backgroundColor: '#000000' }}>
                    <p className="text-xl font-bold">
                        Owly is designed so that even if the entire system is compromised, <br />
                        <span className="text-accent-primary">your secrets remain yours.</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
