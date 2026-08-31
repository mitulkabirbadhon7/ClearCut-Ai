import React from 'react';
import { UploadDropzone } from './UploadDropzone';
import { ProcessingView } from './ProcessingView';
import { useProcessingStore } from '@/store/useProcessingStore';
import { Button } from '@/components/ui/Button';
import { Sparkles, Download, RotateCcw, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const CutoutStudio: React.FC = () => {
  const { status, previewUrl, processedUrl, resetStudio, setSampleImage } = useProcessingStore();
  const { addToast } = useAppStore();

  const sampleImages = [
    {
      label: 'Portrait Photo',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'E-commerce Shoe',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Fashion Model',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleDownload = () => {
    if (!processedUrl && !previewUrl) return;
    const downloadUrl = processedUrl || previewUrl;
    const a = document.createElement('a');
    a.href = downloadUrl!;
    a.download = `clearcut_cutout_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    addToast({
      title: 'Download Started',
      description: 'Your high-resolution transparent PNG is downloading.',
      type: 'success',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {status === 'processing' ? (
        <ProcessingView />
      ) : status === 'completed' || (status === 'idle' && processedUrl) ? (
        /* Completed Result View */
        <div className="rounded-2xl border border-brand-cyan/40 bg-card-elevated p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-status-success font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Background Successfully Removed!</span>
            </div>
            <Button variant="ghost" size="sm" onClick={resetStudio} leftIcon={<RotateCcw className="w-4 h-4" />}>
              New Image
            </Button>
          </div>

          {/* High-contrast transparent checkerboard view */}
          <div className="w-full h-80 sm:h-96 rounded-xl bg-checkerboard border border-border-subtle flex items-center justify-center relative overflow-hidden">
            <img
              src={processedUrl || previewUrl!}
              alt="Background removed result"
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-cyan" />
              <span>Full HD PNG • Transparent Alpha Channel</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="ghost" size="md" onClick={resetStudio} className="flex-1 sm:flex-none">
                Start Over
              </Button>
              <Button
                variant="gradient"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownload}
                className="flex-1 sm:flex-none shadow-xl shadow-brand-blue/20"
              >
                Download Transparent PNG
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Default Upload & Dropzone View */
        <div className="space-y-4">
          <UploadDropzone />

          {/* 1-Click Try Samples */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-text-muted">
            <span className="font-semibold text-text-secondary">No image ready? Try one of these:</span>
            {sampleImages.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setSampleImage(sample.url, sample.label)}
                className="px-2.5 py-1 rounded-lg bg-card-elevated hover:bg-card-hover border border-border-subtle hover:border-brand-blue/40 text-text-primary transition-all font-medium hover:text-brand-cyan"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
