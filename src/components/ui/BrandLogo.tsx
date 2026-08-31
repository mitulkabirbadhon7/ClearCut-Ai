import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon with Radiant Gradient Ring */}
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-pink p-[2px] shadow-lg shadow-brand-blue/10`}>
        <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 100" fill="none" className="w-4/5 h-4/5">
            <defs>
              <linearGradient id="scLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="35%" stopColor="#2563EB" />
                <stop offset="70%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
            </defs>
            {/* Cutout Diamond Shape */}
            <path d="M25 42L48 18L78 48L55 72L25 42Z" fill="url(#scLogoGrad)" opacity="0.9" />
            <circle cx="68" cy="32" r="8" fill="#22D3EE" />
            <path d="M30 72L50 52L70 72H30Z" fill="#F8FAFC" opacity="0.8" />
            {/* Magic Sparkle Cut Marks */}
            <path d="M72 65L82 55M77 55L87 65" stroke="url(#scLogoGrad)" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${textSizes[size]}`}>
            <span className="text-text-primary">Snap</span>
            <span className="bg-brand-gradient bg-clip-text text-transparent">Cut</span>
            <span className="text-brand-cyan ml-1 text-xs px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 font-bold uppercase tracking-wider">
              AI
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
