import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessingJob } from '@/types';

interface JobHistoryCardProps {
  job: ProcessingJob;
  onPreview?: (job: ProcessingJob) => void;
}

export const JobHistoryCard: React.FC<JobHistoryCardProps> = ({ job, onPreview }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  // Calculate live 24-hour expiration countdown
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const expiresAt = new Date(job.expires_at).getTime();
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m left`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [job.expires_at]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.processed_image_url || isExpired) return;
    const a = document.createElement('a');
    a.href = job.processed_image_url;
    a.download = `clearcut_cutout_${job.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card
      variant="default"
      className="p-4 space-y-4 hover:border-brand-blue/40 transition-all cursor-pointer group"
      onClick={() => onPreview && onPreview(job)}
    >
      {/* Thumbnail Preview with Checkerboard */}
      <div className="w-full h-44 rounded-xl bg-checkerboard border border-border-subtle overflow-hidden flex items-center justify-center relative">
        {job.processed_image_url && !isExpired ? (
          <img
            src={job.processed_image_url}
            alt="Processed cutout"
            className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        ) : (
          <div className="text-center p-4 space-y-2 text-text-muted">
            <AlertCircle className="w-6 h-6 mx-auto text-status-warning" />
            <p className="text-xs">Image Expired (24h Policy)</p>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5">
          {job.status === 'completed' && !isExpired ? (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              <span>Ready</span>
            </Badge>
          ) : isExpired || job.status === 'expired' ? (
            <Badge variant="outline" size="sm" className="text-text-muted">
              <span>Expired</span>
            </Badge>
          ) : (
            <Badge variant="gradient" size="sm">
              <Clock className="w-3 h-3 mr-1 animate-spin" />
              <span>Processing</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Metadata Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-muted font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-cyan" />
            <span className={isExpired ? 'text-status-error' : 'text-text-secondary'}>{timeLeft}</span>
          </span>
          {job.duration_ms && (
            <span className="flex items-center gap-1 text-text-secondary">
              <Zap className="w-3 h-3 text-brand-pink" />
              <span>{(job.duration_ms / 1000).toFixed(1)}s</span>
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
          <span className="text-[11px] text-text-muted font-mono truncate">
            {new Date(job.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {job.processed_image_url && !isExpired && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
