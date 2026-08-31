import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Zap,
  CreditCard,
  History,
  Download,
  Key,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { addToast } = useAppStore();

  const mockJobs = [
    {
      id: 'job-9821',
      name: 'ecommerce-sneaker-red.jpg',
      status: 'completed',
      duration: '1.4s',
      date: 'Today, 11:20 AM',
      size: '2.4 MB',
      expiresIn: '23h 40m',
    },
    {
      id: 'job-9820',
      name: 'portrait-headshot-studio.png',
      status: 'completed',
      duration: '1.8s',
      date: 'Today, 09:15 AM',
      size: '4.1 MB',
      expiresIn: '21h 35m',
    },
    {
      id: 'job-9819',
      name: 'product-cosmetic-bottle.webp',
      status: 'completed',
      duration: '1.2s',
      date: 'Yesterday, 04:50 PM',
      size: '1.8 MB',
      expiresIn: '5h 10m',
    },
    {
      id: 'job-9815',
      name: 'fashion-model-catalog.jpg',
      status: 'expired',
      duration: '2.1s',
      date: 'Aug 29, 2026',
      size: '3.6 MB',
      expiresIn: 'Expired (24h Lapsed)',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              User Dashboard
            </h1>
            <Badge variant="gradient">Pro Plan</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            Manage your background removals, bKash credits, and API keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('home') : null)}
          >
            Remove Background
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CreditCard className="w-4 h-4 text-pink-500" />}
            onClick={() => (onNavigate ? onNavigate('pricing') : null)}
          >
            Top-up Credits (bKash)
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="elevated" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Available Credits</span>
            <div className="p-2 rounded-lg bg-card border border-border-subtle text-brand-cyan">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-text-primary">284</div>
            <div className="text-[11px] text-status-success font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+300 monthly credits</span>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Today&apos;s Usage</span>
            <div className="p-2 rounded-lg bg-card border border-border-subtle text-brand-blue">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-text-primary">16</div>
            <div className="text-[11px] text-text-muted">Avg. processing: 1.4s</div>
          </div>
        </Card>

        <Card variant="elevated" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">Total Images Cleaned</span>
            <div className="p-2 rounded-lg bg-card border border-border-subtle text-brand-pink">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-text-primary">1,420</div>
            <div className="text-[11px] text-text-muted">99.8% Success Rate</div>
          </div>
        </Card>

        <Card variant="elevated" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">bKash Active Plan</span>
            <div className="p-2 rounded-lg bg-card border border-border-subtle text-status-success">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-extrabold text-text-primary">৳499 / mo</div>
            <div className="text-[11px] text-brand-cyan">Renews: Sep 30, 2026</div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Processing Jobs & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Recent Processing Jobs Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-brand-cyan" />
              <span>Recent Background Removals</span>
            </h2>
            <span className="text-xs text-text-muted">24-hour auto-purge active</span>
          </div>

          <Card variant="default" className="divide-y divide-border-subtle overflow-hidden">
            {mockJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-card-elevated/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-checkerboard border border-border-subtle flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text-primary truncate">{job.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">
                      {job.date} • {job.size} • {job.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {job.status === 'completed' ? (
                    <>
                      <span className="text-[11px] text-text-muted">{job.expiresIn}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => {
                          addToast({
                            title: 'Download Initiated',
                            description: `Downloading transparent PNG for ${job.name}`,
                            type: 'success',
                          });
                        }}
                      >
                        Download PNG
                      </Button>
                    </>
                  ) : (
                    <Badge variant="error">File Expired</Badge>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Col 3: Quick Navigation & API Status */}
        <div className="space-y-6">
          <Card variant="elevated" className="p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">Quick Shortcuts</h3>
            <div className="space-y-2">
              {[
                { label: 'Developer API Keys', icon: Key, action: () => (onNavigate ? onNavigate('api') : null) },
                { label: 'Billing & bKash Invoices', icon: CreditCard, action: () => (onNavigate ? onNavigate('pricing') : null) },
                { label: 'Account Settings', icon: Settings, action: () => (onNavigate ? onNavigate('terms') : null) },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full p-3 rounded-xl bg-card border border-border-subtle flex items-center justify-between text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-brand-blue/40 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-brand-cyan" />
                      <span>{item.label}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Ephemeral Notice Card */}
          <Card variant="default" className="p-5 border-dashed border-border text-xs text-text-muted space-y-2">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-cyan" />
              <span>Storage Lifecycle Policy</span>
            </div>
            <p className="leading-relaxed">
              To protect your business privacy and keep services fast, images are automatically purged 24 hours after processing. Please download your cutouts promptly.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
