import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage?: string;
  processedImage?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  aspectRatio = 'aspect-[4/3] sm:aspect-[16/10]',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // High quality demo assets using SVGs with transparent cutout simulation
  const originalSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="%23f59e0b"/>
        <stop offset="50%" stop-color="%23ef4444"/>
        <stop offset="100%" stop-color="%237c3aed"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(%23bgG)"/>
    <circle cx="400" cy="240" r="110" fill="%23fde047" opacity="0.6"/>
    <!-- Shoe/Product Outline -->
    <path d="M220,380 C260,380 290,360 320,320 C360,260 440,240 500,260 C560,280 620,340 650,380 C670,410 650,440 600,440 L240,440 C200,440 180,410 220,380 Z" fill="%230f172a" stroke="%2338bdf8" stroke-width="8"/>
    <path d="M320,320 C380,340 460,340 520,300" fill="none" stroke="%23f43f5e" stroke-width="12" stroke-linecap="round"/>
    <circle cx="280" cy="400" r="22" fill="%2322d3ee"/>
    <circle cx="560" cy="400" r="22" fill="%2322d3ee"/>
    <text x="400" y="520" font-family="sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="2">ORIGINAL WITH COMPLEX BACKGROUND</text>
  </svg>`;

  const processedSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <!-- Transparent Background with Shoe Cutout Only -->
    <path d="M220,380 C260,380 290,360 320,320 C360,260 440,240 500,260 C560,280 620,340 650,380 C670,410 650,440 600,440 L240,440 C200,440 180,410 220,380 Z" fill="%230f172a" stroke="%2338bdf8" stroke-width="8"/>
    <path d="M320,320 C380,340 460,340 520,300" fill="none" stroke="%23f43f5e" stroke-width="12" stroke-linecap="round"/>
    <circle cx="280" cy="400" r="22" fill="%2322d3ee"/>
    <circle cx="560" cy="400" r="22" fill="%2322d3ee"/>
    <text x="400" y="520" font-family="sans-serif" font-size="28" font-weight="bold" fill="%2338bdf8" text-anchor="middle" letter-spacing="2">CLEAN 100% TRANSPARENT PNG CUTOUT</text>
  </svg>`;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      <div
        ref={containerRef}
        className={`relative w-full ${aspectRatio} rounded-3xl overflow-hidden shadow-2xl border-2 border-border-subtle cursor-ew-resize bg-card group`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Right Side: Processed Transparent Layer (Underneath with Checkerboard Canvas) */}
        <div className="absolute inset-0 w-full h-full bg-checkerboard flex items-center justify-center">
          <img
            src={processedSvg}
            alt="SnapCut AI Processed Background Removed Cutout"
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />
          {/* Label Badge Right */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-card/90 border border-border-subtle text-xs font-semibold text-brand-cyan backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
            <span>AI Removed (Transparent)</span>
          </div>
        </div>

        {/* Left Side: Original Image (Clipped dynamically by sliderPosition) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="absolute inset-0 h-full"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            }}
          >
            <img
              src={originalSvg}
              alt="Original Image with Background"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Label Badge Left */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/75 border border-white/10 text-xs font-semibold text-text-primary backdrop-blur-md shadow-lg">
            Original Photo
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-brand-cyan via-brand-blue to-brand-pink shadow-[0_0_15px_rgba(34,211,238,0.7)]"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          {/* Draggable Handle Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-card border-2 border-brand-cyan shadow-xl shadow-brand-blue/50 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
            <MoveHorizontal className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-text-muted flex items-center justify-center gap-2">
        <MoveHorizontal className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Drag the slider left and right to inspect the pixel-perfect cutout edge quality</span>
      </div>
    </div>
  );
};
