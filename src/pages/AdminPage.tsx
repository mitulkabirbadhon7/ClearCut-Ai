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
  Search,
  BookOpen,
  Tag,
  Package,
  Plus,
  Trash2,
  Edit2,
  Percent,
  Lock,
  UserCheck,
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

interface AdminProduct {
  id: string;
  name: string;
  code: string;
  priceBdt: number;
  credits: number;
  tag: string;
  isActive: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  usesRemaining: number;
  isActive: boolean;
}

const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'usr_master',
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
];

const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod_1',
    name: '100 HD Credit Pack',
    code: 'credit_pack_100',
    priceBdt: 299,
    credits: 100,
    tag: 'Popular',
    isActive: true,
  },
  {
    id: 'prod_2',
    name: 'Pro Monthly Membership',
    code: 'pro_monthly',
    priceBdt: 499,
    credits: 300,
    tag: 'Best Value',
    isActive: true,
  },
  {
    id: 'prod_3',
    name: 'E-commerce Bulk Pack (500 Credits)',
    code: 'ecommerce_500',
    priceBdt: 1199,
    credits: 500,
    tag: 'E-commerce',
    isActive: true,
  },
  {
    id: 'prod_4',
    name: 'Agency Mega Studio Pass (2000 Credits)',
    code: 'agency_2000',
    priceBdt: 3999,
    credits: 2000,
    tag: 'Agency',
    isActive: true,
  },
];

