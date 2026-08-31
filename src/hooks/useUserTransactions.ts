import { useQuery } from '@tanstack/react-query';
import { fetchUserTransactions } from '@/lib/database';
import { useAuthStore } from '@/store/useAuthStore';

export function useUserTransactions() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['user_transactions', user?.id],
    queryFn: () => (user ? fetchUserTransactions(user.id) : []),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 60, // 1 minute
  });
}
