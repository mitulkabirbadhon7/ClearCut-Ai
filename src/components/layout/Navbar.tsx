import React, { useState } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { UserMenu } from './UserMenu';
import { Menu, X, Sparkles, LogIn, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
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
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Pricing (BDT)', id: 'pricing' },
    { label: 'Developer API', id: 'api' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="focus:outline-none focus:ring-2 focus:ring-brand-blue/50 rounded-lg text-left"
          aria-label="ClearCut AI Home"
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
                activeRoute === link.id ? 'text-brand-cyan font-bold' : 'text-text-secondary'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => handleLinkClick('dashboard')}
              className={`text-sm font-medium transition-colors hover:text-brand-cyan ${
                activeRoute === 'dashboard' ? 'text-brand-cyan font-bold' : 'text-text-secondary'
              }`}
            >
              Dashboard
            </button>
          )}
          {user && (user.email === 'admin@clearcut.ai' || user.email === 'mitulkabirbadhon7@gmail.com' || user.user_metadata?.role === 'admin' || localStorage.getItem('approved_admins')?.includes(user.email || '')) && (
            <button
              onClick={() => handleLinkClick('admin')}
              className={`text-sm font-medium transition-colors hover:text-brand-pink ${
                activeRoute === 'admin' ? 'text-brand-pink font-bold' : 'text-text-secondary'
              }`}
            >
              Admin Panel
            </button>
          )}
        </nav>

        {/* Desktop Actions & Day/Night Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Day / Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-brand-blue/40 text-text-secondary hover:text-text-primary transition-all focus:outline-none flex items-center justify-center shadow-sm"
            aria-label={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            title={theme === 'dark' ? 'Switch to Day Mode (Sun)' : 'Switch to Night Mode (Moon)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {user ? (
            <UserMenu onNavigate={onNavigate} />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<LogIn className="w-4 h-4" />}
              onClick={() => handleLinkClick('auth')}
            >
              Sign In
            </Button>
          )}

          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => handleLinkClick('home')}
          >
            Remove Background
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Day / Night Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle text-text-secondary focus:outline-none"
            aria-label={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            title={theme === 'dark' ? 'Day Mode' : 'Night Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-card-elevated focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-card/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleLinkClick('home')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeRoute === 'home' ? 'text-brand-cyan font-bold bg-card-elevated' : 'text-text-secondary'
              }`}
            >
              Home (Cutout Studio)
            </button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeRoute === link.id ? 'text-brand-cyan font-bold bg-card-elevated' : 'text-text-secondary'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => handleLinkClick('dashboard')}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeRoute === 'dashboard' ? 'text-brand-cyan font-bold bg-card-elevated' : 'text-text-secondary'
                }`}
              >
                User Dashboard
              </button>
            )}
            {user && (user.email === 'admin@clearcut.ai' || user.email === 'mitulkabirbadhon7@gmail.com' || user.user_metadata?.role === 'admin' || localStorage.getItem('approved_admins')?.includes(user.email || '')) && (
              <button
                onClick={() => handleLinkClick('admin')}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeRoute === 'admin' ? 'text-brand-pink font-bold bg-card-elevated' : 'text-text-secondary'
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2.5">
            {user ? (
              <div className="pb-1">
                <UserMenu onNavigate={onNavigate} />
              </div>
            ) : (
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                leftIcon={<LogIn className="w-4 h-4" />}
                onClick={() => handleLinkClick('auth')}
              >
                Sign In
              </Button>
            )}
            <Button
              variant="gradient"
              size="md"
              className="w-full justify-center"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => handleLinkClick('home')}
            >
              Remove Background
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
