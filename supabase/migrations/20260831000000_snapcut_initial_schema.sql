-- ==============================================================================
-- CLEARCUT AI — POSTGRESQL INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Migration: 20260831000000_snapcut_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- 2.1 PROFILES (1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 CREDITS (User credit wallet & daily free quota ledger)
CREATE TABLE IF NOT EXISTS public.credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    free_daily_remaining INT NOT NULL DEFAULT 5 CHECK (free_daily_remaining >= 0),
    purchased_credits INT NOT NULL DEFAULT 0 CHECK (purchased_credits >= 0),
    last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 PLANS (Authoritative Pricing Catalog in BDT - Never trusted from client)
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    credits_included INT NOT NULL DEFAULT 0,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 PROCESSING JOBS (Metadata for image removals - Ephemeral 24h retention)
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    original_image_url TEXT,
    processed_image_url TEXT,
    duration_ms INT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 2.5 TRANSACTIONS (Official bKash Merchant Payment records)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    provider TEXT NOT NULL DEFAULT 'bkash' CHECK (provider IN ('bkash', 'manual_admin')),
    provider_payment_id TEXT UNIQUE,
    provider_trx_id TEXT,
    amount_bdt NUMERIC(10, 2) NOT NULL CHECK (amount_bdt >= 0),
    currency TEXT NOT NULL DEFAULT 'BDT',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded', 'expired')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 SUBSCRIPTIONS (User active subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 API KEYS (Developer REST API secrets - stored hashed)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_prefix TEXT NOT NULL,
    hashed_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT 'Default API Key',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 API USAGE (Developer API rate-limiting & metrics)
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 WEBHOOK EVENTS (Raw webhook audit trail for bKash and AI providers)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 SYSTEM LOGS (Diagnostic & audit logging)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_level TEXT NOT NULL DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_user_id ON public.processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON public.processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_created_at ON public.processing_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_payment_id ON public.transactions(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hashed ON public.api_keys(hashed_key);

-- ==============================================================================
-- 4. AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 4.1 Auto-provision Profile and Credits Wallet on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert user profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'user'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Provision credit wallet with 5 free daily credits
    INSERT INTO public.credits (user_id, free_daily_remaining, purchased_credits, last_reset_date)
    VALUES (NEW.id, 5, 0, CURRENT_DATE)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.2 Atomic Credit Deduction Function (Thread-safe, Race-condition proof)
CREATE OR REPLACE FUNCTION public.deduct_user_credit(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_credits RECORD;
    v_used_free BOOLEAN := FALSE;
BEGIN
    -- Select with Row-Level Lock (FOR UPDATE)
    SELECT * INTO v_credits
    FROM public.credits
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Credit wallet not found');
    END IF;

    -- Check if daily reset is needed
    IF v_credits.last_reset_date < CURRENT_DATE THEN
        v_credits.free_daily_remaining := 5;
        v_credits.last_reset_date := CURRENT_DATE;
    END IF;

    -- Prioritize consuming free daily credit first
    IF v_credits.free_daily_remaining > 0 THEN
        UPDATE public.credits
        SET free_daily_remaining = free_daily_remaining - 1,
            last_reset_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        v_used_free := TRUE;
    -- Otherwise consume purchased credits
    ELSIF v_credits.purchased_credits > 0 THEN
        UPDATE public.credits
        SET purchased_credits = purchased_credits - 1,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        v_used_free := FALSE;
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits');
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'used_free', v_used_free,
        'free_remaining', CASE WHEN v_used_free THEN v_credits.free_daily_remaining - 1 ELSE v_credits.free_daily_remaining END,
        'purchased_remaining', CASE WHEN NOT v_used_free THEN v_credits.purchased_credits - 1 ELSE v_credits.purchased_credits END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.3 Atomic Credit Addition for bKash Payment
CREATE OR REPLACE FUNCTION public.add_user_credits_atomic(
    p_user_id UUID,
    p_credits_to_add INT,
    p_payment_id TEXT,
    p_trx_id TEXT,
    p_amount NUMERIC
)
RETURNS JSONB AS $$
DECLARE
    v_trx RECORD;
BEGIN
    -- Check Idempotency: verify if already successful
    SELECT * INTO v_trx FROM public.transactions WHERE provider_payment_id = p_payment_id;

    IF FOUND AND v_trx.status = 'successful' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already processed (idempotent)');
    END IF;

    -- Update or Insert Transaction
    IF FOUND THEN
        UPDATE public.transactions
        SET status = 'successful',
            provider_trx_id = p_trx_id,
            updated_at = NOW()
        WHERE id = v_trx.id;
    END IF;

    -- Add credits
    UPDATE public.credits
    SET purchased_credits = purchased_credits + p_credits_to_add,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN jsonb_build_object('success', true, 'credits_added', p_credits_to_add);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES (Idempotent with DROP IF EXISTS)
-- ==============================================================================

-- Enable RLS on all user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5.2 Credits Policies
DROP POLICY IF EXISTS "Users can view own credits" ON public.credits;
CREATE POLICY "Users can view own credits"
    ON public.credits FOR SELECT
    USING (auth.uid() = user_id);

-- 5.3 Processing Jobs Policies
DROP POLICY IF EXISTS "Users can view own processing jobs" ON public.processing_jobs;
CREATE POLICY "Users can view own processing jobs"
    ON public.processing_jobs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own processing jobs" ON public.processing_jobs;
CREATE POLICY "Users can insert own processing jobs"
    ON public.processing_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 5.4 Plans Policies (Public read-only for active plans)
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
CREATE POLICY "Anyone can view active plans"
    ON public.plans FOR SELECT
    USING (is_active = TRUE);

-- 5.5 Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

-- 5.6 Subscriptions Policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- 5.7 API Keys Policies
DROP POLICY IF EXISTS "Users can view own API keys" ON public.api_keys;
CREATE POLICY "Users can view own API keys"
    ON public.api_keys FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own API keys" ON public.api_keys;
CREATE POLICY "Users can manage own API keys"
    ON public.api_keys FOR ALL
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. DEFAULT PLANS SEED DATA
-- ==============================================================================
INSERT INTO public.plans (code, name, price_bdt, credits_included, is_recurring, is_active, features)
VALUES 
(
    'free',
    'Free Forever Tier',
    0.00,
    5,
    FALSE,
    TRUE,
    '["5 Free Images Daily", "Standard HD Quality", "24-Hour Ephemeral Retention"]'::jsonb
),
(
    'pro_monthly',
    'Pro Monthly Plan',
    499.00,
    300,
    TRUE,
    TRUE,
    '["300 HD Removal Credits/mo", "5000x5000 Max Resolution", "Priority Neural Processing", "Developer REST API Access", "bKash Verified Checkout"]'::jsonb
),
(
    'credit_pack_100',
    '100 Credit Pack',
    299.00,
    100,
    FALSE,
    TRUE,
    '["100 Full HD Image Credits", "Never Expire Until Used", "No Auto-Renew Subscription", "Instant bKash Crediting"]'::jsonb
)
ON CONFLICT (code) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt,
    credits_included = EXCLUDED.credits_included,
    features = EXCLUDED.features;
