import React from 'react';
import { UploadHero } from '@/components/landing/UploadHero';
import { BeforeAfterSlider } from '@/components/landing/BeforeAfterSlider';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Code2,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Palette,
  Camera,
  Users,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface LandingPageProps {
  onNavigate?: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { setActiveModal, addToast } = useAppStore();

  const handleBuyPlan = (planName: string, priceBdt: number) => {
    addToast({
      title: 'Checkout Request',
      description: `Selected ${planName} (৳${priceBdt} BDT). Redirecting to bKash Gateway...`,
      type: 'info',
    });
    if (onNavigate) {
      onNavigate('pricing');
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-cyan/15 via-brand-blue/15 to-brand-pink/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card-elevated border border-border-subtle text-xs sm:text-sm font-semibold text-brand-cyan shadow-lg">
            <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
            <span>Next-Gen AI Image Segmentation</span>
            <span className="hidden sm:inline text-text-muted">•</span>
            <span className="hidden sm:inline text-text-secondary">Official bKash Gateway Enabled</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
            Remove Image Backgrounds <br className="hidden sm:block" />
            in <span className="text-gradient">One Single Click</span>
          </h1>

          <p className="text-text-secondary text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Instant high-definition transparent PNG cutouts for e-commerce, portraits, marketing creatives, and developers. No complex tools required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="gradient"
              size="lg"
              leftIcon={<Sparkles className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                const el = document.getElementById('upload-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Remove Background Now
            </Button>
          </div>
        </div>

        {/* Upload Hero Card */}
        <div className="mt-12">
          <UploadHero />
        </div>
      </section>

      {/* 2. INTERACTIVE BEFORE / AFTER DEMO SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <Badge variant="gradient">Pixel-Level Precision</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            See the Quality in Real-Time
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            From intricate hair strands to crisp product contours, our deep learning engine detects every edge with sub-pixel accuracy.
          </p>
        </div>

        <BeforeAfterSlider />
      </section>

      {/* 3. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="default">Streamlined Process</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            How ClearCut AI Works
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Designed for maximum speed and simplicity. 3 steps, 2 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Upload Image',
              desc: 'Drag & drop any JPG, PNG, or WEBP photo up to 10MB into the secure upload zone.',
              icon: UploadHero,
            },
            {
              step: '02',
              title: 'One-Click AI Extraction',
              desc: 'Our AI segmentation engine isolates your foreground subject and removes background noise automatically.',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Download Transparent PNG',
              desc: 'Preview the result over our high-contrast alpha canvas and download your pristine transparent cutout.',
              icon: Sparkles,
            },
          ].map((item, idx) => (
            <Card key={idx} variant="elevated" className="relative overflow-hidden p-6 space-y-4">
              <div className="text-4xl font-black text-brand-cyan/20">{item.step}</div>
              <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gradient">Engineered for Excellence</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Why Creators & Businesses Choose ClearCut AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Lightning Fast (1.5s)',
              desc: 'Get production-ready transparent cutouts in less than 2 seconds without lagging your system.',
            },
            {
              icon: Shield,
              title: '24-Hour Ephemeral Privacy',
              desc: 'Strict automated purge policy ensures your original and processed images are deleted within 24 hours.',
            },
            {
              icon: CreditCard,
              title: 'Official bKash Payment',
              desc: 'Seamless Bangladeshi Taka (BDT) checkout for instant credit top-ups without foreign exchange fees.',
            },
            {
              icon: Layers,
              title: 'High Resolution HD Support',
              desc: 'Handles ultra high-res photography up to 5000 × 5000 pixels with flawless edge clarity.',
            },
            {
              icon: Code2,
              title: 'Developer REST API',
              desc: 'Integrate automated image background removal directly into your e-commerce platform or custom pipeline.',
            },
            {
              icon: Lock,
              title: 'Zero Account Lock-in',
              desc: 'Start with 5 free daily credits or buy flexible pay-as-you-go credit packs whenever you need.',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} variant="default" className="p-6 space-y-3 hover:border-brand-blue/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-card-elevated border border-border-subtle flex items-center justify-center text-brand-cyan">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary">{f.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. TARGET USE CASES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="default">Versatile Applications</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Built for High-Impact Workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShoppingBag,
              title: 'E-Commerce Sellers',
              desc: 'Create clean white or transparent product listings for Daraz, Shopify, Amazon, and Facebook Shops.',
            },
            {
              icon: Camera,
              title: 'Photographers & Studios',
              desc: 'Batch process portrait headshots, fashion apparel, and studio model shoots with perfect hair isolation.',
            },
            {
              icon: Palette,
              title: 'Graphic Designers',
              desc: 'Accelerate banner, poster, and YouTube thumbnail creation by skipping tedious pen-tool selections.',
            },
            {
              icon: Users,
              title: 'Marketers & Creators',
              desc: 'Design viral social media ads, Instagram stories, and promotional campaign assets in seconds.',
            },
          ].map((u, idx) => {
            const Icon = u.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card-elevated border border-border-subtle space-y-3 text-left hover:border-brand-cyan/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-card border border-border-subtle flex items-center justify-center text-brand-pink">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary">{u.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{u.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PRICING SECTION (BDT) */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gradient">Simple & Transparent</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Flexible Pricing in Bangladeshi Taka (BDT)
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Start for free. Upgrade or top up credits instantly via official bKash payment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <Card variant="default" className="flex flex-col justify-between p-8 space-y-6">
            <div className="space-y-4">
              <Badge variant="default">Free Tier</Badge>
              <div>
                <span className="text-4xl font-extrabold text-text-primary">৳0</span>
                <span className="text-xs text-text-muted ml-1">/ forever</span>
              </div>
              <p className="text-xs text-text-muted">Perfect for individuals and personal quick cutouts.</p>

              <ul className="space-y-2.5 text-xs text-text-secondary pt-4 border-t border-border-subtle">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>5 Free Images Per Day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>Standard HD Resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>24-Hour Ephemeral Storage</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setActiveModal('auth')}
            >
              Get Started Free
            </Button>
          </Card>

          {/* Plan 2: Pro Monthly (Featured Glow) */}
          <Card variant="glow" className="flex flex-col justify-between p-8 space-y-6 relative scale-105 border-brand-blue/40 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gradient">Most Popular</Badge>
                <span className="text-[11px] font-bold text-pink-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span> bKash Ready
                </span>
              </div>

              <div>
                <span className="text-4xl font-extrabold text-text-primary">৳499</span>
                <span className="text-xs text-text-muted ml-1">/ month</span>
              </div>
              <p className="text-xs text-text-muted">Designed for e-commerce sellers & active creators.</p>

              <ul className="space-y-2.5 text-xs text-text-secondary pt-4 border-t border-border-subtle">
                <li className="flex items-center gap-2 font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>300 High-Speed HD Credits/mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>Full 5000×5000 Max Resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>Priority AI Processing Queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>Developer API Access Included</span>
                </li>
              </ul>
            </div>

            <Button
              variant="gradient"
              className="w-full justify-center"
              leftIcon={<CreditCard className="w-4 h-4" />}
              onClick={() => handleBuyPlan('Pro Monthly', 499)}
            >
              Pay ৳499 with bKash
            </Button>
          </Card>

          {/* Plan 3: 100 Credit Pack */}
          <Card variant="default" className="flex flex-col justify-between p-8 space-y-6">
            <div className="space-y-4">
              <Badge variant="default">Pay-As-You-Go</Badge>
              <div>
                <span className="text-4xl font-extrabold text-text-primary">৳299</span>
                <span className="text-xs text-text-muted ml-1">/ 100 Credits</span>
              </div>
              <p className="text-xs text-text-muted">One-time credit top-up. Never expires until consumed.</p>

              <ul className="space-y-2.5 text-xs text-text-secondary pt-4 border-t border-border-subtle">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>100 HD Image Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>No Recurring Subscription</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>Instant bKash Gateway Activation</span>
                </li>
              </ul>
            </div>

            <Button
              variant="secondary"
              className="w-full justify-center"
              leftIcon={<CreditCard className="w-4 h-4 text-pink-500" />}
              onClick={() => handleBuyPlan('100 Credit Pack', 299)}
            >
              Buy 100 Credits (৳299)
            </Button>
          </Card>
        </div>
      </section>

      {/* 7. DEVELOPER REST API PREVIEW */}
      <section id="api" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="rounded-3xl bg-card border border-border-subtle p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="gradient">Developer REST API</Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Automate Background Removal in Code
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Integrate automated cutouts directly into your Node.js, Python, PHP, or Next.js app with our high-speed JSON endpoint.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Code2 className="w-4 h-4 text-brand-cyan" />}
                  onClick={() => (onNavigate ? onNavigate('api') : null)}
                >
                  View Full API Docs
                </Button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl bg-black/80 border border-border-subtle p-4 font-mono text-xs text-text-secondary overflow-x-auto shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-[11px] text-text-muted">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="ml-2 text-text-primary font-bold">POST /v1/remove-background</span>
              </div>
              <pre className="pt-3 text-brand-cyan">
                {`curl -X POST https://api.clearcut.ai/v1/remove-background \\
  -H "x-api-key: sc_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://example.com/product.jpg"}'`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="default">Common Questions</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <FaqAccordion />
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-tr from-brand-cyan/20 via-brand-blue/20 to-brand-pink/20 border border-brand-blue/30 p-10 sm:p-14 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              Ready to Clean Your Images in Seconds?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Join thousands of creators and businesses in Bangladesh and worldwide. No credit card needed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="gradient"
              size="lg"
              leftIcon={<Sparkles className="w-5 h-5" />}
              onClick={() => {
                const el = document.getElementById('upload-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Free (5 Daily Credits)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
