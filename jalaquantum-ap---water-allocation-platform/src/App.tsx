import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ProblemStatementBanner } from './components/ProblemStatementBanner';
import { LoginPage } from './components/LoginPage';
import { DashboardOverview } from './components/DashboardOverview';
import { QuantumOptimizer } from './components/QuantumOptimizer';
import { BasinNetworkMap } from './components/BasinNetworkMap';
import { CanalScheduler } from './components/CanalScheduler';
import { UserManagement } from './components/UserManagement';
import { ProfileModal } from './components/ProfileModal';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Initializing JalaQuantum AP Platform...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in and navigated to login or private sections
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <ProblemStatementBanner />
        <Header
          activeTab="login"
          setActiveTab={(tab) => {
            if (tab === 'login') setActiveTab('login');
          }}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenProfile={() => {}}
        />
        <main className="flex-1 flex items-center justify-center">
          <LoginPage onSuccess={() => setActiveTab('dashboard')} />
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-400">
          <p>© 2026 Government of Andhra Pradesh · Water Resources Department · Central Water Commission (KGBO)</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <ProblemStatementBanner />
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onNavigateToOptimizer={() => setActiveTab('optimizer')}
            onNavigateToCanals={() => setActiveTab('canals')}
          />
        )}
        {activeTab === 'optimizer' && (
          <QuantumOptimizer
            onOrderDispatched={() => setActiveTab('canals')}
          />
        )}
        {activeTab === 'basin-map' && <BasinNetworkMap />}
        {activeTab === 'canals' && <CanalScheduler />}
        {activeTab === 'users' && <UserManagement />}
      </main>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Footer conforming to design rules (No fake telemetry tickers or buzzwords) */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-5 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span className="font-semibold text-slate-300">JalaQuantum AP</span>
            <span>·</span>
            <span>AP Water Resources Dept</span>
            <span>·</span>
            <span>CWC / KGBO Coordination</span>
            <span>·</span>
            <span>Team: Entangled Minds</span>
          </div>
          <div className="text-slate-400">
            Use Case 03: Irrigation & Water-Resource Allocation Optimisation
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
