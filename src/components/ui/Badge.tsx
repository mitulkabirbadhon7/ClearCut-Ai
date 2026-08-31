import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-card-elevated text-text-secondary border-border-subtle',
    gradient: 'bg-gradient-to-r from-brand-cyan/15 via-brand-blue/15 to-brand-pink/15 text-brand-cyan border-brand-blue/30',
    success: 'bg-status-success/10 text-status-success border-status-success/30',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/30',
    error: 'bg-status-error/10 text-status-error border-status-error/30',
    info: 'bg-primary/10 text-primary border-primary/30',
    outline: 'bg-transparent text-text-muted border-border',
  };

  const dotColors = {
    default: 'bg-text-muted',
    gradient: 'bg-brand-cyan',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
    info: 'bg-primary',
    outline: 'bg-text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
