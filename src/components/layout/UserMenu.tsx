import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/Badge';
import {
  User as UserIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface UserMenuProps {
  onNavigate?: (route: string) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuthStore();
  const { addToast } = useAppStore();

  const userEmail = user?.email || 'user@example.com';
  const fullName = user?.user_metadata?.full_name || '';
  const displayName = fullName || userEmail.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleMenuItem = (route: string) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    addToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
    window.location.hash = '';
    window.history.pushState(null, '', '/');
    if (onNavigate) {
      onNavigate('home');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isUserAdmin =
    userEmail === 'admin@clearcut.ai' ||
    userEmail === 'mitulkabirbadhon7@gmail.com' ||
    user?.user_metadata?.role === 'admin' ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('approved_admins')?.includes(userEmail));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-brand-blue/40 transition-colors focus:outline-none"
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-pink p-[1px]">
          <div className="w-full h-full bg-card rounded-[7px] flex items-center justify-center text-xs font-bold text-brand-cyan">
            {initials}
          </div>
        </div>
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-bold text-text-primary leading-tight truncate max-w-[130px]">
            {displayName}
          </span>
          <span className="text-[10px] text-brand-cyan font-semibold">5 Free Daily Credits</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card/95 border border-border-subtle shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
          {/* User Info Header */}
          <div className="p-3 rounded-xl bg-card-elevated border border-border-subtle/60 space-y-1">
            <div className="text-xs font-bold text-text-primary truncate">{displayName}</div>
            <div className="text-[11px] text-text-muted truncate">{userEmail}</div>
            <div className="pt-1.5 flex items-center justify-between">
              <Badge variant="gradient">5 Credits Left</Badge>
              <span className="text-[10px] text-text-muted">Resets 12 AM</span>
            </div>
          </div>

          <div className="pt-1 space-y-0.5">
            {/* 1. Profile */}
            <button
              onClick={() => handleMenuItem('dashboard')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card-elevated transition-colors"
            >
              <UserIcon className="w-4 h-4 text-brand-cyan" />
              <span>My Profile</span>
            </button>

            {/* 2. Dashboard */}
            <button
              onClick={() => handleMenuItem('dashboard')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card-elevated transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-blue" />
              <span>User Dashboard</span>
            </button>

            {/* 3. Account Settings */}
            <button
              onClick={() => handleMenuItem('dashboard')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card-elevated transition-colors"
            >
              <Settings className="w-4 h-4 text-text-muted" />
              <span>Account Settings</span>
            </button>

            {/* 4. Top-up Credits (bKash) */}
            <button
              onClick={() => handleMenuItem('pricing')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card-elevated transition-colors"
            >
              <CreditCard className="w-4 h-4 text-brand-pink" />
              <span>Top-up Credits (bKash)</span>
            </button>

            {/* 5. Admin Panel (If authorized) */}
            {isUserAdmin && (
              <button
                onClick={() => handleMenuItem('admin')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-brand-pink hover:bg-brand-pink/10 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-brand-pink" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>

          <div className="pt-1 border-t border-border-subtle">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-status-error hover:bg-status-error/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
