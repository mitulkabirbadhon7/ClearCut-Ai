import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Coins, Zap, Shield, Key } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useProcessingHistory } from '@/hooks/useProcessingHistory';
import { JobHistoryGrid } from '@/components/dashboard/JobHistoryGrid';

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { data: credits, isLoading: creditsLoading } = useUserCredits();
  const { data: history, isLoading: historyLoading } = useProcessingHistory(50);

  const totalCredits = (credits?.free_daily_remaining || 0) + (credits?.purchased_credits || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      {/* Header Banner */}
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

      {/* Metrics Row */}
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
          <p className="text-[11px] text-text-muted">Resets automatically every night</p>
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

      {/* Quick API Keys Banner */}
      <Card variant="elevated" className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-brand-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Integrate ClearCut AI into your App or Store</h4>
            <p className="text-xs text-text-muted">Generate secure REST API keys for automated e-commerce workflows.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => (onNavigate ? onNavigate('api') : null)}>
          View API Docs
        </Button>
      </Card>

      {/* Recent Processing History Grid */}
      <JobHistoryGrid
        jobs={history || []}
        isLoading={historyLoading}
        onNavigateToUpload={() => (onNavigate ? onNavigate('home') : null)}
      />
    </div>
  );
};
