import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-status-error shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-cyan shrink-0" />,
  };

  const borders = {
    success: 'border-status-success/30 bg-card/95',
    error: 'border-status-error/30 bg-card/95',
    warning: 'border-status-warning/30 bg-card/95',
    info: 'border-brand-blue/30 bg-card/95',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-5',
            borders[t.type]
          )}
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary">{t.title}</h4>
            {t.description && (
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
