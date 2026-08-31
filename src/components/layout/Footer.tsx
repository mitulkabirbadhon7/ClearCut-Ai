import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-subtle bg-card/60 backdrop-blur-md pt-16 pb-12 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-text-muted leading-relaxed">
              Fast, simple, and professional AI-powered background removal. Download high-resolution transparent PNG cutouts in seconds.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs text-brand-cyan">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy-First (24h Ephemeral Storage)</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#upload-section" className="hover:text-brand-cyan transition-colors">
                  One-Click Background Removal
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-cyan transition-colors">
                  HD Transparent PNG Export
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand-cyan transition-colors">
                  Pricing Plans & Credit Packs
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-brand-cyan transition-colors">
                  Developer REST API
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & Market */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Payment & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>Official bKash Payment Gateway</span>
              </li>
              <li>
                <span className="text-text-muted">Instant BDT Checkout & Automatic Crediting</span>
              </li>
              <li>
                <span className="text-text-muted">Bank-grade SSL Encryption</span>
              </li>
              <li>
                <span className="text-text-muted">No Credit Card Required</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/privacy" className="hover:text-brand-cyan transition-colors">
                  Privacy Policy (24-Hour Purge)
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-brand-cyan transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-brand-cyan transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-brand-cyan transition-colors">
                  Security Overview
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} SnapCut AI. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>for creators & businesses.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-text-secondary font-medium">
              <Sparkles className="w-3 h-3 text-brand-cyan" />
              <span>Bangladesh Market Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
