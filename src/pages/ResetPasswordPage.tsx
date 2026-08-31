import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { updateUserPassword, isSupabaseConfigured } from '@/lib/supabase';

interface ResetPasswordPageProps {
  onNavigate?: (route: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addToast } = useAppStore();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        await updateUserPassword(newPassword);
      }
      addToast({
        title: 'Password Updated',
        description: 'Your password has been reset successfully. Please sign in.',
        type: 'success',
      });
      if (onNavigate) onNavigate('auth');
    } catch (err: any) {
      const msg = err?.message || 'Failed to update password.';
      setErrorMsg(msg);
      addToast({
        title: 'Password Reset Error',
        description: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('auth') : null)}
          >
            Back to Sign In
          </Button>
          <BrandLogo size="sm" showText={false} />
        </div>

        <Card variant="elevated" className="border-border-subtle shadow-2xl p-6 sm:p-8">
          <CardHeader className="p-0 pb-6 text-center">
            <CardTitle className="text-2xl font-extrabold">Set New Password</CardTitle>
            <CardDescription>
              Enter a secure new password for your ClearCut AI account.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

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
                isLoading={loading}
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
          <span>Encrypted with Supabase Auth GoTrue</span>
        </div>
      </div>
    </div>
  );
};
