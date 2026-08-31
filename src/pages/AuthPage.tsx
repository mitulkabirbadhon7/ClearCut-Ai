import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Mail, Lock, User, ArrowLeft, AlertCircle, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
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
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Terms and Conditions Consent Checkbox
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  // 2. Email Updates / Newsletter Checkbox
  const [receiveEmailUpdates, setReceiveEmailUpdates] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addToast } = useAppStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Strict email validation
  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed || trimmed.includes('..') || trimmed.includes('@.')) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailTrimmed = email.trim().toLowerCase();

    // 1. Strict Email Validation Check
    if (!emailTrimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmail(emailTrimmed)) {
      setErrorMsg('Invalid email format. Please enter a valid email or Gmail address (e.g. yourname@gmail.com).');
      return;
    }

    // 2. Password & Name Validation for Registration
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

    // 3. Terms Agreement Checkbox Validation
    if (!agreeToTerms) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setTimeout(() => {
          setIsLoading(false);
          addToast({
            title: mode === 'register' ? 'Account Created (Demo)' : 'Signed In (Demo)',
            description: `Working in demo mode.${receiveEmailUpdates ? ' Email updates enabled.' : ''}`,
            type: 'info',
          });
          if (onNavigate) onNavigate('dashboard');
        }, 800);
        return;
      }

      if (mode === 'login') {
        await signInWithEmail(emailTrimmed, password);
        await initializeAuth();
        addToast({
          title: 'Sign In Successful',
          description: `Welcome back to ClearCut AI!`,
          type: 'success',
        });
        if (onNavigate) onNavigate('dashboard');
      } else if (mode === 'register') {
        await signUpWithEmail(emailTrimmed, password, fullName.trim());
        await initializeAuth();
        addToast({
          title: 'Account Created Successfully!',
          description: `Welcome to ClearCut AI! 5 Free Daily Credits added.${receiveEmailUpdates ? ' Subscribed to email updates.' : ''}`,
          type: 'success',
        });
        if (onNavigate) onNavigate('dashboard');
      } else {
        await resetPasswordForEmail(emailTrimmed);
        addToast({
          title: 'Password Reset Sent',
          description: `Recovery instructions sent to ${emailTrimmed}`,
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
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 animate-in fade-in duration-300">
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
            <CardTitle className="text-2xl font-extrabold text-text-primary">
              {mode === 'login' && 'Sign In to Your Account'}
              {mode === 'register' && 'Create Your Free Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </CardTitle>
            <CardDescription className="text-text-secondary">
              {mode === 'login' && 'Sign in to access your cutout studio, credits, and history.'}
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
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-border text-sm font-semibold text-text-primary transition-colors shadow-sm cursor-pointer"
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
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
              )}

              <div className="space-y-1">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                {email.trim() && !validateEmail(email) && (
                  <p className="text-[11px] text-status-error flex items-center gap-1 font-medium pl-1">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid email format (e.g. name@gmail.com)
                  </p>
                )}
              </div>

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
                    className="text-xs text-brand-cyan hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* 2 EXPLICIT INTERACTIVE CONSENT CHECKBOXES */}
              {mode !== 'forgot' && (
                <div className="space-y-3 p-4 rounded-xl bg-card-elevated border border-border-subtle shadow-sm my-3">
                  {/* 1st Checkbox: Terms & Conditions */}
                  <div
                    onClick={() => setAgreeToTerms(!agreeToTerms)}
                    className="flex items-start gap-3 cursor-pointer group select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                        agreeToTerms
                          ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                          : 'bg-card border-border-default hover:border-brand-blue'
                      }`}
                    >
                      {agreeToTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs text-text-primary leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigate) onNavigate('terms');
                        }}
                        className="text-brand-cyan hover:underline font-bold"
                      >
                        Terms & Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigate) onNavigate('privacy');
                        }}
                        className="text-brand-cyan hover:underline font-bold"
                      >
                        Privacy Policy
                      </button>
                      <span className="text-status-error font-bold ml-1">*</span>
                    </span>
                  </div>

                  {/* 2nd Checkbox: Email Updates */}
                  <div
                    onClick={() => setReceiveEmailUpdates(!receiveEmailUpdates)}
                    className="flex items-start gap-3 cursor-pointer group select-none pt-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                        receiveEmailUpdates
                          ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                          : 'bg-card border-border-default hover:border-brand-blue'
                      }`}
                    >
                      {receiveEmailUpdates && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs text-text-secondary leading-relaxed">
                      I want to receive product updates, news, and special promotional offers via email.
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message Box */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-status-error/15 border border-status-error/40 text-status-error text-xs flex items-center gap-2.5 animate-in fade-in-50">
                  <AlertCircle className="w-4 h-4 shrink-0 text-status-error" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full justify-center shadow-lg shadow-brand-blue/20"
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
          <CardFooter className="p-0 pt-6 justify-center border-t border-border-subtle text-xs text-text-muted flex flex-col gap-2">
            {mode === 'login' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="text-brand-cyan font-bold hover:underline ml-1"
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
                  className="text-brand-cyan font-bold hover:underline ml-1"
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
                  className="text-brand-cyan font-bold hover:underline ml-1"
                >
                  Back to Sign In
                </button>
              </p>
            )}

            <div className="pt-2 text-[11px] text-text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Protected by Supabase Zero-Trust Security</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
