import { Link } from 'react-router-dom';

export function HowToUsePage() {
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
                    <span className="text-2xl">How to Use Owly</span>
                </h1>
            </div>

            {/* Intro Section */}
            <div className="brutalist-card p-6 mb-8 bg-accent-primary">
                <p className="text-lg mb-2">Owly is designed to be <strong>simple and fast</strong>.</p>
                <p className="font-bold">You can start using it in minutes.</p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Step 1 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        1. Connect Your Wallet
                    </h2>
                    <ol className="space-y-2 font-mono text-sm list-decimal list-inside mb-4">
                        <li>Open Owly in your browser</li>
                        <li>Connect your Sui-compatible wallet</li>
                        <li>Your wallet acts as your identity</li>
                    </ol>

                    {/* No wallet subsection */}
                    <div className="border-2 border-border p-4 bg-bg-secondary">
                        <h3 className="font-bold uppercase mb-3">Don't have a wallet yet?</h3>
                        <p className="mb-3 text-text-secondary">That's okay.</p>
                        <p className="mb-4 text-sm">
                            Owly uses wallets instead of accounts to keep your data private and under your control.
                        </p>
                        <p className="font-bold mb-2">To get started:</p>
                        <ol className="space-y-2 font-mono text-sm list-decimal list-inside mb-4">
                            <li>Install a Sui-compatible wallet</li>
                            <li>Create a wallet (takes ~2 minutes)</li>
                            <li>Come back and connect it to Owly</li>
                        </ol>
                        <p className="mb-4 text-sm">
                            Once set up, your wallet becomes your permanent key to your vault.
                        </p>
                        <a
                            href="https://youtu.be/q-EamifuDiE?si=By6KqUfX-w1X-xit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-black bg-accent-primary px-2 py-1 font-bold hover:underline"
                        >
                            Learn how to make one here →
                        </a>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        2. Create or Unlock Your Vault
                    </h2>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Set a master password the first time you use Owly</li>
                        <li>• Enter the master password to unlock your vault in future sessions</li>
                    </ul>
                    <div className="bg-danger/10 border-2 border-danger p-4">
                        <p className="font-bold text-danger">
                            ⚠️ Keep this password safe, it cannot be recovered.
                        </p>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        3. Add a New Item
                    </h2>
                    <p className="mb-4 text-text-secondary">Click "New" and choose what you want to store:</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="border-2 border-border p-4">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span></span> Password
                            </h3>
                            <ul className="font-mono text-sm space-y-1">
                                <li>• Website or app name</li>
                                <li>• Username or email</li>
                                <li>• Password</li>
                                <li>• Optional notes</li>
                            </ul>
                        </div>
                        <div className="border-2 border-border p-4">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span></span> Note
                            </h3>
                            <ul className="font-mono text-sm space-y-1">
                                <li>• Title</li>
                                <li>• Body text</li>
                                <li>• Optional tags</li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-sm mt-4">
                        Fill in the fields and save.
                    </p>
                </section>

                {/* Step 4 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        4. View and Use Stored Items
                    </h2>
                    <ol className="space-y-2 font-mono text-sm list-decimal list-inside mb-4">
                        <li>Click any item in your vault</li>
                        <li>Enter your master password if prompted</li>
                        <li>View the decrypted content</li>
                    </ol>
                    <div className="bg-bg-secondary p-4 border-2 border-border">
                        <p className="font-bold mb-2">For passwords:</p>
                        <ul className="font-mono text-sm space-y-1">
                            <li>• Copy usernames or passwords with one click</li>
                            <li>• Toggle password visibility if needed</li>
                        </ul>
                    </div>
                </section>

                {/* Step 5 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        5. Organize Your Vault
                    </h2>
                    <p className="mb-4 text-text-secondary">Owly helps you stay organized:</p>
                    <ul className="space-y-2 font-mono text-sm">
                        <li>• Use tags to group related items</li>
                        <li>• Search by title or tag</li>
                        <li>• Keep work and personal items separate</li>
                    </ul>
                </section>

                {/* Step 6 */}
                <section className="brutalist-card p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-border pb-2">
                        6. Lock Your Vault
                    </h2>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• Lock your vault manually when finished</li>
                        <li>• Your vault also locks automatically after inactivity</li>
                    </ul>
                    <p className="font-bold text-sm bg-bg-secondary p-3 border-l-4 border-border">
                        Once locked, stored data is no longer visible.
                    </p>
                </section>

                {/* Step 7 */}
                <section className="brutalist-card p-6 border-danger">
                    <h2 className="text-xl font-bold uppercase mb-4 border-b-2 border-danger pb-2 text-danger">
                        7. What to Do If Something Goes Wrong
                    </h2>
                    <ul className="space-y-2 font-mono text-sm mb-4">
                        <li>• If you forget your master password → <strong className="text-danger">data cannot be recovered</strong></li>
                        <li>• If you lose your wallet → <strong className="text-danger">access to your vault is lost</strong></li>
                    </ul>
                    <p className="font-bold text-sm bg-danger/10 p-3 border-l-4 border-danger text-danger">
                        Owly does not have recovery mechanisms.
                    </p>
                </section>
            </div>
        </div>
    );
}
