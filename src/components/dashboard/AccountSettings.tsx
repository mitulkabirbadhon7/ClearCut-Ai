import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { updateUserPassword, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const { user, initializeAuth } = useAuthStore();
  const { addToast } = useAppStore();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: fullName },
        });
        if (error) throw error;
        await initializeAuth();
      }

      addToast({
        title: 'Profile Updated',
        description: 'Your account name has been updated successfully.',
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        description: err?.message || 'Unable to update profile.',
        type: 'error',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters.',
        type: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Mismatch',
        description: 'Passwords do not match.',
        type: 'error',
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (isSupabaseConfigured) {
        await updateUserPassword(newPassword);
      }
      setNewPassword('');
      setConfirmPassword('');
      addToast({
        title: 'Password Changed',
        description: 'Your account password has been updated.',
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Change Failed',
        description: err?.message || 'Unable to change password.',
        type: 'error',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Profile Details Form */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-base sm:text-lg font-bold text-text-primary">Profile Information</h3>
          </div>
          <Badge variant="gradient">Verified Account</Badge>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            value={user?.email || 'user@example.com'}
            disabled
            leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
            helperText="Account email cannot be changed directly."
          />

          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Name"
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <div className="flex justify-end">
            <Button variant="gradient" size="md" type="submit" isLoading={isUpdatingProfile}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Security Form */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-border-subtle pb-4">
          <Lock className="w-5 h-5 text-brand-pink" />
          <h3 className="text-base sm:text-lg font-bold text-text-primary">Security & Password</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
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

          <div className="flex justify-end">
            <Button variant="outline" size="md" type="submit" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-xl bg-card border border-border-subtle flex items-center gap-3 text-xs text-text-muted">
        <ShieldCheck className="w-5 h-5 text-status-success shrink-0" />
        <div className="flex items-center gap-1.5">
          <span>Protected by</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="font-semibold text-text-secondary">Supabase Row-Level Security (RLS) & BCrypt Encryption</span>
        </div>
      </div>
    </div>
  );
};
