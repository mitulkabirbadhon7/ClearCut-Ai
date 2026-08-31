import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiKey } from '@/types';

// Mock storage for local demo mode
const LOCAL_MOCK_KEYS: ApiKey[] = [
  {
    id: 'key_demo_01',
    user_id: 'mock_user',
    key_prefix: 'sc_live_9a8b',
    name: 'Production E-commerce Store',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export function useApiKeys() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['api_keys', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase || !user) {
        return LOCAL_MOCK_KEYS;
      }

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys:', error);
        return LOCAL_MOCK_KEYS;
      }

      return data as ApiKey[];
    },
    enabled: Boolean(user?.id),
  });

  const createKeyMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const rawSecret = `sc_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const prefix = rawSecret.substring(0, 12);

      if (isSupabaseConfigured && supabase && user) {
        const { data, error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            name: name || 'Default API Key',
            key_prefix: prefix,
            hashed_key: rawSecret, // in prod backend, hash with bcrypt/sha256
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        return { keyRecord: data, secretKey: rawSecret };
      }

      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        user_id: user?.id || 'demo_user',
        name,
        key_prefix: prefix,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      LOCAL_MOCK_KEYS.unshift(newKey);
      return { keyRecord: newKey, secretKey: rawSecret };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('api_keys')
          .delete()
          .eq('id', keyId);
        if (error) throw error;
      } else {
        const idx = LOCAL_MOCK_KEYS.findIndex((k) => k.id === keyId);
        if (idx !== -1) LOCAL_MOCK_KEYS.splice(idx, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
    },
  });

  return {
    ...query,
    createApiKey: createKeyMutation.mutateAsync,
    isCreating: createKeyMutation.isPending,
    revokeApiKey: revokeKeyMutation.mutateAsync,
    isRevoking: revokeKeyMutation.isPending,
  };
}
