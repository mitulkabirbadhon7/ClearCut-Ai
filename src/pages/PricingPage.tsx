import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface PricingPageProps {
  onNavigate?: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { addToast } = useAppStore();

  const handleCheckout = (planName: string, amount: number) => {
    addToast({
      title: 'bKash Gateway Initialized',
      description: `Opening bKash Tokenized Checkout for ${planName} (৳${amount} BDT)...`,
      type: 'info',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => (onNavigate ? onNavigate('home') : null)}
        >
          Back to Home
        </Button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs font-semibold text-brand-cyan">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Official bKash Payment Gateway Enabled</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Simple, Transparent Pricing in <span className="text-gradient">Bangladeshi Taka (BDT)</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          No hidden fees, no foreign exchange conversion costs. Pay easily using your bKash mobile account.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Free */}
        <Card variant="default" className="p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Badge variant="default">Free Forever</Badge>
            <div>
              <span className="text-4xl font-extrabold text-text-primary">৳0</span>
              <span className="text-xs text-text-muted ml-1">/ month</span>
            </div>
            <p className="text-xs text-text-muted">Great for occasional quick image cutouts.</p>

            <ul className="space-y-3 text-xs text-text-secondary pt-4 border-t border-border-subtle">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>5 Free HD Images Daily</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Standard Edge Detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>24-Hour Ephemeral Storage</span>
              </li>
            </ul>
          </div>

          <Button variant="outline" className="w-full justify-center" onClick={() => (onNavigate ? onNavigate('auth') : null)}>
            Get Started Free
          </Button>
        </Card>

        {/* Tier 2: Pro Monthly */}
        <Card variant="glow" className="p-8 flex flex-col justify-between space-y-6 relative scale-105 border-brand-blue/40 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="gradient">Most Popular</Badge>
              <span className="text-[11px] font-bold text-pink-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span> bKash Ready
              </span>
            </div>

            <div>
              <span className="text-4xl font-extrabold text-text-primary">৳499</span>
              <span className="text-xs text-text-muted ml-1">/ month</span>
            </div>
            <p className="text-xs text-text-muted">For high-volume e-commerce sellers, agencies, and creators.</p>

            <ul className="space-y-3 text-xs text-text-secondary pt-4 border-t border-border-subtle">
              <li className="flex items-center gap-2 font-bold text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>300 High-Speed HD Credits/mo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Maximum 5000×5000 Resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Priority AI Processing Server</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Developer API Access Included</span>
              </li>
            </ul>
          </div>

          <Button
            variant="gradient"
            className="w-full justify-center"
            leftIcon={<CreditCard className="w-4 h-4" />}
            onClick={() => handleCheckout('Pro Monthly', 499)}
          >
            Pay ৳499 with bKash
          </Button>
        </Card>

        {/* Tier 3: Credit Pack */}
        <Card variant="default" className="p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Badge variant="default">Pay As You Go</Badge>
            <div>
              <span className="text-4xl font-extrabold text-text-primary">৳299</span>
              <span className="text-xs text-text-muted ml-1">/ 100 Credits</span>
            </div>
            <p className="text-xs text-text-muted">One-time credit refill. Credits never expire.</p>

            <ul className="space-y-3 text-xs text-text-secondary pt-4 border-t border-border-subtle">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>100 Full HD Image Credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>No Recurring Auto-Billing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Instant Automatic Top-up</span>
              </li>
            </ul>
          </div>

          <Button
            variant="secondary"
            className="w-full justify-center"
            leftIcon={<CreditCard className="w-4 h-4 text-pink-500" />}
            onClick={() => handleCheckout('100 Credit Pack', 299)}
          >
            Buy 100 Credits (৳299)
          </Button>
        </Card>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-card-elevated border border-border-subtle flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <ShieldCheck className="w-10 h-10 text-status-success shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-text-primary">100% Secure Bangladeshi Payment Gateway</h4>
          <p className="text-xs text-text-muted mt-0.5">
            All transactions are encrypted and audited through official bKash Merchant tokenized endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};
