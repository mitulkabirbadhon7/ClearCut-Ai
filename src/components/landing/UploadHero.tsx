import React from 'react';
import { CutoutStudio } from '@/components/studio/CutoutStudio';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

interface UploadHeroProps {
  onNavigate?: (route: string) => void;
}

export const UploadHero: React.FC<UploadHeroProps> = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/15 via-brand-cyan/10 to-brand-pink/15 blur-[120px] pointer-events-none -z-10 rounded-full" />

      {/* Main Headline & Badge */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="gradient" size="md" className="shadow-lg shadow-brand-blue/10">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>AI Background Remover 2.0</span>
          </Badge>
          <Badge variant="outline" size="md">
            <span>5 Free Daily Credits</span>
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-[1.1]">
          Remove Backgrounds in <span className="text-gradient">One Click</span>
        </h1>

        <p className="text-text-secondary text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Upload any photo, e-commerce product, or portrait. Get a clean, transparent PNG cutout with crisp edges in under 2 seconds.
        </p>
      </div>

      {/* Interactive Studio Workspace */}
      <div className="relative z-10">
        <CutoutStudio />
      </div>

      {/* Trust & Policy Micro-features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle max-w-3xl mx-auto text-xs text-text-secondary">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Zap className="w-4 h-4 text-brand-cyan" />
          <span>Sub-2s Neural AI Processing</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-status-success" />
          <span>24-Hour Ephemeral Privacy</span>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Layers className="w-4 h-4 text-brand-pink" />
          <span>Full HD PNG Alpha Export</span>
        </div>
      </div>
    </div>
  );
};
