# PostgreSQL Database & RLS Guide — SnapCut AI

## 1. Database Overview
SnapCut AI utilizes **Supabase PostgreSQL** as its primary relational datastore. The schema is normalized, indexed for high-volume lookup, and secured with **Row Level Security (RLS)**.

---

## 2. Table Schemas & Definitions

### `profiles`
Linked 1-to-1 with `auth.users` via trigger upon user registration.
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `credits`
Stores remaining daily free quota and purchased credit balance.
```sql
CREATE TABLE public.credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    free_daily_remaining INT DEFAULT 5 CHECK (free_daily_remaining >= 0),
    purchased_credits INT DEFAULT 0 CHECK (purchased_credits >= 0),
    last_reset_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `processing_jobs`
Metadata for every background removal job. Raw image files expire after 24 hours.
```sql
CREATE TABLE public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    original_image_url TEXT,
    processed_image_url TEXT,
    duration_ms INT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);
```

### `plans`
Authoritative pricing catalog. Never hardcoded on client.
```sql
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price_bdt NUMERIC(10, 2) NOT NULL,
    credits_included INT NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `transactions`
Payment gateway transactions with bKash identifiers.
```sql
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    provider TEXT NOT NULL DEFAULT 'bkash',
    provider_payment_id TEXT UNIQUE,
    provider_trx_id TEXT,
    amount_bdt NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'BDT',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'cancelled', 'refunded', 'expired')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Row Level Security (RLS) Policy Blueprint
```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and edit only their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Processing Jobs: Users can view only their own jobs
CREATE POLICY "Users can read own jobs" ON public.processing_jobs FOR SELECT USING (auth.uid() = user_id);

-- Credits: Users can read own balance
CREATE POLICY "Users can view own credits" ON public.credits FOR SELECT USING (auth.uid() = user_id);
```
