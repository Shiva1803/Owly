import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-12 border-t-2 border-black mt-auto">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">

                    {/* Left Side: Powered By */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-3xl" style={{ fontFamily: '"Story Script", cursive' }}>
                            Encrypted with <a href="https://seal.mystenlabs.com/" target="_blank" rel="noopener noreferrer" className="text-[#e8ff7f] hover:underline">Seal</a> <br />
                            Stored on <a href="https://www.walrus.xyz/" target="_blank" rel="noopener noreferrer" className="text-[#33ffea] hover:underline">Walrus</a> <br />
                            Secured by <a href="https://www.sui.io/" target="_blank" rel="noopener noreferrer" className="text-[#3498db] hover:underline">Sui</a>
                        </p>
                    </div>

                    {/* Center: Mascots */}
                    <div className="flex-0 shrink-0">
                        <div className="w-75 h-auto">
                            <img src="/mascots.png" alt="Seal, Owl, and Walrus Mascots" className="w-full h-auto object-contain" />
                        </div>
                    </div>

                    {/* Right Side: Links */}
                    <div className="flex-1 flex flex-col items-center md:items-end gap-3 font-mono text-sm">
                        <a href="/whats-owly" className="hover:text-[#ffff00] transition-colors uppercase tracking-wider hover:underline decoration-2 underline-offset-4">What's Owly</a>
                        <a href="/how-to-use" className="hover:text-[#ffff00] transition-colors uppercase tracking-wider hover:underline decoration-2 underline-offset-4">How to Use Owly</a>
                        <a href="/encryption" className="hover:text-[#ffff00] transition-colors uppercase tracking-wider hover:underline decoration-2 underline-offset-4">How Encryption Works</a>
                        <a href="/privacy" className="hover:text-[#ffff00] transition-colors uppercase tracking-wider hover:underline decoration-2 underline-offset-4">Privacy & Security</a>
                        <a href="/threat-model" className="hover:text-[#ffff00] transition-colors uppercase tracking-wider hover:underline decoration-2 underline-offset-4">Threat Model</a>
                    </div>
                </div>

                {/* Bottom Credits */}
                <div className="mt-12 pt-8 border-t border-white/20 text-center flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-xs font-mono uppercase tracking-widest">
                        Built by <a href="https://x.com/iamShivanshT" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffff00] hover:underline">Shivansh Tripathi</a>
                    </p>
                    <a href="https://github.com/Shiva1803/Owly" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {/* Github Logo */}
                        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </footer >
    );
};
