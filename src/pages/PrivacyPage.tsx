import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PrivacyPageProps {
  onNavigate?: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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

      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs text-status-success font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Data Privacy & Security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Last Updated: August 31, 2026 • SnapCut AI Platform
        </p>
      </div>

      <Card variant="default" className="p-6 sm:p-10 space-y-8 text-sm text-text-secondary leading-relaxed">
        <div className="p-4 rounded-xl bg-status-success/10 border border-status-success/30 flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-text-primary">24-Hour Ephemeral Storage Guarantee</h4>
            <p className="text-xs text-text-secondary mt-1">
              SnapCut AI never permanently retains your uploaded photos or resulting transparent cutouts. Files are automatically destroyed after 24 hours.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-brand-cyan">1.</span> Information We Collect
          </h2>
          <p>
            When you register, we collect minimal account information such as your email address and name (via Supabase Auth). When uploading an image, we process the file in temporary memory to perform background removal and store the job metadata (duration, file size, status).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-brand-cyan">2.</span> How Images Are Processed
          </h2>
          <p>
            Images uploaded to SnapCut AI are sent via encrypted SSL connections to our secure temporary cloud storage (Cloudinary) and passed to our AI segmentation models. Images are not used to train machine learning models without your express consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-brand-cyan">3.</span> Payment Privacy (bKash Gateway)
          </h2>
          <p>
            SnapCut AI does not store credit card numbers, bKash PINs, or financial secrets on our servers. All financial transactions are processed securely through the official tokenized bKash Merchant Gateway.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-brand-cyan">4.</span> Cookies & Local Storage
          </h2>
          <p>
            We use secure session tokens and local storage strictly to keep you authenticated and store your UI preferences (such as dark mode and active job filters).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-brand-cyan">5.</span> Contacting Privacy Support
          </h2>
          <p>
            For inquiries regarding data deletion or privacy verification, contact us at: <span className="text-brand-cyan font-semibold">privacy@snapcut.ai</span>.
          </p>
        </section>
      </Card>
    </div>
  );
};
