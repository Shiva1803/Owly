import { Link } from 'react-router-dom';

export function ThreatModelPage() {
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
                    <span>Threat Model</span>
                </h1>
            </div>

            {/* Purpose Section */}
            <div className="brutalist-card p-6 mb-8 bg-bg-secondary">
                <h2 className="text-xl font-bold uppercase mb-4">Purpose of This Page</h2>
                <p className="text-text-secondary mb-4">This page explains:</p>
                <ul className="space-y-2 font-mono text-sm">
                    <li>• What threats Owly is <strong>designed to protect against</strong></li>
                    <li>• What threats are <strong>out of scope</strong></li>
                    <li>• The <strong>assumptions</strong> Owly makes about user behavior</li>
                </ul>
                <p className="mt-4 text-xs text-text-secondary italic">
                    This is not a usage guide or encryption deep dive, it's about risk boundaries.
                </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Section 1 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        1. Security Assumptions
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly assumes that:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• You are using a <strong>trusted device</strong></li>
                        <li>• Your wallet private keys are <strong>secure</strong></li>
                        <li>• Your browser environment is <strong>not compromised</strong></li>
                        <li>• You do <strong>not share</strong> your master password</li>
                    </ul>
                    <div className="bg-danger/10 border-2 border-danger p-4">
                        <p className="font-bold text-danger">
                            If these assumptions fail, Owly cannot guarantee protection.
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        2. Threats Owly Protects Against
                    </h2>

                    <div className="space-y-6">
                        <div className="border-l-4 pl-4" style={{ borderColor: '#00cc00' }}>
                            <h3 className="font-bold mb-2" style={{ color: '#00cc00' }}>Data Breaches</h3>
                            <p className="text-text-secondary text-sm mb-2">If:</p>
                            <ul className="font-mono text-sm space-y-1 mb-2">
                                <li>• Storage providers are compromised</li>
                                <li>• Network traffic is intercepted</li>
                                <li>• Backend infrastructure is attacked</li>
                            </ul>
                            <p className="font-bold text-sm">Your data remains encrypted and unreadable.</p>
                        </div>

                        <div className="border-l-4 pl-4" style={{ borderColor: '#00cc00' }}>
                            <h3 className="font-bold mb-2" style={{ color: '#00cc00' }}>Unauthorized Storage Access</h3>
                            <p className="text-sm">
                                Even if someone gains access to encrypted blobs stored on Walrus,
                                they <strong>cannot decrypt</strong> the data without your master password.
                            </p>
                        </div>

                        <div className="border-l-4 pl-4" style={{ borderColor: '#00cc00' }}>
                            <h3 className="font-bold mb-2" style={{ color: '#00cc00' }}>Blockchain Observability</h3>
                            <p className="text-text-secondary text-sm mb-2">All on-chain data on Sui is public by design.</p>
                            <p className="mb-2">Owly ensures:</p>
                            <ul className="font-mono text-sm space-y-1">
                                <li>• No plaintext secrets are ever stored on-chain</li>
                                <li>• Only references and ownership metadata are visible</li>
                            </ul>
                        </div>

                        <div className="border-l-4 pl-4" style={{ borderColor: '#00cc00' }}>
                            <h3 className="font-bold mb-2" style={{ color: '#00cc00' }}>Insider & Server-Side Attacks</h3>
                            <p className="text-sm">
                                Owly does not rely on centralized servers holding user secrets.
                            </p>
                            <p className="font-bold text-sm mt-2">
                                There is no database to leak and no admin access to exploit.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="brutalist-card p-6 border-danger">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-danger pb-2 text-danger">
                        3. Threats Owly Does NOT Protect Against
                    </h2>

                    <div className="space-y-6">
                        <div className="border-l-4 border-danger pl-4">
                            <h3 className="font-bold text-danger mb-2">Compromised Device</h3>
                            <p className="text-text-secondary text-sm mb-2">Owly cannot protect you if:</p>
                            <ul className="font-mono text-sm space-y-1 mb-2">
                                <li>• Your device has malware</li>
                                <li>• Your browser is compromised</li>
                                <li>• A malicious extension is installed</li>
                            </ul>
                            <p className="text-sm">
                                If an attacker controls your device, they can access decrypted data while your vault is unlocked.
                            </p>
                        </div>

                        <div className="border-l-4 border-danger pl-4">
                            <h3 className="font-bold text-danger mb-2">Weak or Exposed Master Password</h3>
                            <p className="text-text-secondary text-sm mb-2">If:</p>
                            <ul className="font-mono text-sm space-y-1 mb-2">
                                <li>• Your master password is weak</li>
                                <li>• You reuse it elsewhere</li>
                                <li>• You share it</li>
                            </ul>
                            <p className="text-sm">Owly cannot prevent unauthorized access.</p>
                        </div>

                        <div className="border-l-4 border-danger pl-4">
                            <h3 className="font-bold text-danger mb-2">Wallet Key Compromise</h3>
                            <p className="text-text-secondary text-sm mb-2">If your wallet private keys are stolen:</p>
                            <ul className="font-mono text-sm space-y-1 mb-2">
                                <li>• An attacker may access your encrypted vault</li>
                                <li>• Decryption still requires your master password</li>
                            </ul>
                            <p className="font-bold text-sm">Wallet security is critical.</p>
                        </div>

                        <div className="border-l-4 border-danger pl-4">
                            <h3 className="font-bold text-danger mb-2">Physical Access Attacks</h3>
                            <p className="text-text-secondary text-sm mb-2">Owly does not protect against:</p>
                            <ul className="font-mono text-sm space-y-1">
                                <li>• Someone accessing your unlocked device</li>
                                <li>• Shoulder surfing</li>
                                <li>• Screen recording malware</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        4. Network-Level Threats
                    </h2>
                    <p className="mb-4">Owly assumes standard HTTPS and wallet security practices.</p>
                    <p className="text-text-secondary mb-2">Threats like:</p>
                    <ul className="font-mono text-sm space-y-1 mb-4">
                        <li>• DNS hijacking</li>
                        <li>• Browser-level MITM attacks</li>
                    </ul>
                    <p className="text-sm">
                        are outside Owly's control but mitigated by modern web security standards.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="brutalist-card p-6 bg-accent-primary">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        5. Smart Contract Risks
                    </h2>
                    <ul className="space-y-2 font-mono text-sm">
                        <li>• Smart contracts are currently <strong>unaudited</strong></li>
                        <li>• Bugs may exist</li>
                        <li>• Contract logic does not process plaintext secrets</li>
                    </ul>
                    <p className="mt-4 font-bold text-sm border-2 border-border p-3 bg-bg-primary">
                        Users should treat Owly as experimental software.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        6. Encryption Boundary
                    </h2>
                    <p className="mb-4">
                        Encryption and decryption occur <strong>only on the client</strong> using Mysten Seal.
                    </p>
                    <p className="mb-2">At no point does Owly:</p>
                    <ul className="font-mono text-sm space-y-1">
                        <li>• Transmit decrypted data</li>
                        <li>• Store encryption keys</li>
                        <li>• Log sensitive material</li>
                    </ul>
                </section>

                {/* Section 7 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        7. User Responsibilities (Explicit)
                    </h2>
                    <p className="mb-4 text-text-secondary">You are responsible for:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Keeping your master password safe</li>
                        <li>• Securing your wallet</li>
                        <li>• Using trusted devices</li>
                        <li>• Logging out when not in use</li>
                    </ul>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Owly cannot recover lost credentials.
                    </p>
                </section>

                {/* Section 8 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        8. Non-Goals (Important Clarity)
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly does <strong className="text-text-primary">NOT</strong> aim to:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Replace hardware password managers</li>
                        <li>• Protect against nation-state attackers</li>
                        <li>• Recover lost passwords</li>
                        <li>• Provide custodial access</li>
                    </ul>
                    <p className="font-bold">
                        Owly is designed for privacy-first personal use.
                    </p>
                </section>

                {/* Section 9 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        9. Reporting Vulnerabilities
                    </h2>
                    <p className="mb-4">If you discover a security issue:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Open a <a href="https://github.com/Shiva1803/Owly" target="_blank" rel="noopener noreferrer" className="text-[#3498db] hover:underline">GitHub issue</a></li>
                        <li>• Or contact the maintainer privately</li>
                    </ul>
                    <p className="font-bold text-sm">
                        Responsible disclosure is encouraged.
                    </p>
                </section>

                {/* Closing */}
                <section className="brutalist-card p-8 text-center text-white" style={{ backgroundColor: '#000000' }}>
                    <p className="text-lg font-bold">
                        Owly is built so that most realistic failures expose <span className="text-accent-primary">encrypted data</span>, not secrets
                        but ultimate security depends on <span className="text-[#33ffea]">user behavior</span> and <span className="text-[#e8ff7f]">device trust</span>.
                    </p>
                </section>
            </div>
        </div>
    );
}
