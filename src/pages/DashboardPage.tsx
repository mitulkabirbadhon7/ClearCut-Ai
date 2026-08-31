import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Coins,
  Zap,
  Shield,
  Layers,
  CreditCard,
  Key,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useProcessingHistory } from '@/hooks/useProcessingHistory';
import { useUserTransactions } from '@/hooks/useUserTransactions';
import { JobHistoryGrid } from '@/components/dashboard/JobHistoryGrid';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { ApiKeyManager } from '@/components/dashboard/ApiKeyManager';
import { AccountSettings } from '@/components/dashboard/AccountSettings';

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

type DashboardTab = 'overview' | 'transactions' | 'api-keys' | 'settings';

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const { user } = useAuthStore();
  const { data: credits, isLoading: creditsLoading } = useUserCredits();
  const { data: history, isLoading: historyLoading } = useProcessingHistory(50);
  const { data: transactions, isLoading: txLoading } = useUserTransactions();

  const totalCredits = (credits?.free_daily_remaining || 0) + (credits?.purchased_credits || 0);

  const tabs = [
    { id: 'overview' as const, label: 'Overview & Cutouts', icon: Layers },
    { id: 'transactions' as const, label: 'bKash Payments', icon: CreditCard, count: transactions?.length },
    { id: 'api-keys' as const, label: 'Developer API', icon: Key },
    { id: 'settings' as const, label: 'Account Settings', icon: SettingsIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* User Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-card-elevated via-card to-card border border-border-subtle shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'}!
            </h1>
            <Badge variant="gradient">Pro Studio</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary font-mono">
            {user?.email || 'Logged In Account'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('home') : null)}
            className="shadow-lg shadow-brand-blue/20"
          >
            New Cutout
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Coins className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('pricing') : null)}
          >
            Top Up (bKash)
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card variant="default" className="p-5 space-y-3 border-l-4 border-l-brand-cyan">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold uppercase tracking-wider">Free Daily Credits</span>
            <Sparkles className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-3xl font-black text-text-primary">
            {creditsLoading ? '...' : credits?.free_daily_remaining ?? 5}
            <span className="text-xs font-normal text-text-muted ml-1.5">/ 5 today</span>
          </div>
          <p className="text-[11px] text-text-muted">Resets automatically at midnight</p>
        </Card>

        <Card variant="default" className="p-5 space-y-3 border-l-4 border-l-brand-blue">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold uppercase tracking-wider">Purchased Credits</span>
            <Coins className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-3xl font-black text-text-primary">
            {creditsLoading ? '...' : credits?.purchased_credits ?? 0}
          </div>
          <p className="text-[11px] text-text-muted">Never expire until used</p>
        </Card>

        <Card variant="default" className="p-5 space-y-3 border-l-4 border-l-brand-pink">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold uppercase tracking-wider">Total Available</span>
            <Zap className="w-4 h-4 text-brand-pink" />
          </div>
          <div className="text-3xl font-black text-text-primary">
            {creditsLoading ? '...' : totalCredits}
            <span className="text-xs font-normal text-text-muted ml-1.5">credits</span>
          </div>
          <p className="text-[11px] text-text-muted">1 credit = 1 full HD cutout</p>
        </Card>

        <Card variant="default" className="p-5 space-y-3 border-l-4 border-l-status-success">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold uppercase tracking-wider">Security & Privacy</span>
            <Shield className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-black text-status-success">
            24h Active
          </div>
          <p className="text-[11px] text-text-muted">Ephemeral auto-purge enabled</p>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-subtle overflow-x-auto no-scrollbar gap-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card-elevated text-text-muted">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2 animate-in fade-in-50 duration-200">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <JobHistoryGrid
              jobs={history || []}
              isLoading={historyLoading}
              onNavigateToUpload={() => (onNavigate ? onNavigate('home') : null)}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionsTable
            transactions={transactions || []}
            isLoading={txLoading}
            onTopUp={() => (onNavigate ? onNavigate('pricing') : null)}
          />
        )}

        {activeTab === 'api-keys' && <ApiKeyManager />}

        {activeTab === 'settings' && <AccountSettings />}
      </div>
    </div>
  );
};
