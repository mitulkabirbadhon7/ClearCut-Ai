# n8n Cloud Automation Architecture — ClearCut AI

## 1. Overview
ClearCut AI delegates AI model execution, credit checks, multi-provider failover, and payment webhooks to **n8n Cloud**.

### Workflow JSON Files Location:
- [`n8n/workflows/01_remove_background_pipeline.json`](file:///d:/Development/New%20folder/Remove_BG/n8n/workflows/01_remove_background_pipeline.json) — End-to-end background removal pipeline with credit deduction, AI failover, and job logging.
- [`n8n/workflows/02_ephemeral_cleanup_cron.json`](file:///d:/Development/New%20folder/Remove_BG/n8n/workflows/02_ephemeral_cleanup_cron.json) — Hourly media lifecycle cleanup cron.

---

## 2. Step-by-Step n8n Import Guide

1. Open your **n8n Cloud Dashboard** (e.g. `https://your-instance.app.n8n.cloud`).
2. Click **Workflows** ➔ **`+ Add Workflow`**.
3. In the top-right menu (`...`), click **Import from File** (or paste the JSON from `01_remove_background_pipeline.json`).
4. In n8n **Settings** ➔ **Variables / Environment**, configure:
   - `SUPABASE_URL`: `https://asnlfskuuvrthmgvdubc.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: *(From Supabase Project Settings ➔ API)*
   - `CLIPDROP_API_KEY`: *(From Clipdrop / Replicate)*
   - `PHOTOROOM_API_KEY`: *(Optional fallback provider)*
5. Click **Save** and toggle the workflow to **Active**!
6. Copy the **Production Webhook URL** (e.g. `https://your-instance.app.n8n.cloud/webhook/remove-background`) and save it to your local `.env`:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/remove-background
   ```

---

## 3. Core Workflows Overview

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
