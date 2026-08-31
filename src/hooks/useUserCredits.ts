import { useQuery } from '@tanstack/react-query';
import { fetchUserCredits } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';

export function useUserCredits() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['user_credits', user?.id],
    queryFn: () => (user ? fetchUserCredits(user.id) : null),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 60, // 1 minute
  });
}
