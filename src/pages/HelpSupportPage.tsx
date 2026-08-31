import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  CreditCard,
  Zap,
  Code,
  ShieldAlert,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  LifeBuoy,
  FileQuestion,
} from 'lucide-react';

interface HelpSupportPageProps {
  onNavigate?: (route: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'billing' | 'technical' | 'api';
}

const FAQS: FAQItem[] = [
  {
    category: 'general',
    question: 'How does ClearCut AI remove backgrounds so cleanly?',
    answer:
      'ClearCut AI employs state-of-the-art neural networks (RMBG-1.4 / BiRefNet) trained specifically on complex edge boundaries such as flyaway hair, translucent fabrics, jewelry, and intricate product contours, generating studio-grade transparent PNGs with alpha matting.',
  },
  {
    category: 'general',
    question: 'How do daily free credits work?',
    answer:
      'Every registered user automatically receives 5 free high-resolution background removal credits every day. Unused daily credits reset at 12:00 AM UTC and do not roll over.',
  },
  {
    category: 'billing',
    question: 'How do I top-up credits using bKash in Bangladesh?',
    answer:
      'Navigate to the Pricing page, select your preferred credit pack (e.g. Starter 50 Credits, Pro 250 Credits, or Ultra 1,000 Credits), and click "Pay with bKash". Complete the secure payment via the official bKash checkout gateway, and credits will be added to your account instantly.',
  },
  {
    category: 'billing',
    question: 'Do purchased credit packs expire?',
    answer:
      'No! All credit packs purchased via bKash or online checkout have lifetime validity and never expire. They are consumed only after your free daily credits are used.',
  },
  {
    category: 'technical',
    question: 'What image formats and resolutions are supported?',
    answer:
      'We support JPEG, PNG, WEBP, and HEIC files up to 25MB and up to 4K resolution (4096 x 4096 px). All outputs are exported as full-resolution 32-bit PNG with transparency.',
  },
  {
    category: 'technical',
    question: 'How long are uploaded and processed images kept on the server?',
    answer:
      'We operate on a zero-retention ephemeral policy. Uploaded and cutout images are stored temporarily for 24 hours to allow you to download them, after which they are permanently and irreversibly purged from our servers.',
  },
  {
    category: 'api',
    question: 'How do I get an API Key for automated background removal?',
    answer:
      'Log in to your account, visit the Developer API page or User Dashboard, and generate an API Secret Key. You can integrate our REST API into Python, Node.js, cURL, or PHP scripts with straightforward HTTP multipart requests.',
  },
  {
    category: 'api',
    question: 'What is the rate limit for the ClearCut REST API?',
    answer:
      'Standard tier accounts can make up to 60 requests per minute. For high-volume automated e-commerce workflows or custom enterprise concurrency, contact our developer support.',
  },
];

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => (onNavigate ? onNavigate('home') : null)}
        >
          Back to Home
        </Button>
      </div>

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="gradient" size="md">
          Help & Support Center
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          How can we <span className="text-gradient">help you</span> today?
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Find instant answers to common questions about background removal, bKash payments, API keys, and account management.
        </p>

        {/* Live Search Box */}
        <div className="relative max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search topics (e.g., bKash, credits, API, image formats)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card-elevated border border-border-subtle hover:border-brand-blue/50 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Action Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          variant="elevated"
          className="p-5 hover:border-brand-cyan/40 transition-all cursor-pointer group"
          onClick={() => setSelectedCategory('general')}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-text-primary">Getting Started</h3>
          <p className="text-xs text-text-muted mt-1">Free credits, AI cutouts, and image resolution guides.</p>
        </Card>

        <Card
          variant="elevated"
          className="p-5 hover:border-brand-pink/40 transition-all cursor-pointer group"
          onClick={() => setSelectedCategory('billing')}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink mb-3 group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-text-primary">bKash & Billing</h3>
          <p className="text-xs text-text-muted mt-1">Purchasing credits, merchant gateway, and invoice support.</p>
        </Card>

        <Card
          variant="elevated"
          className="p-5 hover:border-brand-blue/40 transition-all cursor-pointer group"
          onClick={() => setSelectedCategory('technical')}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mb-3 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-text-primary">Privacy & Storage</h3>
          <p className="text-xs text-text-muted mt-1">24h auto-delete policy, data encryption, and account security.</p>
        </Card>

        <Card
          variant="elevated"
          className="p-5 hover:border-purple-500/40 transition-all cursor-pointer group"
          onClick={() => setSelectedCategory('api')}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-text-primary">Developer API</h3>
          <p className="text-xs text-text-muted mt-1">REST endpoints, SDKs, token authentication, and limits.</p>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-border-subtle pb-4">
        {[
          { id: 'all', label: 'All Topics' },
          { id: 'general', label: 'General & Features' },
          { id: 'billing', label: 'bKash & Pricing' },
          { id: 'technical', label: 'Image Processing & Privacy' },
          { id: 'api', label: 'Developer API' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === tab.id
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                : 'bg-card-elevated text-text-secondary hover:text-text-primary hover:bg-card-hover border border-border-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-brand-cyan" />
          Frequently Asked Questions
        </h2>

        {filteredFaqs.length === 0 ? (
          <Card variant="default" className="p-8 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-text-primary">No results found for &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-text-muted">
              Try searching with different keywords or contact our support team directly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border-subtle bg-card-elevated/70 overflow-hidden transition-all duration-200 hover:border-border"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm text-text-primary">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-cyan' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help? Contact / Live Ticket Support Callout */}
      <Card variant="elevated" className="p-8 sm:p-10 border-brand-blue/30 bg-gradient-to-br from-card-elevated via-card to-brand-blue/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-semibold text-brand-cyan">
              <LifeBuoy className="w-3.5 h-3.5" />
              Direct Human Support
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
              Couldn&apos;t find what you are looking for?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted">
              Our engineering and bKash merchant billing support team is available 24/7. Send us a message and we will respond within 2-4 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="gradient"
              size="lg"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => (onNavigate ? onNavigate('contact') : null)}
            >
              Contact Support Team
            </Button>
            <a
              href="mailto:mitulkabirbadhon7@gmail.com?subject=ClearCut%20AI%20Help%20Request"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-card hover:bg-card-hover border border-border-subtle text-xs font-bold text-text-primary transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-cyan" />
              Direct Email
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
