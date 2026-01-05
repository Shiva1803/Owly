import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';

import { VaultProvider, useVault } from './context/VaultContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UnlockPage } from './pages/UnlockPage';
import { VaultListPage } from './pages/VaultListPage';
import { NewItemPage } from './pages/NewItemPage';
import { ViewItemPage } from './pages/ViewItemPage';
import { EditItemPage } from './pages/EditItemPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ThreatModelPage } from './pages/ThreatModelPage';
import { EncryptionPage } from './pages/EncryptionPage';
import { WhatsOwlyPage } from './pages/WhatsOwlyPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { AutoLockWarning } from './components/AutoLockWarning';

const queryClient = new QueryClient();

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isUnlocked } = useVault();

  if (!isUnlocked) {
    return <Navigate to="/unlock" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isUnlocked } = useVault();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/unlock"
            element={isUnlocked ? <Navigate to="/" replace /> : <UnlockPage />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VaultListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault/:id"
            element={
              <ProtectedRoute>
                <ViewItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/threat-model" element={<ThreatModelPage />} />
          <Route path="/encryption" element={<EncryptionPage />} />
          <Route path="/whats-owly" element={<WhatsOwlyPage />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AutoLockWarning />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <VaultProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </VaultProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
