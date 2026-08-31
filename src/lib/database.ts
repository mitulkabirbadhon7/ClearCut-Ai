import { supabase, isSupabaseConfigured } from './supabase';
import { UserCredits, ProcessingJob, PricingPlan, Transaction, UserProfile } from '@/types';

// Default mock data for offline/demo development
const DEFAULT_MOCK_CREDITS: UserCredits = {
  id: 'mock-credits-001',
  user_id: 'mock-user-001',
  free_daily_remaining: 5,
  purchased_credits: 0,
  last_reset_date: new Date().toISOString().split('T')[0],
  updated_at: new Date().toISOString(),
};

const DEFAULT_MOCK_PLANS: PricingPlan[] = [
  {
    id: 'plan-free',
    code: 'free',
    name: 'Free Forever',
    price_bdt: 0,
    credits_included: 5,
    is_recurring: false,
    is_active: true,
    features: ['5 Free Images Daily', 'Standard HD Quality', '24-Hour Ephemeral Storage'],
  },
  {
    id: 'plan-pro',
    code: 'pro_monthly',
    name: 'Pro Monthly Plan',
    price_bdt: 499,
    credits_included: 300,
    is_recurring: true,
    is_active: true,
    features: [
      '300 HD Removal Credits/mo',
      '5000×5000 Max Resolution',
      'Priority AI Queue',
      'Developer API Included',
    ],
  },
  {
    id: 'plan-100pack',
    code: 'credit_pack_100',
    name: '100 Credit Pack',
    price_bdt: 299,
    credits_included: 100,
    is_recurring: false,
    is_active: true,
    features: ['100 Full HD Image Credits', 'Never Expire', 'Instant bKash Crediting'],
  },
];

/**
 * Fetch authoritative user credit wallet
 */
export async function fetchUserCredits(userId: string): Promise<UserCredits> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_MOCK_CREDITS;
  }

  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.warn('Could not load credits from Supabase, using defaults:', error.message);
    return DEFAULT_MOCK_CREDITS;
  }

  return data as UserCredits;
}

/**
 * Fetch user's recent processing jobs
 */
export async function fetchUserJobs(userId: string, limit = 20): Promise<ProcessingJob[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('processing_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching jobs:', error.message);
    return [];
  }

  return data as ProcessingJob[];
}

/**
 * Fetch active pricing catalog in BDT
 */
export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_MOCK_PLANS;
  }

  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price_bdt', { ascending: true });

  if (error || !data || data.length === 0) {
    return DEFAULT_MOCK_PLANS;
  }

  return data.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    price_bdt: Number(d.price_bdt),
    credits_included: d.credits_included,
    is_recurring: d.is_recurring,
    is_active: d.is_active,
    features: Array.isArray(d.features) ? d.features : JSON.parse(d.features || '[]'),
  }));
}

/**
 * Fetch user transactions / payment history
 */
export async function fetchUserTransactions(userId: string): Promise<Transaction[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error.message);
    return [];
  }

  return data as Transaction[];
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data as UserProfile;
}
