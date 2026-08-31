import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Download,
  RotateCcw,
  SlidersHorizontal,
  Image as ImageIcon,
  Palette,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import { useProcessingStore } from '@/store/useProcessingStore';
import { useAppStore } from '@/store/useAppStore';

type BackgroundMode = 'transparent' | 'color' | 'backdrop';

const PRESET_COLORS = [
  { name: 'Pure White', value: '#FFFFFF', border: true },
  { name: 'Studio Black', value: '#0A0A0A' },
  { name: 'E-commerce Gray', value: '#F1F5F9', border: true },
  { name: 'Warm Cream', value: '#FEF3C7', border: true },
  { name: 'Vibrant Blue', value: '#2563EB' },
  { name: 'Pastel Mint', value: '#A7F3D0', border: true },
  { name: 'Neon Coral', value: '#FB7185' },
  { name: 'Royal Purple', value: '#7C3AED' },
];

const PRESET_BACKDROPS = [
  {
    name: 'Minimal Studio',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=60',
  },
  {
    name: 'Luxury Marble',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=150&q=60',
  },
  {
    name: 'Modern Office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=150&q=60',
  },
  {
    name: 'Nature Blur',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=150&q=60',
  },
];

export const ResultEditor: React.FC = () => {
  const { previewUrl, processedUrl, resetStudio, file } = useProcessingStore();
  const { addToast } = useAppStore();

  const [bgMode, setBgMode] = useState<BackgroundMode>('transparent');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>(PRESET_BACKDROPS[0].url);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isComparing, setIsComparing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const activeImage = processedUrl || previewUrl;

  // Comparison slider mouse/touch drag handlers
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleSliderMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // High-Resolution Canvas Export (Composite cutout + background)
  const handleExport = async (format: 'png' | 'jpeg' | 'webp') => {
    if (!activeImage) return;
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context.');

      // Load foreground cutout
      const fgImg = new Image();
      fgImg.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        fgImg.onload = resolve;
        fgImg.onerror = reject;
        fgImg.src = activeImage;
      });

      canvas.width = fgImg.naturalWidth || fgImg.width || 1200;
      canvas.height = fgImg.naturalHeight || fgImg.height || 1200;

      // Draw background if not pure transparent
      if (bgMode === 'color') {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgMode === 'backdrop') {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = selectedBackdrop;
        });
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      }

      // Draw foreground cutout
      ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);

      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `clearcut_${file?.name?.replace(/\.[^/.]+$/, '') || 'cutout'}_${bgMode}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Export Completed',
        description: `Downloaded high-resolution ${format.toUpperCase()} image successfully.`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('Export failed:', err);
      // Fallback simple download
      const link = document.createElement('a');
      link.href = activeImage;
      link.download = `clearcut_cutout_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card-elevated p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">Cutout Studio & Background Editor</h3>
            <p className="text-xs text-text-muted">High-precision alpha transparency with instant backdrops</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isComparing ? 'secondary' : 'outline'}
            size="sm"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setIsComparing(!isComparing)}
          >
            {isComparing ? 'Exit Compare' : 'Before / After'}
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={resetStudio}>
            Upload New
          </Button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div
        ref={containerRef}
        className="relative w-full h-80 sm:h-[480px] rounded-xl overflow-hidden border border-border-subtle flex items-center justify-center select-none shadow-2xl transition-all"
        style={{
          backgroundColor: bgMode === 'color' ? selectedColor : undefined,
          backgroundImage:
            bgMode === 'transparent'
              ? undefined
              : bgMode === 'backdrop'
              ? `url(${selectedBackdrop})`
              : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Background Checkerboard for Transparent mode */}
        {bgMode === 'transparent' && <div className="absolute inset-0 bg-checkerboard" />}

        {/* Before / After Slider Mode */}
        {isComparing ? (
          <div className="relative w-full h-full">
            {/* Before (Original) Image */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <img
                src={previewUrl!}
                alt="Original"
                className="max-h-full max-w-full object-contain pointer-events-none"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="outline">Original</Badge>
              </div>
            </div>

            {/* After (Processed Cutout) Layer */}
            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center"
              style={{
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: bgMode === 'color' ? selectedColor : undefined,
                  backgroundImage:
                    bgMode === 'backdrop' ? `url(${selectedBackdrop})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {bgMode === 'transparent' && <div className="absolute inset-0 bg-checkerboard" />}
              </div>
              <img
                src={activeImage!}
                alt="Processed"
                className="max-h-full max-w-full object-contain pointer-events-none relative z-10"
              />
              <div className="absolute top-4 right-4 z-20">
                <Badge variant="gradient">ClearCut AI</Badge>
              </div>
            </div>

            {/* Draggable Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-black">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Single Output View */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={activeImage!}
              alt="Background removed cutout"
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Background Customization Controls */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Background Replacement
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-card p-1 border border-border-subtle text-xs">
            <button
              onClick={() => setBgMode('transparent')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                bgMode === 'transparent' ? 'bg-card-elevated text-brand-cyan shadow' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Transparent
              </span>
            </button>
            <button
              onClick={() => setBgMode('color')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                bgMode === 'color' ? 'bg-card-elevated text-brand-cyan shadow' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Solid Color
              </span>
            </button>
            <button
              onClick={() => setBgMode('backdrop')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                bgMode === 'backdrop' ? 'bg-card-elevated text-brand-cyan shadow' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Backdrops
              </span>
            </button>
          </div>
        </div>

        {/* Solid Color Palette */}
        {bgMode === 'color' && (
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-card border border-border-subtle animate-in fade-in-50 duration-200">
            {PRESET_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => setSelectedColor(col.value)}
                title={col.name}
                className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center ${
                  selectedColor === col.value ? 'scale-110 ring-2 ring-brand-cyan ring-offset-2 ring-offset-card' : 'hover:scale-105'
                } ${col.border ? 'border border-border' : ''}`}
                style={{ backgroundColor: col.value }}
              >
                {selectedColor === col.value && (
                  <Check className={`w-4 h-4 ${col.value === '#FFFFFF' || col.value === '#F1F5F9' || col.value === '#FEF3C7' || col.value === '#A7F3D0' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}

            {/* Custom Color Picker */}
            <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
              <label className="text-xs text-text-muted cursor-pointer flex items-center gap-1.5">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-text-secondary">{selectedColor}</span>
              </label>
            </div>
          </div>
        )}

        {/* Backdrops Palette */}
        {bgMode === 'backdrop' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-card border border-border-subtle animate-in fade-in-50 duration-200">
            {PRESET_BACKDROPS.map((bd) => (
              <button
                key={bd.name}
                onClick={() => setSelectedBackdrop(bd.url)}
                className={`relative rounded-lg overflow-hidden h-16 border-2 transition-all group ${
                  selectedBackdrop === bd.url ? 'border-brand-cyan scale-[1.02] shadow-lg' : 'border-transparent hover:border-border'
                }`}
              >
                <img src={bd.thumb} alt={bd.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white drop-shadow truncate">{bd.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Export & Download Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span>Lossless HD Canvas Rendering Engine Active</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="flex-1 sm:flex-none"
            onClick={() => handleExport('webp')}
            isLoading={isExporting}
          >
            Download WEBP
          </Button>
          <Button
            variant="outline"
            size="md"
            className="flex-1 sm:flex-none"
            onClick={() => handleExport('jpeg')}
            isLoading={isExporting}
          >
            Download JPG
          </Button>
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-1 sm:flex-none shadow-xl shadow-brand-blue/20"
            onClick={() => handleExport('png')}
            isLoading={isExporting}
          >
            Download Transparent PNG (HD)
          </Button>
        </div>
      </div>
    </div>
  );
};
