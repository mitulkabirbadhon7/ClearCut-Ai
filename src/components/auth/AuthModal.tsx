import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPasswordForEmail,
  isSupabaseConfigured,
  formatAuthError,
} from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addToast } = useAppStore();
  const { setUser } = useAuthStore();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Email format validation
    const emailTrimmed = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please ensure both passwords are identical.');
        return;
      }
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // High-fidelity fallback for offline demo
        const mockUser = {
          id: `demo_${Date.now()}`,
          email: emailTrimmed,
          user_metadata: { full_name: fullName.trim() || emailTrimmed.split('@')[0] },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any;

        setUser(mockUser, { access_token: 'demo_token' } as any);
        addToast({
          title: mode === 'register' ? 'Account Created!' : 'Welcome Back!',
          description: `Signed in as ${emailTrimmed}.`,
          type: 'success',
        });
        onClose();
        if (onSuccess) onSuccess();
        return;
      }

      if (mode === 'login') {
        const { user, session } = await signInWithEmail(emailTrimmed, password);
        setUser(user, session);
        addToast({
          title: 'Welcome Back!',
          description: 'Successfully signed in to ClearCut AI.',
          type: 'success',
        });
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        const { user, session } = await signUpWithEmail(emailTrimmed, password, fullName.trim());
        if (user && !session) {
          addToast({
            title: 'Account Created Successfully!',
            description: 'Please check your email inbox to confirm your account.',
            type: 'info',
          });
        } else {
          setUser(user, session);
          addToast({
            title: 'Welcome to ClearCut AI!',
            description: 'Your account is ready with 5 Free Daily Credits.',
            type: 'success',
          });
        }
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        await resetPasswordForEmail(emailTrimmed);
        addToast({
          title: 'Password Reset Sent',
          description: 'Please check your email for the password recovery link.',
          type: 'success',
        });
        setMode('login');
      }
    } catch (err: any) {
      const msg = formatAuthError(err);
      setErrorMsg(msg);
      addToast({
        title: mode === 'login' ? 'Sign In Failed' : 'Registration Notice',
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
          description: 'Configure VITE_SUPABASE_URL and Supabase Google Provider to enable OAuth.',
          type: 'info',
        });
        return;
      }
      await signInWithGoogle();
    } catch (err: any) {
      const msg = formatAuthError(err);
      setErrorMsg(msg);
      addToast({
        title: 'Google Sign In',
        description: msg,
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-6">
        {/* Modal Header */}
        <div className="text-center space-y-2">
          <Badge variant="gradient" size="sm">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Get 5 Free Credits Daily'}
            {mode === 'forgot' && 'Account Recovery'}
          </Badge>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            {mode === 'login' && 'Welcome Back to ClearCut AI'}
            {mode === 'register' && 'Create Your Free Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-text-muted">
            {mode === 'login' && 'Sign in to access your dashboard, HD cutouts & API keys.'}
            {mode === 'register' && 'Get 5 free background removals every single day.'}
            {mode === 'forgot' && "Enter your email and we'll send a secure password reset link."}
          </p>
        </div>

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-brand-blue/50 text-sm font-semibold text-text-primary transition-all shadow-sm focus:outline-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              placeholder="Enter your full name"
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
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-primary focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />
          )}

          {mode === 'register' && (
            <Input
              label="Retype Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-muted hover:text-text-primary focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
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
            <div className="p-2.5 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full justify-center shadow-lg shadow-brand-blue/20"
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
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className="text-brand-cyan font-bold hover:underline"
              >
                Register Free
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="text-brand-cyan font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="text-brand-cyan font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>Encrypted with Supabase Auth Security</span>
        </div>
      </div>
    </Modal>
  );
};
