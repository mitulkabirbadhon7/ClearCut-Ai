import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Mail, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface ContactPageProps {
  onNavigate?: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Message Received',
        description: 'Thank you! Our support team will get back to you shortly.',
        type: 'success',
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
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

      <div className="space-y-4 text-center sm:text-left">
        <Badge variant="gradient">Customer Support</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Contact <span className="text-gradient">ClearCut AI</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Need assistance with bKash payments, enterprise API integration, or feature requests? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card variant="elevated" className="md:col-span-2 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our support team assist you today?"
                className="w-full rounded-xl bg-card-elevated border border-border-subtle p-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full justify-center"
              size="lg"
              isLoading={isLoading}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send Message
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-brand-cyan">
              <Mail className="w-5 h-5" />
              <h3 className="text-sm font-bold text-text-primary">Email Support</h3>
            </div>
            <p className="text-xs text-text-muted">Direct inquiries & support:</p>
            <a
              href="mailto:mitulkabirbadhon7@gmail.com"
              className="text-xs font-bold text-brand-cyan hover:underline break-all block"
            >
              mitulkabirbadhon7@gmail.com
            </a>
          </Card>

          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-brand-pink">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-sm font-bold text-text-primary">bKash Merchant Support</h3>
            </div>
            <p className="text-xs text-text-muted">Billing and invoice assistance within 24 hours.</p>
            <a
              href="mailto:mitulkabirbadhon7@gmail.com?subject=ClearCut%20AI%20bKash%20Billing%20Support"
              className="text-xs font-bold text-brand-pink hover:underline break-all block"
            >
              mitulkabirbadhon7@gmail.com
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};
