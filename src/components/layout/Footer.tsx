import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Shield, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (route: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border-subtle bg-card/60 backdrop-blur-md pt-16 pb-12 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <button onClick={(e) => handleNav('home', e)} className="text-left">
              <BrandLogo size="md" />
            </button>
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
                <button onClick={(e) => handleNav('home', e)} className="hover:text-brand-cyan transition-colors">
                  One-Click Background Removal
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('features', e)} className="hover:text-brand-cyan transition-colors">
                  Features & AI Edge Precision
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('pricing', e)} className="hover:text-brand-cyan transition-colors">
                  Pricing Plans & Credit Packs (BDT)
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('api', e)} className="hover:text-brand-cyan transition-colors">
                  Developer REST API
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('dashboard', e)} className="hover:text-brand-cyan transition-colors">
                  User Dashboard & History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & Market */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Payment & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span className="font-semibold text-text-primary">Official bKash Payment Gateway</span>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={(e) => handleNav('privacy', e)} className="hover:text-brand-cyan transition-colors">
                  Privacy Policy (24-Hour Purge)
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('terms', e)} className="hover:text-brand-cyan transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('about', e)} className="hover:text-brand-cyan transition-colors">
                  About SnapCut AI
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('contact', e)} className="hover:text-brand-cyan transition-colors">
                  Contact Support
                </button>
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
