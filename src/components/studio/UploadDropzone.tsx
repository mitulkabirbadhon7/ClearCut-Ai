import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileType, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useProcessingStore } from '@/store/useProcessingStore';
import { useAppStore } from '@/store/useAppStore';

interface UploadDropzoneProps {
  onFileReady?: () => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileReady }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    file,
    previewUrl,
    status,
    uploadProgress,
    error,
    setFile,
    cancelOperation,
    resetStudio,
    dismissError,
    startUploadAndProcess,
  } = useProcessingStore();
  const { addToast } = useAppStore();

  // Listen to Ctrl+V (Clipboard paste) anywhere on the page
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            const ok = await setFile(pastedFile);
            if (ok && onFileReady) {
              onFileReady();
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [setFile, onFileReady]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const ok = await setFile(selectedFiles[0]);
      if (ok && onFileReady) {
        onFileReady();
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessClick = async () => {
    try {
      await startUploadAndProcess();
    } catch {
      addToast({
        title: 'Upload Error',
        description: 'Failed to process image. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Active File Preview Card */}
      {file && previewUrl && status !== 'uploading' && status !== 'processing' && status !== 'completed' ? (
        <div className="relative rounded-2xl border border-border bg-card-elevated p-6 space-y-5 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5 text-brand-cyan" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-text-primary truncate">{file.name}</h4>
                <p className="text-xs text-text-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.toUpperCase().replace('IMAGE/', '')}
                </p>
              </div>
            </div>
            <button
              onClick={resetStudio}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
              title="Remove image"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Thumbnail Preview */}
          <div className="w-full h-64 rounded-xl overflow-hidden bg-black/40 border border-border-subtle flex items-center justify-center relative">
            <img src={previewUrl} alt="Selected preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-text-secondary border border-white/10">
              Original Ready
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="gradient"
              size="lg"
              className="flex-1 justify-center shadow-xl shadow-brand-blue/20"
              onClick={handleProcessClick}
            >
              Remove Background Now (1 Credit)
            </Button>
            <Button variant="ghost" size="lg" onClick={resetStudio}>
              Choose Another Image
            </Button>
          </div>
        </div>
      ) : status === 'uploading' ? (
        /* Live Upload Progress Screen */
        <div className="rounded-2xl border border-brand-blue/40 bg-card-elevated p-8 space-y-6 text-center animate-in fade-in-50 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 mx-auto flex items-center justify-center animate-pulse">
            <UploadCloud className="w-8 h-8 text-brand-cyan" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-text-primary">Uploading Image to Secure Cloud</h4>
            <p className="text-xs text-text-secondary">
              Encrypting & transferring photo to ephemeral processing node...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="w-full h-3 rounded-full bg-border-subtle overflow-hidden relative">
              <div
                className="h-full bg-brand-gradient transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-text-muted">
              <span>{uploadProgress < 100 ? 'Uploading...' : 'Ready for Segmentation'}</span>
              <span className="text-brand-cyan font-bold">{uploadProgress}%</span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={cancelOperation} className="text-text-muted hover:text-status-error">
            Cancel Upload
          </Button>
        </div>
      ) : (
        /* Empty Dropzone Card */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 ${
            isDragOver
              ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.01] shadow-2xl shadow-brand-cyan/10'
              : 'border-border-subtle hover:border-brand-blue/60 bg-card hover:bg-card-elevated'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Floating Icon with Glow */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-blue/20 via-brand-cyan/10 to-brand-pink/20 border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-brand-cyan group-hover:text-brand-pink transition-colors" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-lg sm:text-xl font-extrabold text-text-primary">
              Drop your image here, or <span className="text-brand-cyan underline">browse</span>
            </h3>
            <p className="text-xs sm:text-sm text-text-muted">
              Supports <span className="font-semibold text-text-secondary">JPG, PNG, WEBP</span> up to 10 MB.
            </p>
          </div>

          {/* Clipboard Paste Hint */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-[11px] font-medium text-text-secondary">
            <span>Or paste an image from clipboard</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-border-subtle text-[10px] font-mono text-brand-cyan">
              Ctrl + V
            </kbd>
          </div>

          {/* Format Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Badge variant="outline" size="sm" className="gap-1">
              <FileType className="w-3 h-3 text-brand-cyan" />
              <span>JPG / JPEG</span>
            </Badge>
            <Badge variant="outline" size="sm" className="gap-1">
              <FileType className="w-3 h-3 text-brand-cyan" />
              <span>PNG Transparent</span>
            </Badge>
            <Badge variant="outline" size="sm" className="gap-1">
              <FileType className="w-3 h-3 text-brand-cyan" />
              <span>WEBP Modern</span>
            </Badge>
            <Badge variant="outline" size="sm" className="gap-1 text-brand-pink border-brand-pink/30">
              <CheckCircle2 className="w-3 h-3 text-brand-pink" />
              <span>Max 10MB</span>
            </Badge>
          </div>
        </div>
      )}

      {/* Validation / Upload Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center justify-between gap-3 animate-in shake duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={dismissError} className="text-status-error hover:bg-status-error/20">
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};
