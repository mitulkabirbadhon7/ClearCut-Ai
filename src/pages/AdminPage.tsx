import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Zap,
  Activity,
  CheckCircle2,
  Search,
  Key,
  BookOpen,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate?: (route: string) => void;
}

interface PlatformUser {
  id: string;
  email: string;
  fullName: string;
  freeCredits: number;
  purchasedCredits: number;
  role: 'admin' | 'user';
  createdAt: string;
}

interface PlatformTransaction {
  id: string;
  userId: string;
  userEmail: string;
  amountBdt: number;
  trxId: string;
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

const MOCK_USERS: PlatformUser[] = [
  {
    id: 'usr_admin_01',
    email: 'admin@clearcut.ai',
    fullName: 'Master Administrator',
    freeCredits: 9999,
    purchasedCredits: 5000,
    role: 'admin',
    createdAt: '2026-08-01',
  },
  {
    id: 'usr_002',
    email: 'creator.studio@gmail.com',
    fullName: 'Rahim Chowdhury',
    freeCredits: 5,
    purchasedCredits: 300,
    role: 'user',
    createdAt: '2026-08-28',
  },
  {
    id: 'usr_003',
    email: 'ecommerce.dhaka@yahoo.com',
    fullName: 'Tanvir Ahmed',
    freeCredits: 3,
    purchasedCredits: 100,
    role: 'user',
    createdAt: '2026-08-29',
  },
  {
    id: 'usr_004',
    email: 'design.agency@outlook.com',
    fullName: 'Fatima Begum',
    freeCredits: 0,
    purchasedCredits: 500,
    role: 'user',
    createdAt: '2026-08-30',
  },
];

const MOCK_TRANSACTIONS: PlatformTransaction[] = [
  {
    id: 'tx_001',
    userId: 'usr_002',
    userEmail: 'creator.studio@gmail.com',
    amountBdt: 499,
    trxId: 'BKASH9A87X21',
    status: 'successful',
    createdAt: '2026-08-30 14:22',
  },
  {
    id: 'tx_002',
    userId: 'usr_003',
    userEmail: 'ecommerce.dhaka@yahoo.com',
    amountBdt: 299,
    trxId: 'BKASH7B54C99',
    status: 'successful',
    createdAt: '2026-08-30 18:45',
  },
  {
    id: 'tx_003',
    userId: 'usr_004',
    userEmail: 'design.agency@outlook.com',
    amountBdt: 499,
    trxId: 'BKASH4N12P00',
    status: 'successful',
    createdAt: '2026-08-31 09:15',
  },
];

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'guide'>('overview');
  const [usersList, setUsersList] = useState<PlatformUser[]>(MOCK_USERS);
  const [transactionsList] = useState<PlatformTransaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleAdminRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
          : u
      )
    );
    addToast({
      title: 'User Role Updated',
      description: 'Admin privileges modified successfully.',
      type: 'success',
    });
  };

  const handleAddCredits = (userId: string, amount: number) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, purchasedCredits: u.purchasedCredits + amount }
          : u
      )
    );
    addToast({
      title: 'Credits Added',
      description: `Added +${amount} credits to user account.`,
      type: 'success',
    });
  };

  const handleDeductCredits = (userId: string, amount: number) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, purchasedCredits: Math.max(0, u.purchasedCredits - amount) }
          : u
      )
    );
    addToast({
      title: 'Credits Deducted',
      description: `Deducted -${amount} credits from user account.`,
      type: 'info',
    });
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-card-elevated via-card to-card border border-brand-cyan/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  ClearCut AI — Master Admin Panel
                </h1>
                <Badge variant="gradient">Super Admin</Badge>
              </div>
              <p className="text-xs text-text-muted">
                Logged in as: <strong className="text-brand-cyan">{user?.email || 'admin@clearcut.ai'}</strong> • Platform control center for users, credits & bKash transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4 text-brand-cyan" />}
            onClick={() => setActiveTab('guide')}
          >
            Admin Guide & Instructions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (onNavigate ? onNavigate('dashboard') : null)}
          >
            Exit to User View
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-border-subtle overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Credits ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'transactions'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>bKash Ledger ({transactionsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'guide'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Admin & Maintenance Guide</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-brand-cyan">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Total Registered Users</span>
                <Users className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="text-3xl font-black text-text-primary">1,482</div>
              <p className="text-[11px] text-status-success">+28 today</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-[#E2136E]">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Total bKash Revenue</span>
                <CreditCard className="w-4 h-4 text-[#E2136E]" />
              </div>
              <div className="text-3xl font-black text-[#E2136E]">৳148,500</div>
              <p className="text-[11px] text-text-muted">BDT Total Sales</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-brand-blue">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">AI Cutouts Processed</span>
                <Zap className="w-4 h-4 text-brand-blue" />
              </div>
              <div className="text-3xl font-black text-text-primary">19,430</div>
              <p className="text-[11px] text-brand-cyan">99.8% Success Rate</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-status-success">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Average Latency</span>
                <Activity className="w-4 h-4 text-status-success" />
              </div>
              <div className="text-3xl font-black text-status-success">1.6s</div>
              <p className="text-[11px] text-text-muted">Neural Model Speed</p>
            </Card>
          </div>

          {/* System Maintenance Actions */}
          <Card variant="default" className="p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">System Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  addToast({
                    title: 'Storage Purge Triggered',
                    description: 'Purged expired media older than 24h.',
                    type: 'success',
                  })
                }
              >
                Trigger 24h Media Auto-Purge
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  addToast({
                    title: 'Daily Credits Reset',
                    description: 'Reset 5 daily credits for all registered users.',
                    type: 'success',
                  })
                }
              >
                Reset Daily Free Credits
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  addToast({
                    title: 'Cache Cleared',
                    description: 'Flushed edge CDN transformation cache.',
                    type: 'info',
                  })
                }
              >
                Flush Edge CDN Cache
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card variant="default" className="p-0 overflow-hidden border-border-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">User</th>
                    <th className="py-3.5 px-4 sm:px-6">Role</th>
                    <th className="py-3.5 px-4 sm:px-6">Free Daily</th>
                    <th className="py-3.5 px-4 sm:px-6">Purchased Credits</th>
                    <th className="py-3.5 px-4 sm:px-6">Joined</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-card-hover/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-text-primary">{u.fullName}</div>
                        <div className="text-[11px] text-text-muted">{u.email}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        {u.role === 'admin' ? (
                          <Badge variant="gradient" size="sm">Admin</Badge>
                        ) : (
                          <Badge variant="outline" size="sm">User</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-brand-cyan font-bold">{u.freeCredits} / 5</td>
                      <td className="py-4 px-4 sm:px-6 text-text-primary font-bold">{u.purchasedCredits}</td>
                      <td className="py-4 px-4 sm:px-6 text-text-muted">{u.createdAt}</td>
                      <td className="py-4 px-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddCredits(u.id, 50)}
                          className="text-brand-cyan hover:bg-brand-cyan/10"
                        >
                          +50 Credits
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeductCredits(u.id, 50)}
                          className="text-status-warning hover:bg-status-warning/10"
                        >
                          -50 Credits
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAdminRole(u.id)}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-6 animate-in fade-in-50">
          <Card variant="default" className="p-0 overflow-hidden border-border-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4 sm:px-6">Customer</th>
                    <th className="py-3.5 px-4 sm:px-6">bKash TrxID</th>
                    <th className="py-3.5 px-4 sm:px-6">Amount</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono">
                  {transactionsList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-card-hover/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 text-text-muted">{tx.createdAt}</td>
                      <td className="py-4 px-4 sm:px-6 text-text-primary font-bold">{tx.userEmail}</td>
                      <td className="py-4 px-4 sm:px-6 text-brand-cyan font-bold">{tx.trxId}</td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-text-primary">৳{tx.amountBdt} BDT</td>
                      <td className="py-4 px-4 sm:px-6">
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          <span>{tx.status}</span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="space-y-8 animate-in fade-in-50 max-w-4xl">
          {/* Guide Section 1: How to Login as Admin */}
          <Card variant="default" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-cyan">
              <Key className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-primary">1. How to Login as Admin</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <p>
                Any user whose registered email is <strong className="text-text-primary">admin@clearcut.ai</strong>, or has their role set to <code className="text-brand-cyan bg-black/40 px-1.5 py-0.5 rounded">admin</code> in Supabase, automatically receives Super Admin rights.
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Click <strong>Sign In</strong> in the top navbar.</li>
                <li>Enter your administrator email & password (or sign in with your admin Google account).</li>
                <li>Once logged in, the <strong>Master Admin Panel</strong> link will appear in your top navigation and user dropdown!</li>
              </ol>
            </div>
          </Card>

          {/* Guide Section 2: How to Give Admin Access to Another Person */}
          <Card variant="default" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-pink">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-primary">2. How to Grant Admin Access to Another Person</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <p>You can grant admin privileges in two ways:</p>
              <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-primary">Option A: Via This Admin Panel (Instant)</h4>
                <p className="text-xs">
                  Go to the <strong>Users & Credits</strong> tab above, find the person by name or email, and click <strong>Make Admin</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-primary">Option B: In Supabase SQL Editor</h4>
                <p className="text-xs">Run this simple SQL query in your Supabase SQL Editor:</p>
                <pre className="p-3 rounded-lg bg-black/80 text-xs font-mono text-brand-cyan overflow-x-auto">
{`UPDATE profiles 
SET role = 'admin' 
WHERE email = 'colleague@example.com';`}
                </pre>
              </div>
            </div>
          </Card>

          {/* Guide Section 3: How to Edit and Maintain the Website */}
          <Card variant="default" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-status-success">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-primary">3. How to Edit and Maintain the Website</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-text-primary">Editing Text, Pricing & Branding</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Pricing Plans:</strong> Update prices in <code className="text-brand-cyan">supabase/migrations/</code> or directly in Supabase table <code className="text-brand-cyan">plans</code>.</li>
                  <li><strong>Landing Page Content:</strong> Edit components inside <code className="text-brand-cyan">src/components/landing/</code>.</li>
                  <li><strong>Colors & Styling:</strong> Customize CSS variables in <code className="text-brand-cyan">src/index.css</code>.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <h4 className="font-bold text-text-primary">Deploying Updates</h4>
                <p className="text-xs">
                  When you make changes, commit to git and run <code className="text-brand-cyan">npm run build</code>. The project builds a lightning-fast production bundle into <code className="text-brand-cyan">dist/</code> ready for Vercel, Netlify, or Cloudflare Pages.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
