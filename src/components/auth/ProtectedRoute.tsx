import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { Lock, LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate?: (route: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigate }) => {
  const { user, isLoading } = useAuthStore();
  const { setActiveModal } = useAppStore();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // If user is not signed in, show clean authentication prompt instead of a blank screen
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <Card
          variant="elevated"
          className="w-full max-w-md p-8 sm:p-10 space-y-6 text-center border-border shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center text-brand-pink mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" size="sm">Authentication Required</Badge>
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              Sign In to Continue
            </h2>
            <p className="text-xs text-text-muted">
              You must be signed in to an active account to access this page.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="gradient"
              size="lg"
              className="w-full justify-center shadow-lg shadow-brand-blue/20"
              leftIcon={<LogIn className="w-4 h-4" />}
              onClick={() => setActiveModal('auth')}
            >
              Sign In / Register
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => {
                if (onNavigate) {
                  onNavigate('home');
                } else {
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                }
              }}
            >
              Return to Home Studio
            </Button>
          </div>

          <div className="pt-2 border-t border-border-subtle text-[11px] text-text-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
            <span>Protected by Supabase Zero-Trust Security</span>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
