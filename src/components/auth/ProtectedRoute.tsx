import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate?: (route: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigate }) => {
  const { user, isLoading } = useAuthStore();
  const { setActiveModal } = useAppStore();

  useEffect(() => {
    if (!isLoading && !user) {
      if (onNavigate) {
        onNavigate('home');
      } else {
        window.location.hash = '';
      }
      setActiveModal('auth');
    }
  }, [isLoading, user, setActiveModal, onNavigate]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!user) {
    return null; // Prevents blank render or undefined access when logged out
  }

  return <>{children}</>;
};
