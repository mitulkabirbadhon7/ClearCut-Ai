import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Shield, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

interface UploadHeroProps {
  onImageSelected?: (file: File) => void;
}

export const UploadHero: React.FC<UploadHeroProps> = ({ onImageSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useAppStore();

  const handleValidateAndSetFile = (file: File) => {
    setError(null);

    // 1. File Type Validation (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      const err = 'Unsupported format. Please upload a JPG, PNG, or WEBP file.';
      setError(err);
      addToast({ title: 'Invalid File Format', description: err, type: 'error' });
      return;
    }

    // 2. File Size Validation (Max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const err = 'File too large. Maximum supported image size is 10 MB.';
      setError(err);
      addToast({ title: 'File Size Exceeded', description: err, type: 'error' });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    addToast({
      title: 'Image Ready',
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) loaded.`,
      type: 'success',
    });

    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSetFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="upload-section" className="w-full max-w-3xl mx-auto scroll-mt-24">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-brand-cyan bg-card-elevated shadow-2xl shadow-brand-cyan/20 scale-[1.01]'
            : 'border-border-subtle bg-card hover:border-brand-blue/40 shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {!selectedFile ? (
          /* Empty Upload State */
          <div className="flex flex-col items-center space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 via-brand-blue/20 to-brand-pink/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-lg shadow-brand-blue/10">
              <UploadCloud className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Drag & drop your image here
              </h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Or click browse to select a file from your computer or smartphone
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<ImageIcon className="w-5 h-5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>

            {/* Supported formats & Security guarantee */}
            <div className="pt-6 border-t border-border-subtle/80 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
              <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                <FileCheck className="w-4 h-4 text-brand-cyan" />
                <span>JPG, PNG, WEBP up to 10MB</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                <Shield className="w-4 h-4 text-status-success" />
                <span>Auto-deleted after 24 hours</span>
              </span>
            </div>
          </div>
        ) : (
          /* Loaded Image Preview State */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative max-w-md mx-auto aspect-video rounded-2xl overflow-hidden bg-card-elevated border border-border-subtle shadow-lg">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Uploaded source preview"
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-text-primary">{selectedFile.name}</h4>
              <p className="text-xs text-text-muted">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI segmentation
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5" />}
                onClick={() => {
                  addToast({
                    title: 'Processing Workflow',
                    description: 'Connecting to n8n AI engine (Configured in Phase 7)...',
                    type: 'info',
                  });
                }}
              >
                Remove Background Now
              </Button>
              <Button variant="secondary" size="lg" onClick={handleReset}>
                Select Another File
              </Button>
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
