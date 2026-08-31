import { useQuery } from '@tanstack/react-query';
import { fetchPricingPlans } from '@/lib/database';

export function usePricingPlans() {
  return useQuery({
    queryKey: ['pricing_plans'],
    queryFn: fetchPricingPlans,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
