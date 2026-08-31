import { useQuery } from '@tanstack/react-query';
import { fetchUserJobs } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';

export function useProcessingHistory(limit = 20) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['processing_history', user?.id, limit],
    queryFn: () => (user ? fetchUserJobs(user.id, limit) : []),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 30, // 30 seconds
  });
}
