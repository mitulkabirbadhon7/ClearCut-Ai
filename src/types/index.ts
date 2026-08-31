export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  free_daily_remaining: number;
  purchased_credits: number;
  last_reset_date: string;
  updated_at: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

export interface ProcessingJob {
  id: string;
  user_id: string;
  status: JobStatus;
  original_image_url: string;
  processed_image_url?: string | null;
  duration_ms?: number | null;
  file_size_bytes?: number | null;
  mime_type?: string | null;
  failure_reason?: string | null;
  created_at: string;
  expires_at: string;
}

export interface PricingPlan {
  id: string;
  code: string;
  name: string;
  price_bdt: number;
  credits_included: number;
  is_recurring: boolean;
  is_active: boolean;
  features: string[];
}

export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded' | 'expired';

export interface Transaction {
  id: string;
  user_id: string;
  plan_id: string;
  provider: 'bkash';
  provider_payment_id?: string | null;
  provider_trx_id?: string | null;
  amount_bdt: number;
  currency: 'BDT';
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  last_used_at?: string | null;
  created_at: string;
}
