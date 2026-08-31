import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { executeBkashPayment } from '@/lib/bkash';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserCredits } from '@/hooks/useUserCredits';
import { CheckCircle2, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PaymentCallbackPageProps {
  onNavigate: (route: string) => void;
}

export const PaymentCallbackPage: React.FC<PaymentCallbackPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { refetch: refetchCredits } = useUserCredits();

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [trxId, setTrxId] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
    const paymentID = searchParams.get('paymentID');
    const paymentStatus = searchParams.get('status');
    const credits = parseInt(searchParams.get('credits') || '100', 10);
    const amount = parseFloat(searchParams.get('amount') || '299');

    if (!paymentID || paymentStatus !== 'success') {
      setStatus('failed');
      setErrorMessage('bKash payment was cancelled or encountered an error.');
      return;
    }

    const processPayment = async () => {
      try {
        const res = await executeBkashPayment(paymentID, user?.id || 'demo_user', credits, amount);

        if (!res.success) {
          setStatus('failed');
          setErrorMessage(res.error || 'Payment execution failed.');
          return;
        }

        setTrxId(res.trxID || `TRX${Date.now()}`);
        setAmountPaid(res.amount || amount.toString());
        setStatus('success');

        // Refetch user balance in real-time
        await refetchCredits();
      } catch (err: any) {
        setStatus('failed');
        setErrorMessage(err.message || 'Verification error.');
      }
    };

    processPayment();
  }, [user]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-lg p-8 sm:p-10 space-y-6 text-center border-border shadow-2xl animate-in zoom-in-95 duration-300">
        {status === 'verifying' && (
          <div className="space-y-4 py-8">
            <div className="w-16 h-16 rounded-full border-4 border-brand-cyan/20 border-t-brand-cyan animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-text-primary">Verifying bKash Transaction...</h3>
            <p className="text-xs text-text-muted">
              Confirming transaction status with bKash PGW and crediting your wallet.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="w-20 h-20 rounded-2xl bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" size="md">Payment Verified</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                Credits Added to Your Account!
              </h2>
              <p className="text-xs text-text-secondary">
                Thank you for your purchase. Your ClearCut AI HD credits are ready to use immediately.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-xl bg-card border border-border-subtle text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="text-brand-cyan font-bold">{trxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Amount Paid:</span>
                <span className="text-text-primary font-bold">৳{amountPaid} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Provider:</span>
                <span className="text-[#E2136E] font-bold">bKash Tokenized PGW</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="gradient"
                size="md"
                className="flex-1 justify-center shadow-lg shadow-brand-blue/20"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={() => onNavigate('home')}
              >
                Start Creating Cutouts
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex-1 justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate('dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-status-error/15 border border-status-error/30 flex items-center justify-center text-status-error mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Payment Could Not Be Completed</h2>
              <p className="text-xs text-status-error">{errorMessage}</p>
            </div>

            <Button variant="outline" size="md" className="w-full justify-center" onClick={() => onNavigate('pricing')}>
              Return to Pricing Plans
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-border-subtle text-[11px] text-text-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>Official bKash Merchant Gateway Secured</span>
        </div>
      </Card>
    </div>
  );
};
