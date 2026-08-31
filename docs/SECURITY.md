# Security Architecture & Policies — SnapCut AI

## 1. Security Principles
SnapCut AI adheres to Defense-in-Depth, Zero-Trust Client boundaries, and Least Privilege principles.

---

## 2. Secrets Management & Boundaries

| Secret Name | Location Allowed | Risk if Leaked |
| :--- | :--- | :--- |
| `VITE_SUPABASE_ANON_KEY` | Frontend Client (`.env`) | Low (Protected by PostgreSQL RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **n8n Cloud ONLY** | Critical (Bypasses all RLS policies) |
| `AI_REMOVAL_API_KEY` | **n8n Cloud ONLY** | Critical (Unmetered AI credit theft) |
| `BKASH_APP_SECRET` / `PASSWORD` | **n8n Cloud ONLY** | Critical (Unauthorized merchant payment ops) |
| `CLOUDINARY_API_SECRET` | **n8n Cloud ONLY** | High (Media deletion / quota abuse) |

---

## 3. Threat Mitigation Matrix

1. **Client-Side Price Tampering**:
   - *Threat*: Malicious user modifies checkout price in JavaScript before triggering payment.
   - *Mitigation*: Frontend only submits `plan_id`. n8n queries authoritative price from Supabase table `plans`.
2. **Duplicate Payment Crediting**:
   - *Threat*: Multiple simultaneous return callbacks or replay attacks credit user twice for one transaction.
   - *Mitigation*: Database unique constraint on `provider_payment_id` and strict idempotency checks in n8n before updating wallet.
3. **Unauthorized Data Access**:
   - *Threat*: User requests another user's image URL or profile details.
   - *Mitigation*: PostgreSQL Row Level Security checks `auth.uid() = user_id` on every query.
4. **Data Privacy / Permanent Image Leak**:
   - *Threat*: Leaked permanent image storage databases.
   - *Mitigation*: Strict 24-hour auto-purge on Cloudinary ephemeral storage buckets.
