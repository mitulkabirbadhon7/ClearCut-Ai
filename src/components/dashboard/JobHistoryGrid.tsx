import React, { useState } from 'react';
import { JobHistoryCard } from './JobHistoryCard';
import { ProcessingJob } from '@/types';
import { Sparkles, Layers, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

interface JobHistoryGridProps {
  jobs?: ProcessingJob[];
  isLoading?: boolean;
  onNavigateToUpload?: () => void;
}

export const JobHistoryGrid: React.FC<JobHistoryGridProps> = ({
  jobs = [],
  isLoading = false,
  onNavigateToUpload,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  const filteredJobs = jobs.filter((job) => {
    const isJobExpired = new Date(job.expires_at).getTime() < Date.now() || job.status === 'expired';
    if (filter === 'active') return !isJobExpired && job.status === 'completed';
    if (filter === 'expired') return isJobExpired;
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3 p-4 rounded-xl border border-border-subtle bg-card">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-lg font-bold text-text-primary">Recent Image Cutouts</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-card-elevated text-text-muted font-mono">
            {jobs.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border-subtle text-xs">
          <Filter className="w-3.5 h-3.5 text-text-muted ml-2 mr-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-card-elevated text-brand-cyan font-bold shadow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === 'active' ? 'bg-card-elevated text-brand-cyan font-bold shadow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Active (24h)
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === 'expired' ? 'bg-card-elevated text-brand-cyan font-bold shadow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobHistoryCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-border-subtle bg-card space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 mx-auto flex items-center justify-center text-brand-cyan">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-base font-bold text-text-primary">No processing history found</h4>
            <p className="text-xs text-text-muted">
              {filter !== 'all'
                ? `No ${filter} jobs currently. Upload a new photo to start removing backgrounds.`
                : 'Upload your first photo to get a clean transparent PNG cutout.'}
            </p>
          </div>
          {onNavigateToUpload && (
            <Button
              variant="gradient"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={onNavigateToUpload}
            >
              Start New Cutout
            </Button>
          )}
        </div>
      )}

      {/* Ephemeral Notice */}
      <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5 pt-2">
        <Clock className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Images are automatically destroyed after 24 hours in accordance with our strict privacy policy.</span>
      </div>
    </div>
  );
};
