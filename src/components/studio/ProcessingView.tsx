import React from 'react';
import { Sparkles, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProcessingStore } from '@/store/useProcessingStore';

export const ProcessingView: React.FC = () => {
  const { previewUrl, processingProgress, processingStep, cancelOperation } = useProcessingStore();

  return (
    <div className="rounded-2xl border border-brand-blue/30 bg-card-elevated p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
            AI Segmentation in Progress
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={cancelOperation} leftIcon={<X className="w-4 h-4" />}>
          Cancel
        </Button>
      </div>

      {/* Image with Neural Scanning Beam Effect */}
      <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden bg-black/60 border border-border-subtle flex items-center justify-center">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Processing foreground"
            className="max-h-full max-w-full object-contain filter brightness-90"
          />
        )}

        {/* Animated Laser Scanning Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_15px_#22D3EE] animate-scan" />

        {/* Floating AI status chip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-blue/40 flex items-center gap-2 shadow-2xl">
          <Sparkles className="w-4 h-4 text-brand-cyan animate-spin" />
          <span className="text-xs font-semibold text-text-primary">{processingStep || 'Isolating Foreground Subject...'}</span>
        </div>
      </div>

      {/* Processing Progress Bar */}
      <div className="space-y-2 max-w-lg mx-auto">
        <div className="w-full h-2.5 rounded-full bg-border-subtle overflow-hidden">
          <div
            className="h-full bg-brand-gradient transition-all duration-300 rounded-full"
            style={{ width: `${processingProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted">
          <span>Removing Background Artifacts</span>
          <span className="font-mono text-brand-cyan font-bold">{processingProgress}%</span>
        </div>
      </div>

      <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
        <span>Strict 24-hour ephemeral lifecycle guarantee active</span>
      </div>
    </div>
  );
};
