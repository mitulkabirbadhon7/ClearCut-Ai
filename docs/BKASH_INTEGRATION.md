# bKash Payment Gateway Integration Guide — SnapCut AI

## 1. Overview
This document outlines the official bKash Merchant Payment Gateway integration architecture for SnapCut AI.
SnapCut AI utilizes the **Official bKash Tokenized Checkout API v2.0** for processing credit pack purchases and subscriptions in Bangladeshi Taka (BDT).

> [!IMPORTANT]
> **Strict Policy**: No manual "Send Money", personal bKash numbers, fake payment simulations, scraping, or unofficial APIs are permitted. If official documentation or merchant credentials are being procured, all integration points adhere strictly to the sandbox and live gateway specifications.

---

## 2. bKash Gateway Architecture & Credentials

The integration requires the following Merchant credentials provided by bKash:
- **App Key** (`BKASH_APP_KEY`)
- **App Secret** (`BKASH_APP_SECRET`)
- **Merchant Username** (`BKASH_USERNAME`)
- **Merchant Password** (`BKASH_PASSWORD`)
- **Base URL**:
  - Sandbox: `https://tokenized.sandbox.bka.sh/v2.0`
  - Production: `https://tokenized.pay.bka.sh/v2.0`

---

## 3. End-to-End Payment Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant React as React Frontend
    participant n8n as n8n Cloud Payment Webhook
    participant Supa as Supabase DB
    participant bKash as bKash Gateway API

    User->>React: Selects Credit Package / Plan
    React->>n8n: POST /webhook/bkash/create (plan_id, JWT)
    n8n->>Supa: Validate User & Fetch Authoritative Plan Price
    n8n->>Supa: Create Pending Transaction (status: 'pending')
    n8n->>bKash: POST /tokenized/checkout/create
    bKash-->>n8n: Return paymentID & bkashURL
    n8n-->>React: Return bkashURL redirect
    React->>User: Redirects to bKash Checkout UI
    
    User->>bKash: Enters bKash wallet number, OTP & PIN
    bKash->>n8n: Return Callback URL (?paymentID=...&status=success)
    n8n->>bKash: POST /tokenized/checkout/execute (paymentID)
    bKash-->>n8n: Return trxID, transactionStatus: 'Completed'
    
    n8n->>Supa: Idempotency Check (Check if trxID or paymentID already completed)
    alt Already Processed
        n8n-->>React: Redirect with already_processed status
    else Valid First Execution
        n8n->>Supa: Update Transaction -> 'successful'
        n8n->>Supa: Add credits to user wallet atomically
        n8n->>Supa: Log immutable audit event
        n8n-->>React: Redirect to /dashboard/billing?payment=success
    end
```

---

## 4. Idempotency & Duplicate Callback Protection

To prevent double-crediting if bKash sends duplicate callbacks or a user triggers multiple browser returns:
1. Every payment has a unique `paymentID` and `trxID`.
2. Database column `provider_payment_id` has a unique constraint.
3. n8n executes a database check:
   ```sql
   SELECT status FROM transactions WHERE provider_payment_id = $paymentID;
   ```
4. If status is already `'successful'`, the credit addition step is completely bypassed.

---

## 5. Testing & Verification Checklist

- [ ] Sandbox Token Generation (`POST /tokenized/checkout/token/grant`)
- [ ] Create Payment request validation
- [ ] Execute Payment request validation
- [ ] Query Payment status verification (`POST /tokenized/checkout/payment/search/`)
- [ ] Refund handling workflow (`POST /tokenized/checkout/payment/refund`)
- [ ] Webhook error state handling (insufficient funds, user canceled, OTP timeout)
