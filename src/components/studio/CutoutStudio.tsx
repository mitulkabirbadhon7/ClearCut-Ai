import React from 'react';
import { UploadDropzone } from './UploadDropzone';
import { ProcessingView } from './ProcessingView';
import { ResultEditor } from './ResultEditor';
import { useProcessingStore } from '@/store/useProcessingStore';

export const CutoutStudio: React.FC = () => {
  const { status, processedUrl, setSampleImage } = useProcessingStore();

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {status === 'processing' ? (
        <ProcessingView />
      ) : status === 'completed' || (status === 'idle' && processedUrl) ? (
        <ResultEditor />
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
