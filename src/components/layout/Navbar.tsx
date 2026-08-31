import React, { useState } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Menu, X, Sparkles, LogIn } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface NavbarProps {
  onNavigate?: (route: string) => void;
  activeRoute?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeRoute = 'home',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setActiveModal } = useAppStore();

  const navLinks = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing (BDT)', id: 'pricing' },
    { label: 'Developer API', id: 'api' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="focus:outline-none focus:ring-2 focus:ring-brand-blue/50 rounded-lg"
          aria-label="SnapCut AI Home"
        >
          <BrandLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-sm font-medium transition-colors hover:text-brand-cyan ${
                activeRoute === link.id ? 'text-brand-cyan font-semibold' : 'text-text-secondary'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogIn className="w-4 h-4" />}
            onClick={() => setActiveModal('auth')}
          >
            Sign In
          </Button>

          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => handleLinkClick('upload-section')}
          >
            Remove Background
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-card-elevated focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-text-primary" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-card/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-brand-cyan hover:bg-card-elevated transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              leftIcon={<LogIn className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveModal('auth');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="gradient"
              size="md"
              className="w-full justify-center"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => handleLinkClick('upload-section')}
            >
              Remove Background
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
