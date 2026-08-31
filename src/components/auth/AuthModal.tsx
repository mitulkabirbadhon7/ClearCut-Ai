import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPasswordForEmail, isSupabaseConfigured } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addToast } = useAppStore();
  const { initializeAuth } = useAuthStore();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Simulated local fallback mode when keys are not yet injected into .env
        setTimeout(() => {
          setLoading(false);
          addToast({
            title: mode === 'login' ? 'Signed In (Demo)' : 'Account Created (Demo)',
            description: 'Supabase credentials pending in .env file. Working in demo mode.',
            type: 'info',
          });
          onClose();
          if (onSuccess) onSuccess();
        }, 800);
        return;
      }

      if (mode === 'login') {
        await signInWithEmail(email, password);
        await initializeAuth();
        addToast({
          title: 'Sign In Successful',
          description: `Welcome back to SnapCut AI!`,
          type: 'success',
        });
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        await signUpWithEmail(email, password, fullName);
        await initializeAuth();
        addToast({
          title: 'Registration Successful',
          description: 'Please check your email to verify your account.',
          type: 'success',
        });
        onClose();
        if (onSuccess) onSuccess();
      } else {
        await resetPasswordForEmail(email);
        addToast({
          title: 'Password Reset Email Sent',
          description: `Instructions have been sent to ${email}`,
          type: 'info',
        });
        setMode('login');
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication error. Please try again.';
      setErrorMsg(msg);
      addToast({
        title: 'Authentication Error',
        description: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
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
        title: 'Google Sign In Failed',
        description: err?.message || 'Failed to initialize Google OAuth.',
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-6 pt-1">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <BrandLogo size="sm" showText={false} />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary">
            {mode === 'login' && 'Sign in to SnapCut AI'}
            {mode === 'register' && 'Create Your Free Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-text-muted">
            {mode === 'login' && 'Access your image cutouts, credits, and history.'}
            {mode === 'register' && 'Get 5 free background removals every day.'}
            {mode === 'forgot' && 'Enter your email to receive a recovery link.'}
          </p>
        </div>

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle text-xs font-semibold text-text-primary transition-colors shadow-sm"
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
              <span className="bg-card px-2.5 text-[10px] text-text-muted uppercase font-bold tracking-wider relative">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
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
                className="text-[11px] text-brand-cyan hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full justify-center"
            size="md"
            isLoading={loading}
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Recovery Email'}
          </Button>
        </form>

        {/* Mode Toggles */}
        <div className="pt-4 border-t border-border-subtle text-center text-xs text-text-muted">
          {mode === 'login' && (
            <p>
              No account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-brand-cyan font-bold hover:underline ml-1"
              >
                Register Free
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Already registered?{' '}
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
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
