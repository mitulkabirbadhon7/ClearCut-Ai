import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onNavigate?: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
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
        <Badge variant="gradient">Our Mission</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          About <span className="text-gradient">ClearCut AI</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Democratizing professional AI image segmentation for e-commerce entrepreneurs, freelancers, and businesses in Bangladesh and worldwide.
        </p>
      </div>

      <Card variant="default" className="p-8 sm:p-10 space-y-6 text-sm text-text-secondary leading-relaxed">
        <p>
          Founded with a clear purpose, ClearCut AI removes the friction of complex desktop photo editing software. By combining high-speed neural networks with the native bKash payment infrastructure, we provide Bangladeshi creators and businesses with an instant, affordable, and world-class background removal solution.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-brand-cyan">1.5s</div>
            <div className="text-xs text-text-muted">Average Removal Speed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-brand-pink">24h</div>
            <div className="text-xs text-text-muted">Ephemeral Auto-Purge</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-status-success">100%</div>
            <div className="text-xs text-text-muted">bKash Native BDT Checkout</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
