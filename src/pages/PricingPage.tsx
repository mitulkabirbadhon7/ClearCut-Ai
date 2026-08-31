import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import { useAuthStore } from '@/store/useAuthStore';
import { BkashCheckoutModal } from '@/components/payment/BkashCheckoutModal';
import { PricingPlan } from '@/types';
import { Check, Shield, HelpCircle } from 'lucide-react';

interface PricingPageProps {
  onNavigate?: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { data: plans = [], isLoading } = usePricingPlans();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.price_bdt === 0) {
      if (!user && onNavigate) {
        onNavigate('auth');
      } else if (onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('upload-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const faqs = [
    {
      q: 'How does the 5 free daily images limit work?',
      a: 'Every registered account gets 5 free credits every single day at midnight (BST). Unused free credits reset daily to 5.',
    },
    {
      q: 'Do purchased credit packs expire?',
      a: 'No! All purchased credit packs (e.g. 100 Credit Pack) never expire until you use them.',
    },
    {
      q: 'Can I pay securely using bKash in Bangladesh?',
      a: 'Yes! We support the official bKash Tokenized Merchant Payment Gateway with instant automated crediting.',
    },
    {
      q: 'What is the maximum image resolution supported?',
      a: 'Free users can upload images up to 4000×4000px. Pro & Paid plans support ultra-high resolution up to 6000×6000px.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="gradient" size="md">Transparent BDT Pricing</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
          Simple, Fair Pricing with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E2136E] to-brand-cyan">bKash</span>
        </h1>
        <p className="text-base text-text-secondary">
          No complicated subscriptions. 5 free cutouts every day, or top up high-resolution credit packs that never expire.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <Card key={i} variant="default" className="p-8 h-96 animate-pulse" />
            ))
          : plans.map((plan) => {
              const isPopular = plan.code.includes('pro') || plan.code.includes('100');
              return (
                <Card
                  key={plan.id}
                  variant={isPopular ? 'glow' : 'default'}
                  className={`p-8 flex flex-col justify-between relative ${
                    isPopular ? 'border-brand-blue/50' : 'border-border-subtle'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gradient" size="sm">Most Popular</Badge>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-text-primary">৳{plan.price_bdt}</span>
                        <span className="text-xs text-text-muted font-mono uppercase">
                          {plan.price_bdt === 0 ? 'Forever' : plan.is_recurring ? '/ month' : 'BDT'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-cyan font-semibold">
                        {plan.credits_included} Full HD Cutout Credits
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border-subtle">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-text-secondary">
                          <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      variant={isPopular ? 'gradient' : 'outline'}
                      size="lg"
                      className="w-full justify-center shadow-lg"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.price_bdt === 0 ? 'Start Free' : `Pay ৳${plan.price_bdt} via bKash`}
                    </Button>
                  </div>
                </Card>
              );
            })}
      </div>

      {/* bKash Trust Guarantee Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-card via-card-elevated to-card border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E2136E]/10 border border-[#E2136E]/30 flex items-center justify-center font-black text-[#E2136E] text-2xl shrink-0">
            bK
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Official bKash Merchant Checkout</h3>
            <p className="text-xs text-text-muted">
              Transactions are verified via automated tokenized checkout. Instant credit delivery.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
          <Shield className="w-4 h-4 text-status-success" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-text-muted">Everything you need to know about ClearCut AI credits and bKash payments.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} variant="default" className="p-5 space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-text-primary">{faq.q}</h4>
              </div>
              <p className="text-xs text-text-secondary pl-6.5 leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <BkashCheckoutModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigateToAuth={() => onNavigate && onNavigate('auth')}
      />
    </div>
  );
};
