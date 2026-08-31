import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getInitialSession, signOutUser } from '@/lib/supabase';
import { UserProfile, UserCredits } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  credits: UserCredits | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null, session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setCredits: (credits: UserCredits | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  credits: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user, session) => set({ user, session }),
  setProfile: (profile) => set({ profile }),
  setCredits: (credits) => set({ credits }),

  initializeAuth: async () => {
    set({ isLoading: true });

    if (!isSupabaseConfigured || !supabase) {
      set({ isLoading: false, isInitialized: true });
      return;
    }

    try {
      const { user, session } = await getInitialSession();
      set({ user, session });

      // Listen for real-time auth changes (sign in, sign out, token refresh, OAuth callbacks)
      supabase.auth.onAuthStateChange((event, newSession) => {
        set({
          user: newSession?.user ?? null,
          session: newSession ?? null,
          isLoading: false,
        });

        // Clean up OAuth tokens from URL after successful Google sign-in
        if (event === 'SIGNED_IN' && newSession?.user) {
          if (
            window.location.hash.includes('access_token') ||
            window.location.hash.includes('type=') ||
            window.location.search.includes('code=')
          ) {
            window.history.replaceState(null, '', '/#dashboard');
            window.location.hash = 'dashboard';
          }
        }
      });
    } catch (err) {
      console.error('Error initializing Supabase Auth:', err);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOutUser();
      set({ user: null, session: null, profile: null, credits: null });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
