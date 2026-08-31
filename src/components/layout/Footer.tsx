import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Shield, Heart, HelpCircle, Mail } from 'lucide-react';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <button onClick={(e) => handleNav('home', e)} className="text-left focus:outline-none">
              <BrandLogo size="md" />
            </button>
            <p className="text-xs text-text-muted leading-relaxed">
              Fast, accurate, and professional AI-powered background removal. Download high-resolution transparent PNG cutouts in seconds.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs text-brand-cyan">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy-First (24h Auto-Purge)</span>
            </div>
          </div>

          {/* Col 2: Product & Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Product & Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={(e) => handleNav('home', e)} className="hover:text-brand-cyan transition-colors">
                  Cutout Studio (Home)
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('features', e)} className="hover:text-brand-cyan transition-colors">
                  Features & Edge Precision
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
                <button onClick={(e) => handleNav('login', e)} className="hover:text-brand-cyan transition-colors">
                  Sign In to Account
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('register', e)} className="hover:text-brand-cyan transition-colors">
                  Register (5 Free Daily Credits)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Help & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={(e) => handleNav('help', e)} className="hover:text-brand-cyan transition-colors font-medium text-text-primary flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('contact', e)} className="hover:text-brand-cyan transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-pink" />
                  Contact Support Form
                </button>
              </li>
              <li className="pt-2 text-text-muted">
                <span className="font-semibold text-text-primary block">Official bKash Gateway</span>
                <span className="text-[11px]">Automated instant top-up & invoice delivery</span>
              </li>
              <li className="text-[11px] text-text-muted">
                Response time: Within 2-4 hours
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={(e) => handleNav('about', e)} className="hover:text-brand-cyan transition-colors">
                  About ClearCut AI
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('terms', e)} className="hover:text-brand-cyan transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={(e) => handleNav('privacy', e)} className="hover:text-brand-cyan transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <a
                  href="mailto:mitulkabirbadhon7@gmail.com"
                  className="hover:text-brand-cyan transition-colors text-text-muted block break-all text-[11px]"
                >
                  mitulkabirbadhon7@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} ClearCut AI. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>by Mitul Kabir Badhon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={(e) => handleNav('terms', e)} className="hover:underline">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={(e) => handleNav('privacy', e)} className="hover:underline">
              Privacy & Cookies
            </button>
            <span>•</span>
            <button onClick={(e) => handleNav('help', e)} className="hover:underline">
              Support Center
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
