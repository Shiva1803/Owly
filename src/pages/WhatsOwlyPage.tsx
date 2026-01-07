import { Link } from 'react-router-dom';

export function WhatsOwlyPage() {
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
                <div className="flex items-center gap-6">
                    <img
                        src="/owly.jpg"
                        alt="Owly"
                        className="w-24 h-24 object-contain rounded-lg border-2 border-border"
                    />
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight">
                            What's Owly?
                        </h1>
                        <p className="text-text-secondary mt-2">A private place for your most important information.</p>
                    </div>
                </div>
            </div>

            {/* Intro Section */}
            <div className="brutalist-card p-6 mb-8 bg-accent-primary">
                <p className="text-lg mb-4">
                    Owly is a <strong>personal vault</strong> for storing notes and passwords securely without trusting a company, a server, or a database with your secrets.
                </p>
                <p className="font-bold">
                    It's built for people who want control, privacy, and ownership over their data.
                </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Why Owly Exists */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Why Owly Exists
                    </h2>
                    <p className="mb-4 text-text-secondary">Most note-taking and password apps:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Store your data on centralized servers</li>
                        <li>• Can technically access your information</li>
                        <li>• Rely on accounts, emails, and resets</li>
                    </ul>
                    <p className="mb-2">Owly takes a different approach.</p>
                    <p className="font-bold text-lg bg-bg-secondary p-3 border-l-4 border-accent-primary">
                        Your data belongs to you, and only you.
                    </p>
                </section>

                {/* What You Can Do */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        What You Can Do With Owly
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly lets you:</p>
                    <ul className="space-y-2 font-mono text-sm">
                        <li>• Store passwords securely</li>
                        <li>• Save private notes</li>
                        <li>• Attach private images to notes</li>
                        <li>• Organize secrets with tags</li>
                        <li>• Search within your vault</li>
                        <li>• Copy credentials when needed</li>
                    </ul>
                    <p className="mt-4 font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        All without giving up control of your data.
                    </p>
                </section>

                {/* Built for Privacy-First Users */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Built for Privacy-First Users
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly is ideal if you:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>1. Don't want your data on company servers</li>
                        <li>2. Care about long-term privacy</li>
                        <li>3. Prefer ownership over convenience</li>
                        <li>4. Use Web3 wallets already</li>
                    </ul>
                </section>

                {/* Designed Around Ownership */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Designed Around Ownership
                    </h2>
                    <p className="font-mono text-sm">
                        Owly uses your wallet as your identity. That means{' '}
                        <span className="text-black px-1 font-bold">You own your vault</span>,{' '}
                        <span className="text-black px-1 font-bold">Its access is tied to your wallet</span> &{' '}
                        <span className="text-black px-1 font-bold">There is no central account to reset or lock you out</span>.
                    </p>
                </section>

                {/* Simple by Design */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Simple by Design
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly focuses on:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• A clean interface</li>
                        <li>• Minimal features done well</li>
                        <li>• No unnecessary complexity</li>
                    </ul>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        It's meant to be used daily, not configured endlessly.
                    </p>
                </section>

                {/* What Owly Is Not */}
                <section className="brutalist-card p-6 border-danger">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-danger pb-2 text-danger">
                        What Owly Is Not
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly is not:</p>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>1. A social app</li>
                        <li>2. A team password manager</li>
                        <li>3. A recovery service</li>
                        <li>4. A replacement for enterprise security tools</li>
                    </ul>
                    <p className="font-bold">
                        It's a personal, privacy-first vault.
                    </p>
                </section>

                {/* Built in the Open */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Built in the Open
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly is developed openly and transparently.</p>
                    <p className="mb-2">The code is public, and the design decisions are intentional.</p>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Trust is earned through clarity, not promises.
                    </p>
                </section>

                {/* Who's Behind Owly */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        Who's Behind Owly
                    </h2>
                    <p className="mb-4">
                        Owly is built by{' '}
                        <a
                            href="https://x.com/iamShivanshT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black bg-accent-primary px-1 font-bold hover:underline"
                        >
                            Shivansh Tripathi
                        </a>{' '}
                        as a privacy-first experiment and product.
                    </p>
                    <p className="text-text-secondary">
                        It's designed to be simple, honest, and respectful of user data.
                    </p>
                </section>

                {/* Closing Thought */}
                <section className="brutalist-card p-8 text-center text-white" style={{ backgroundColor: '#000000' }}>
                    <p className="text-lg">
                        Owly is for the things you don't want anyone else to see{' '}
                        <span className="text-accent-primary font-bold">now or in the future.</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
