import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Mail, Lock, User, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPasswordForEmail,
  isSupabaseConfigured,
  formatAuthError,
} from '@/lib/supabase';

interface AuthPageProps {
  onNavigate?: (route: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addToast } = useAppStore();
  const { initializeAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setTimeout(() => {
          setIsLoading(false);
          addToast({
            title: mode === 'login' ? 'Signed In (Demo)' : 'Account Created (Demo)',
            description: 'Supabase credentials pending in .env file. Working in demo mode.',
            type: 'info',
          });
          if (onNavigate) onNavigate('dashboard');
        }, 800);
        return;
      }

      if (mode === 'login') {
        await signInWithEmail(email, password);
        await initializeAuth();
        addToast({
          title: 'Sign In Successful',
          description: `Welcome back to ClearCut AI!`,
          type: 'success',
        });
        if (onNavigate) onNavigate('dashboard');
      } else if (mode === 'register') {
        await signUpWithEmail(email, password, fullName);
        await initializeAuth();
        addToast({
          title: 'Account Created',
          description: 'Please check your email to verify your account.',
          type: 'success',
        });
        if (onNavigate) onNavigate('dashboard');
      } else {
        await resetPasswordForEmail(email);
        addToast({
          title: 'Password Reset Sent',
          description: `Recovery instructions sent to ${email}`,
          type: 'info',
        });
        setMode('login');
      }
    } catch (err: any) {
      const msg = formatAuthError(err);
      setErrorMsg(msg);
      addToast({
        title: 'Authentication Notice',
        description: msg,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!isSupabaseConfigured) {
        addToast({
          title: 'Google OAuth',
          description: 'Configure VITE_SUPABASE_URL and Supabase Google Provider in .env to enable OAuth.',
          type: 'info',
        });
        return;
      }
      await signInWithGoogle();
    } catch (err: any) {
      addToast({
        title: 'Google OAuth Failed',
        description: err?.message || 'Could not sign in with Google.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('home') : null)}
          >
            Back to Home
          </Button>
          <BrandLogo size="sm" showText={false} />
        </div>

        <Card variant="elevated" className="border-border-subtle shadow-2xl p-6 sm:p-8">
          <CardHeader className="p-0 pb-6 text-center">
            <CardTitle className="text-2xl font-extrabold">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Your Free Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Sign in to access your image cutouts, credits, and history.'}
              {mode === 'register' && 'Get 5 free background removals every single day.'}
              {mode === 'forgot' && 'Enter your registered email to receive a recovery link.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-5">
            {/* Google OAuth Button */}
            {mode !== 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-border text-sm font-semibold text-text-primary transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-border-subtle w-full" />
                  <span className="bg-card px-3 text-[11px] text-text-muted uppercase font-bold tracking-wider relative">
                    Or with email
                  </span>
                </div>
              </>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Mitul Kabir"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              {mode !== 'forgot' && (
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-brand-cyan hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full justify-center"
                size="lg"
                isLoading={isLoading}
              >
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>

          {/* Mode Switchers */}
          <CardFooter className="p-0 pt-6 justify-center border-t border-border-subtle text-xs text-text-muted">
            {mode === 'login' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-brand-cyan font-bold hover:underline ml-1"
                >
                  Sign Up Free
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-brand-cyan font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-brand-cyan font-bold hover:underline"
              >
                Return to Sign In
              </button>
            )}
          </CardFooter>
        </Card>

        {/* Security Trust Indicator */}
        <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
          <span>Protected by Supabase Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};
