import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PricingPlan } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { createBkashPaymentSession } from '@/lib/bkash';
import { X, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

interface BkashCheckoutModalProps {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAuth?: () => void;
}

export const BkashCheckoutModal: React.FC<BkashCheckoutModalProps> = ({
  plan,
  isOpen,
  onClose,
  onNavigateToAuth,
}) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handleCheckout = async () => {
    if (!user) {
      onClose();
      if (onNavigateToAuth) onNavigateToAuth();
      addToast({
        title: 'Sign In Required',
        description: 'Please sign in or create a free account to complete your bKash payment.',
        type: 'info',
      });
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await createBkashPaymentSession(plan, user.id);

      if (!result.success || !result.bkashURL) {
        setErrorMsg(result.error || 'Unable to connect to bKash gateway.');
        return;
      }

      // Redirect to official bKash payment page
      window.location.href = result.bkashURL;
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
      <Card variant="elevated" className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-border shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* bKash Header Brand */}
        <div className="flex items-center gap-3 border-b border-border-subtle pb-5">
          <div className="w-12 h-12 rounded-xl bg-[#E2136E]/10 border border-[#E2136E]/30 flex items-center justify-center font-black text-[#E2136E] text-xl">
            bK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-text-primary">bKash Payment Gateway</h3>
              <Badge variant="outline" className="text-[#E2136E] border-[#E2136E]/30">
                Official Merchant
              </Badge>
            </div>
            <p className="text-xs text-text-muted">Instant BDT Tokenized Checkout</p>
          </div>
        </div>

        {/* Plan Summary Box */}
        <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-text-primary">{plan.name}</h4>
              <p className="text-xs text-brand-cyan font-semibold">
                +{plan.credits_included} High-Definition Cutout Credits
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-text-primary">৳{plan.price_bdt}</div>
              <span className="text-[10px] text-text-muted font-mono uppercase">BDT (One-Time)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border-subtle space-y-1.5">
            {plan.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                <Check className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            size="lg"
            className="w-full justify-center shadow-xl shadow-brand-blue/20 bg-gradient-to-r from-[#E2136E] via-brand-blue to-brand-cyan"
            onClick={handleCheckout}
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Pay ৳{plan.price_bdt} with bKash
          </Button>

          <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-status-success" />
            <span>256-Bit Encrypted bKash Merchant API Connection</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
