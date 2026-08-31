import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Zap,
  Shield,
  Code2,
  ArrowLeft,
  Sliders,
  Maximize2,
  Clock,
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate?: (route: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
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

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="gradient">Cutting-Edge Features</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Everything You Need for <span className="text-gradient">Flawless Image Cutouts</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Engineered for e-commerce sellers, marketing teams, photographers, and developers who demand fast, pristine results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Zap,
            title: 'Sub-2-Second Neural Processing',
            desc: 'Our optimized computer vision architecture extracts subjects rapidly, ensuring you never wait on slow manual photo editors.',
          },
          {
            icon: Maximize2,
            title: '5000 × 5000px High-Res Support',
            desc: 'Maintain original image fidelity for high-resolution studio prints, billboard banners, and premium e-commerce catalogs.',
          },
          {
            icon: Sliders,
            title: 'Fine Edge & Hair Strand Precision',
            desc: 'Specialized alpha-channel edge feathering ensures fine hair strands, transparent glass, and complex fur textures remain crisp.',
          },
          {
            icon: Shield,
            title: '24-Hour Ephemeral Lifecycle',
            desc: 'Automatic data purge guarantees zero permanent retention of confidential product prototypes or customer portrait photos.',
          },
          {
            icon: Code2,
            title: 'Developer REST API & SDKs',
            desc: 'Easily plug background removal into your automated e-commerce workflows with standard JSON payloads and API key auth.',
          },
          {
            icon: Clock,
            title: 'Official bKash Payment Flow',
            desc: 'Direct checkout in Bangladeshi Taka (BDT) with automated instant credit crediting and zero foreign currency surcharges.',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} variant="elevated" className="p-8 space-y-4 hover:border-brand-cyan/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-card border border-border-subtle flex items-center justify-center text-brand-cyan shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
