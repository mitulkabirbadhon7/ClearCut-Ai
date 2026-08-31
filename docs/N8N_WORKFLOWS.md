# n8n Cloud Workflow Architecture — SnapCut AI

## 1. Role of n8n in SnapCut AI
n8n Cloud acts as the **Serverless Business Logic Engine and Secure Gateway** for SnapCut AI. It protects proprietary third-party API keys (AI Background Removal Provider, bKash Merchant Credentials, Supabase Service Role Key) from ever being exposed to the browser client.

---

## 2. Core Workflows Overview

### Workflow 1: AI Background Removal Orchestration
- **Trigger**: Webhook `POST /webhook/process-image`
- **Steps**:
  1. Authenticate Supabase JWT Token from Header (`Authorization: Bearer <JWT>`).
  2. Query user credit balance from Supabase PostgreSQL.
  3. Validate entitlement (has credits OR daily free quota > 0).
  4. Create `processing_jobs` row with status `processing`.
  5. Call AI Background Removal Provider API with source image URL.
  6. Receive transparent PNG binary buffer.
  7. Upload processed PNG to Cloudinary temporary storage bucket (24h retention).
  8. Atomically deduct 1 credit from Supabase and mark job status `completed`.
  9. Return JSON payload `{ success: true, job_id, output_url, duration_ms }`.
  10. On Error: Update job status to `failed`, log error, return sanitized error message.

### Workflow 2: bKash Payment Gateway Orchestration
- **Trigger**: Webhook `POST /webhook/bkash/create` & `GET/POST /webhook/bkash/callback`
- **Steps**:
  1. Authenticate user session.
  2. Fetch authoritative plan pricing from database table `plans`.
  3. Request Token from bKash API -> Create Payment -> Return `bkashURL`.
  4. Receive bKash callback on redirect.
  5. Execute bKash payment verification call.
  6. Idempotently update Supabase `transactions` and credit user account.

### Workflow 3: Ephemeral File Cleanup / Health Check
- **Trigger**: Cron schedule (Every 6 hours)
- **Steps**:
  1. Mark jobs older than 24 hours as `status = 'expired'`.
  2. Verify Cloudinary auto-purge rules.
  3. Prune old debug logs.
