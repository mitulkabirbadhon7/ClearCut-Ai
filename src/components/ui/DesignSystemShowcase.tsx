import React, { useState } from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Input } from './Input';
import { Skeleton } from './Skeleton';
import { useAppStore } from '@/store/useAppStore';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Layers,
  Palette,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { addToast } = useAppStore();

  const handleTestToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const titles = {
      success: 'Credits Added Successfully',
      error: 'Upload Failed: File Exceeds 10MB',
      warning: 'Daily Free Limit: 1 Image Remaining',
      info: 'bKash Gateway Connected',
    };
    const descriptions = {
      success: '100 HD Background Removal credits added to your wallet.',
      error: 'Please compress your image or select another file under 10MB.',
      warning: 'Top up your credits or wait until 12:00 AM for daily reset.',
      info: 'Ready to process checkout requests in Bangladeshi Taka (BDT).',
    };

    addToast({
      title: titles[type],
      description: descriptions[type],
      type,
    });
  };

  const colors = [
    { name: 'Dark Background', hex: '#020617', bg: 'bg-[#020617]', border: 'border-slate-800' },
    { name: 'Card Surface', hex: '#0F172A', bg: 'bg-[#0F172A]', border: 'border-slate-700' },
    { name: 'Elevated Card', hex: '#172033', bg: 'bg-[#172033]', border: 'border-slate-600' },
    { name: 'Brand Cyan', hex: '#22D3EE', bg: 'bg-[#22D3EE]', text: 'text-black' },
    { name: 'Brand Blue', hex: '#2563EB', bg: 'bg-[#2563EB]', text: 'text-white' },
    { name: 'Brand Purple', hex: '#7C3AED', bg: 'bg-[#7C3AED]', text: 'text-white' },
    { name: 'Brand Pink', hex: '#D946EF', bg: 'bg-[#D946EF]', text: 'text-white' },
    { name: 'Success Green', hex: '#22C55E', bg: 'bg-[#22C55E]', text: 'text-black' },
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs font-semibold text-brand-cyan">
          <Palette className="w-3.5 h-3.5" />
          <span>Design System & UI Component Foundation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          SnapCut AI <span className="text-gradient">Design System</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Curated dark-mode aesthetic, WCAG-accessible components, precision typography, and responsive primitives built with Tailwind CSS.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Palette className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-xl font-bold text-text-primary">1. Curated Brand Color System</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-card border border-border-subtle space-y-3 shadow-lg hover:border-brand-blue/30 transition-colors"
            >
              <div className={`h-16 w-full rounded-lg ${c.bg} ${c.border || ''} border flex items-end p-2`}>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs`}>
                  {c.hex}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-text-primary">{c.name}</div>
                <div className="text-[11px] text-text-muted font-mono">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Buttons */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Zap className="w-5 h-5 text-brand-blue" />
          <h2 className="text-xl font-bold text-text-primary">2. Button Components & States</h2>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border-subtle space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="gradient" leftIcon={<Sparkles className="w-4 h-4" />}>
              Primary CTA (Gradient)
            </Button>
            <Button variant="primary" leftIcon={<CreditCard className="w-4 h-4" />}>
              Primary Blue
            </Button>
            <Button variant="secondary">Secondary Card</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost Link</Button>
            <Button variant="danger">Danger Action</Button>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-4 items-center">
            <Button size="sm" variant="gradient">
              Small Button
            </Button>
            <Button size="md" variant="gradient">
              Medium (Default)
            </Button>
            <Button size="lg" variant="gradient" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Large Hero Action
            </Button>
            <Button
              variant="outline"
              isLoading={buttonLoading}
              onClick={() => {
                setButtonLoading(true);
                setTimeout(() => setButtonLoading(false), 2000);
              }}
            >
              Click to Test Spinner
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Badges & Status Pills */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <ShieldCheck className="w-5 h-5 text-brand-purple" />
          <h2 className="text-xl font-bold text-text-primary">3. Badges & Status Indicators</h2>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border-subtle flex flex-wrap gap-3 items-center">
          <Badge variant="gradient" dot>
            AI Processing Active
          </Badge>
          <Badge variant="success" dot>
            Completed (200 OK)
          </Badge>
          <Badge variant="warning" dot>
            Low Credits (1 Left)
          </Badge>
          <Badge variant="error" dot>
            Expired (24h Lapsed)
          </Badge>
          <Badge variant="info">bKash Gateway BDT</Badge>
          <Badge variant="default">Default Neutral</Badge>
          <Badge variant="outline">Transparent Outline</Badge>
        </div>
      </section>

      {/* 4. Card Hierarchy */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Layers className="w-5 h-5 text-brand-pink" />
          <h2 className="text-xl font-bold text-text-primary">4. Card Architecture</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Base Card</CardTitle>
              <CardDescription>Standard card surface with subtle border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">Used for list items, details panels, and standard layout wrappers.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Higher visual depth and hover enhancement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">Used for interactive widgets, stats cards, and selectable tiers.</p>
            </CardContent>
          </Card>

          <Card variant="glow">
            <CardHeader>
              <CardTitle>Gradient Glow Card</CardTitle>
              <CardDescription>Featured tier or prominent CTA callout</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">Emphasizes active Pro plan, popular pricing packages, and hero uploads.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="gradient" className="w-full">
                Featured Action
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 5. Interactive Modals & Toasts */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Sparkles className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-xl font-bold text-text-primary">5. Feedback Components (Modals & Toasts)</h2>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border-subtle space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />} onClick={() => setDemoModalOpen(true)}>
              Open Accessible Modal Dialog
            </Button>
            <Button variant="secondary" onClick={() => handleTestToast('success')}>
              Trigger Success Toast
            </Button>
            <Button variant="secondary" onClick={() => handleTestToast('error')}>
              Trigger Error Toast
            </Button>
            <Button variant="secondary" onClick={() => handleTestToast('warning')}>
              Trigger Warning Toast
            </Button>
            <Button variant="secondary" onClick={() => handleTestToast('info')}>
              Trigger Info Toast
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Form Inputs & Skeletons */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Mail className="w-5 h-5 text-brand-blue" />
          <h2 className="text-xl font-bold text-text-primary">6. Form Elements & Skeleton Loaders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border-subtle space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Form Input Primitives</h3>
            <Input label="Email Address" placeholder="name@example.com" leftIcon={<Mail className="w-4 h-4" />} />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error="Password must be at least 8 characters"
            />
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border-subtle space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Skeleton Loader States</h3>
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" rounded="xl" />
          </div>
        </div>
      </section>

      {/* 7. Alpha Transparency Checkerboard */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <CheckCircle2 className="w-5 h-5 text-status-success" />
          <h2 className="text-xl font-bold text-text-primary">7. Alpha Transparency Canvas Engine</h2>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border-subtle">
          <div className="h-32 rounded-xl bg-checkerboard flex items-center justify-center border border-border-subtle relative overflow-hidden">
            <div className="p-3 rounded-xl bg-card/90 border border-border-subtle backdrop-blur-md flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-status-success animate-ping" />
              <span className="text-xs font-semibold text-text-primary">
                Transparent PNG Alpha Canvas (High Contrast)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal Dialog */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="SnapCut AI Modal Component"
        description="Accessible dialog with keyboard ESC listener, backdrop blur, and smooth entrance."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-secondary leading-relaxed">
            This modal primitive handles user confirmations, authentication popups, credit package selection, and image preview dialogs seamlessly.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-border-subtle">
            <Button variant="ghost" size="sm" onClick={() => setDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => {
                setDemoModalOpen(false);
                handleTestToast('success');
              }}
            >
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
