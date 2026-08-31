import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Translates raw Supabase authentication error strings into clear, human-friendly reasons.
 */
export function formatAuthError(err: any): string {
  const message = err?.message?.toLowerCase() || '';
  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please verify your credentials or click "Forgot password".';
  }
  if (message.includes('user not found') || message.includes('invalid_grant')) {
    return 'No account exists with this email address. Please click "Register Free" below to create one.';
  }
  if (message.includes('already registered') || message.includes('user already exists') || message.includes('identity already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (message.includes('email not confirmed')) {
    return 'Your email has not been verified yet. Please check your inbox for the confirmation link.';
  }
  if (message.includes('password') && (message.includes('6 characters') || message.includes('short') || message.includes('least'))) {
    return 'Password is too short. Please use at least 6 characters.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait 60 seconds before trying again.';
  }
  if (message.includes('unsupported provider') || message.includes('provider is not enabled')) {
    return 'Google Sign-In is not enabled in your Supabase Dashboard yet. Enable Google in Supabase ➔ Authentication ➔ Providers, or sign in with your email & password.';
  }
  if (message.includes('valid email') || message.includes('invalid email') || message.includes('unable to validate')) {
    return 'Please enter a valid email address (e.g. name@gmail.com).';
  }
  return err?.message || 'Authentication error. Please check your credentials and try again.';
}

// --- AUTHENTICATION HELPER METHODS ---

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if email already exists in profiles
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('already exists')) {
      throw err;
    }
  }

  // 2. Perform Supabase signUp
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
      emailRedirectTo: `${window.location.origin}`,
    },
  });

  if (error) throw error;

  // 3. Supabase returns empty identities array if email was already registered
  if (data?.user && data.user.identities && data.user.identities.length === 0) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordForEmail(email: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#reset-password`,
  });

  if (error) throw error;
  return data;
}

export async function updateUserPassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

export async function getInitialSession(): Promise<{ user: User | null; session: Session | null }> {
  if (!supabase) {
    return { user: null, session: null };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return { user: null, session: null };
  }

  return { user: data.session.user, session: data.session };
}