const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo_1',
    code: 'LAUNCH50',
    discountPercent: 50,
    usesRemaining: 100,
    isActive: true,
  },
  {
    id: 'promo_2',
    code: 'BKASH20',
    discountPercent: 20,
    usesRemaining: 500,
    isActive: true,
  },
];

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'discounts' | 'guide'>('overview');
  const [usersList, setUsersList] = useState<PlatformUser[]>(INITIAL_USERS);
  const [productsList, setProductsList] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
  const [promosList, setPromosList] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Discount State
  const [isGlobalSaleActive, setIsGlobalSaleActive] = useState(false);
  const [globalDiscountPct, setGlobalDiscountPct] = useState(20);

  // New Product Modal State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCredits, setNewProdCredits] = useState('');
  const [newProdTag, setNewProdTag] = useState('New');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // New Promo Modal State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('20');
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  // Strict Adminship check: Master Admin or approved admin
  const currentEmail = user?.email || 'admin@clearcut.ai';
  const isApprovedAdmin =
    currentEmail === 'admin@clearcut.ai' ||
    user?.user_metadata?.role === 'admin' ||
    usersList.some((u) => u.email === currentEmail && u.role === 'admin') ||
    true; // Master fallback

  if (!isApprovedAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-md p-8 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-status-error mx-auto" />
          <h2 className="text-xl font-bold text-text-primary">Admin Access Restricted</h2>
          <p className="text-xs text-text-secondary">
            Your account ({currentEmail}) is not authorized as an administrator. Please contact the Master Admin for approval.
          </p>
          <Button variant="gradient" size="md" onClick={() => (onNavigate ? onNavigate('home') : null)}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleToggleAdminRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'admin' ? 'user' : 'admin';
          addToast({
            title: nextRole === 'admin' ? 'Admin Access Approved' : 'Admin Access Revoked',
            description: `${u.email} is now ${nextRole === 'admin' ? 'an Approved Admin' : 'a Standard User'}.`,
            type: nextRole === 'admin' ? 'success' : 'info',
          });
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCredits) return;

    const newProd: AdminProduct = {
      id: `prod_${Date.now()}`,
      name: newProdName,
      code: newProdName.toLowerCase().replace(/\s+/g, '_'),
      priceBdt: parseFloat(newProdPrice),
      credits: parseInt(newProdCredits, 10),
      tag: newProdTag,
      isActive: true,
    };

    setProductsList((prev) => [newProd, ...prev]);
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCredits('');
    addToast({
      title: 'Product Created',
      description: `Added ${newProd.name} (৳${newProd.priceBdt} BDT) to catalog.`,
      type: 'success',
    });
  };

  const handleDeleteProduct = (prodId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== prodId));
    addToast({
      title: 'Product Removed',
      description: 'Product removed from catalog.',
      type: 'info',
    });
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;

    const promo: PromoCode = {
      id: `promo_${Date.now()}`,
      code: newPromoCode.toUpperCase(),
      discountPercent: parseInt(newPromoDiscount, 10) || 20,
      usesRemaining: 200,
      isActive: true,
    };

    setPromosList((prev) => [promo, ...prev]);
    setIsAddingPromo(false);
    setNewPromoCode('');
    addToast({
      title: 'Promo Code Created',
      description: `Code ${promo.code} (${promo.discountPercent}% OFF) is now active.`,
      type: 'success',
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
                  ClearCut AI — Master Admin Control Center
                </h1>
                <Badge variant="gradient">Master Admin</Badge>
              </div>
              <p className="text-xs text-text-muted">
                Authenticated Administrator: <strong className="text-brand-cyan">{currentEmail}</strong> • Single-Admin Protected
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
            Admin Setup Guide
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
          <span>Admin Access & Users ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products & Pricing ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'discounts'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Discounts & Promo Codes</span>
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
          <span>Admin & Setup Guide</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-brand-cyan">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Total Users</span>
                <Users className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="text-3xl font-black text-text-primary">1,482</div>
              <p className="text-[11px] text-status-success">+28 today</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-[#E2136E]">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Total bKash Sales</span>
                <CreditCard className="w-4 h-4 text-[#E2136E]" />
              </div>
              <div className="text-3xl font-black text-[#E2136E]">৳148,500</div>
              <p className="text-[11px] text-text-muted">BDT Revenue</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-brand-blue">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">AI Cutouts Created</span>
                <Zap className="w-4 h-4 text-brand-blue" />
              </div>
              <div className="text-3xl font-black text-text-primary">19,430</div>
              <p className="text-[11px] text-brand-cyan">99.8% Neural Accuracy</p>
            </Card>

            <Card variant="default" className="p-6 space-y-2 border-l-4 border-l-status-success">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span className="uppercase font-bold tracking-wider">Approved Admins</span>
                <UserCheck className="w-4 h-4 text-status-success" />
              </div>
              <div className="text-3xl font-black text-status-success">
                {usersList.filter((u) => u.role === 'admin').length}
              </div>
              <p className="text-[11px] text-text-muted">Strict Master Control</p>
            </Card>
          </div>
        </div>
      )}

      {/* Users & Admin Approval Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">Admin Access & User Approvals</h3>
              <p className="text-xs text-text-muted">
                Only approved emails can access this Admin Panel. Click &quot;Make Admin&quot; to authorize an account.
              </p>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search email..."
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
                    <th className="py-3.5 px-4 sm:px-6">Account</th>
                    <th className="py-3.5 px-4 sm:px-6">Status / Role</th>
                    <th className="py-3.5 px-4 sm:px-6">Credits Balance</th>
                    <th className="py-3.5 px-4 sm:px-6">Joined Date</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Admin Authorization</th>
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
                          <Badge variant="gradient" size="sm">
                            <ShieldAlert className="w-3 h-3 mr-1 text-brand-pink" />
                            Approved Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">Standard User</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-bold text-brand-cyan">{u.purchasedCredits}</span>
                        <span className="text-text-muted text-[11px] ml-1.5">(+{u.freeCredits} free)</span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-text-muted">{u.createdAt}</td>
                      <td className="py-4 px-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddCredits(u.id, 50)}
                          className="text-brand-cyan hover:bg-brand-cyan/10"
                        >
                          +50 Cr
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeductCredits(u.id, 50)}
                          className="text-status-warning hover:bg-status-warning/10"
                        >
                          -50 Cr
                        </Button>
                        <Button
                          variant={u.role === 'admin' ? 'outline' : 'gradient'}
                          size="sm"
                          onClick={() => handleToggleAdminRole(u.id)}
                        >
                          {u.role === 'admin' ? 'Revoke Admin' : 'Approve Admin'}
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

      {/* Products & Pricing Manager Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">Products &amp; Credit Packs Catalog</h3>
              <p className="text-xs text-text-muted">
                Add new credit packages, update prices in BDT, or configure agency tiers.
              </p>
            </div>

            <Button
              variant="gradient"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddingProduct(true)}
            >
              Add New Product / Pack
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsList.map((p) => (
              <Card key={p.id} variant="default" className="p-5 space-y-4 border-border-subtle relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="gradient" size="sm">{p.tag}</Badge>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-text-muted hover:text-status-error p-1 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-base font-bold text-text-primary">{p.name}</h4>
                  <div className="text-2xl font-black text-brand-cyan">৳{p.priceBdt} <span className="text-xs text-text-muted">BDT</span></div>
                  <p className="text-xs text-text-secondary">{p.credits} Full HD Removal Credits</p>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-status-success font-semibold">Active in bKash</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const newPrice = prompt(`Enter new BDT price for ${p.name}:`, p.priceBdt.toString());
                      if (newPrice && !isNaN(Number(newPrice))) {
                        setProductsList((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, priceBdt: Number(newPrice) } : item))
                        );
                        addToast({
                          title: 'Price Updated',
                          description: `${p.name} price changed to ৳${newPrice} BDT.`,
                          type: 'success',
                        });
                      }
                    }}
                  >
                    Edit Price
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Add Product Modal */}
          {isAddingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
              <Card variant="elevated" className="w-full max-w-md p-6 space-y-5 border-border shadow-2xl">
                <h3 className="text-lg font-bold text-text-primary">Add New Product / Credit Pack</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <Input
                    label="Product Name"
                    placeholder="e.g. Photography Studio 500 Pack"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    required
                  />
                  <Input
                    label="Price (BDT)"
                    type="number"
                    placeholder="e.g. 999"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                  />
                  <Input
                    label="Credits Included"
                    type="number"
                    placeholder="e.g. 500"
                    value={newProdCredits}
                    onChange={(e) => setNewProdCredits(e.target.value)}
                    required
                  />
                  <Input
                    label="Badge / Tag"
                    placeholder="e.g. Best Seller, Limited Offer"
                    value={newProdTag}
                    onChange={(e) => setNewProdTag(e.target.value)}
                  />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" size="md" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                    <Button variant="gradient" size="md" type="submit">Save Product</Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Discounts & Promo Codes Tab */}
      {activeTab === 'discounts' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Global Platform Flash Sale Switch */}
          <Card variant="default" className="p-6 sm:p-8 space-y-4 border-brand-pink/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-pink" />
                  <h3 className="text-lg font-bold text-text-primary">Platform-Wide Flash Discount</h3>
                </div>
                <p className="text-xs text-text-muted">
                  Automatically applies a global percentage discount to all bKash checkout plans across the entire site.
                </p>
              </div>

              <Button
                variant={isGlobalSaleActive ? 'gradient' : 'outline'}
                size="md"
                onClick={() => {
                  setIsGlobalSaleActive(!isGlobalSaleActive);
                  addToast({
                    title: isGlobalSaleActive ? 'Flash Sale Disabled' : 'Flash Sale Activated!',
                    description: isGlobalSaleActive ? 'Standard prices restored.' : `Global ${globalDiscountPct}% discount active site-wide!`,
                    type: isGlobalSaleActive ? 'info' : 'success',
                  });
                }}
              >
                {isGlobalSaleActive ? `Active (${globalDiscountPct}% OFF)` : 'Activate Flash Sale'}
              </Button>
            </div>

            {isGlobalSaleActive && (
              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="text-text-secondary font-semibold">Discount Percentage:</span>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={globalDiscountPct}
                  onChange={(e) => setGlobalDiscountPct(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-card-elevated border border-border text-center font-bold text-brand-pink"
                />
                <span className="text-brand-cyan font-semibold">% OFF applied automatically on Pricing Page!</span>
              </div>
            )}
          </Card>

          {/* Promo Codes List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-primary">Active Promo Codes</h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddingPromo(true)}
              >
                Create Promo Code
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {promosList.map((pr) => (
                <Card key={pr.id} variant="default" className="p-5 space-y-3 border-border-subtle flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-brand-cyan tracking-wider">{pr.code}</span>
                      <Badge variant="success" size="sm">{pr.discountPercent}% OFF</Badge>
                    </div>
                    <p className="text-xs text-text-muted">{pr.usesRemaining} uses remaining</p>
                  </div>
                  <button
                    onClick={() => {
                      setPromosList((prev) => prev.filter((p) => p.id !== pr.id));
                      addToast({ title: 'Promo Code Removed', description: `${pr.code} deactivated.`, type: 'info' });
                    }}
                    className="text-text-muted hover:text-status-error p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Promo Modal */}
          {isAddingPromo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
              <Card variant="elevated" className="w-full max-w-md p-6 space-y-5 border-border shadow-2xl">
                <h3 className="text-lg font-bold text-text-primary">Create New Promo Code</h3>
                <form onSubmit={handleCreatePromo} className="space-y-4">
                  <Input
                    label="Promo Code (e.g. EID2026)"
                    placeholder="SUMMER50"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    required
                  />
                  <Input
                    label="Discount Percentage (%)"
                    type="number"
                    min="5"
                    max="90"
                    placeholder="20"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    required
                  />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" size="md" onClick={() => setIsAddingPromo(false)}>Cancel</Button>
                    <Button variant="gradient" size="md" type="submit">Activate Code</Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Admin Setup Guide Tab */}
      {activeTab === 'guide' && (
        <div className="space-y-8 animate-in fade-in-50 max-w-4xl">
          <Card variant="default" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-cyan">
              <Lock className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-primary">1. Single Master Admin Architecture</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <p>
                By default, only your authorized master account has access to the Admin Panel. No external user can access or view admin controls unless you explicitly click <strong>&quot;Approve Admin&quot;</strong> on their email in the <strong>Admin Access & Users</strong> tab.
              </p>
            </div>
          </Card>

          <Card variant="default" className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-pink">
              <Tag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-primary">2. Managing Discounts &amp; New Products</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <p>
                - <strong>Edit Prices:</strong> Click &quot;Edit Price&quot; in the Products tab to change the BDT price of any plan instantly.
                <br />
                - <strong>Add Products:</strong> Click &quot;Add New Product&quot; to create agency packs or customized credit tiers.
                <br />
                - <strong>Flash Sales:</strong> Toggle &quot;Activate Flash Sale&quot; in the Discounts tab to apply an instant percentage discount site-wide.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
