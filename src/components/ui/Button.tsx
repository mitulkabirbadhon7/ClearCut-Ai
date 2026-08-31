import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'gradient',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      gradient:
        'bg-brand-gradient hover:bg-brand-gradient-hover text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/35 border border-white/10',
      primary:
        'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20',
      secondary:
        'bg-card-elevated hover:bg-card-hover text-text-primary border border-border-subtle hover:border-border',
      outline:
        'bg-transparent hover:bg-card-elevated text-text-primary border border-border hover:border-border-highlight',
      ghost:
        'bg-transparent hover:bg-card-elevated text-text-secondary hover:text-text-primary',
      danger:
        'bg-status-error/10 hover:bg-status-error/20 text-status-error border border-status-error/30 hover:border-status-error/50',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
      lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl',
      icon: 'p-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
