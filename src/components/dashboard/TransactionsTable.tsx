import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Transaction } from '@/types';
import { CreditCard, CheckCircle2, Clock, XCircle, FileText, Plus } from 'lucide-react';

interface TransactionsTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  onTopUp?: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  isLoading = false,
  onTopUp,
}) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border-subtle bg-card flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-lg font-bold text-text-primary">bKash Payment & Invoice History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-card-elevated text-text-muted font-mono">
            {transactions.length}
          </span>
        </div>

        {onTopUp && (
          <Button variant="gradient" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={onTopUp}>
            Buy Credits (bKash)
          </Button>
        )}
      </div>

      {transactions.length > 0 ? (
        <Card variant="default" className="overflow-hidden border-border-subtle p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Payment ID / TrxID</th>
                  <th className="py-3.5 px-4 sm:px-6">Amount (BDT)</th>
                  <th className="py-3.5 px-4 sm:px-6">Provider</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-card-hover/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 text-text-secondary whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-medium text-text-primary whitespace-nowrap">
                      <div>{tx.provider_trx_id || tx.provider_payment_id || 'Pending Gateway'}</div>
                      <div className="text-[10px] text-text-muted font-normal">{tx.id.substring(0, 13)}...</div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-brand-cyan whitespace-nowrap">
                      ৳{Number(tx.amount_bdt).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-text-secondary uppercase whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
                        {tx.provider}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {tx.status === 'successful' ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          <span>Paid</span>
                        </Badge>
                      ) : tx.status === 'pending' ? (
                        <Badge variant="warning" size="sm">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Pending</span>
                        </Badge>
                      ) : (
                        <Badge variant="error" size="sm">
                          <XCircle className="w-3 h-3 mr-1" />
                          <span>{tx.status}</span>
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedTx(tx)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card variant="default" className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-card-elevated border border-border mx-auto flex items-center justify-center text-text-muted">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-base font-bold text-text-primary">No payment transactions yet</h4>
            <p className="text-xs text-text-muted">
              When you top up credits or purchase a plan via bKash, your digital invoices and trxID history will appear here.
            </p>
          </div>
          {onTopUp && (
            <Button variant="outline" size="sm" onClick={onTopUp}>
              Explore Pricing Plans
            </Button>
          )}
        </Card>
      )}

      {/* Invoice Modal Dialog */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
          <Card variant="elevated" className="w-full max-w-md p-6 space-y-6 border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-lg font-bold text-text-primary">Official bKash Payment Receipt</h3>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="text-text-primary font-bold">{selectedTx.provider_trx_id || selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Payment Provider:</span>
                <span className="text-pink-400 font-bold uppercase">{selectedTx.provider} Merchant Gateway</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Amount Paid:</span>
                <span className="text-brand-cyan font-bold text-sm">৳{Number(selectedTx.amount_bdt).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Date & Time:</span>
                <span className="text-text-secondary">{new Date(selectedTx.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Status:</span>
                <span className="text-status-success uppercase font-bold">{selectedTx.status}</span>
              </div>
            </div>

            <Button variant="outline" size="md" className="w-full justify-center" onClick={() => setSelectedTx(null)}>
              Close Receipt
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
