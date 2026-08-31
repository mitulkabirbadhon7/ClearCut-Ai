# SnapCut AI — System Architecture Specification

## 1. Executive Summary & Architecture Philosophy

**SnapCut AI** is a production-grade AI SaaS platform engineered for one-click image background removal, optimized initially for the Bangladesh market (with native bKash Payment Gateway integration) and structured for seamless international expansion.

### Core Architectural Principles
1. **Serverless & Managed Stack**: Eliminates fragile VPS hosting, container management overhead, and custom server maintenance. We use **React/Vite (Frontend)** + **Supabase (Auth & DB)** + **n8n Cloud (Automation & Business Logic Engine)** + **Cloudinary (Ephemeral Storage)** + **AI Providers** + **bKash (Payment)** + **Vercel (Edge Hosting)**.
2. **Zero-Trust Client Boundary**: The frontend is treated strictly as an untrusted UI presentation layer. All credit deductions, plan pricing verification, AI provider keys, and payment confirmations execute in secure, trusted serverless environments (n8n Cloud & Supabase PostgreSQL RLS / Database functions).
3. **Ephemeral Privacy-First Media Storage**: SnapCut AI strictly avoids permanent user image retention. All user uploads and transparent output PNGs reside in temporary Cloudinary buckets configured with a strict 24-hour maximum auto-purge lifecycle.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Presentation Layer (Vercel Edge)"]
        UserBrowser["User Browser / Mobile Device"]
        ReactApp["SnapCut AI Frontend (React + Vite + TS + Tailwind)"]
        UserBrowser <--> ReactApp
    end

    subgraph AuthAndDataLayer ["Identity & Persistence Layer (Supabase)"]
        SupaAuth["Supabase Auth (JWT / OAuth / Sessions)"]
        SupaDB[("Supabase PostgreSQL (RLS Protected Tables)")]
        ReactApp <-->|Direct Auth & User Queries via RLS| SupaAuth
        ReactApp <-->|Direct Safe Queries via Anon Key + RLS| SupaDB
    end

    subgraph MediaLayer ["Ephemeral Media Layer (Cloudinary)"]
        CloudinaryCDN["Cloudinary Ephemeral Bucket (24h Auto-Purge)"]
        ReactApp -->|Direct Temporary Image Upload| CloudinaryCDN
    end

    subgraph AutomationLayer ["Business Logic & Orchestration Layer (n8n Cloud)"]
        n8nWebhook["n8n Secure Webhooks"]
        JobOrchestrator["Job Orchestrator & Entitlement Verifier"]
        bKashWorkflow["bKash Payment Verifier (Idempotent)"]
        APIKeyWorkflow["Developer API Gateway Engine"]
        
        n8nWebhook --> JobOrchestrator
        n8nWebhook --> bKashWorkflow
        n8nWebhook --> APIKeyWorkflow
    end

    subgraph ExternalServices ["External Specialized APIs"]
        AI_API["Third-Party AI Background Removal Engine"]
        bKashPGW["Official bKash Merchant Payment Gateway"]
    end

    ReactApp -->|Dispatches Job Request with JWT & Image URL| n8nWebhook
    JobOrchestrator <-->|Validates Entitlements & Deducts Credits| SupaDB
    JobOrchestrator -->|Fetches Ephemeral Image & Requests Removal| AI_API
    AI_API -->|Returns Cutout PNG| JobOrchestrator
    JobOrchestrator -->|Uploads Transparent PNG Result| CloudinaryCDN
    JobOrchestrator -->|Updates Job Record (Completed / Failed)| SupaDB
    JobOrchestrator -->>|Returns Result JSON to Frontend| ReactApp

    ReactApp -->|Initiates Plan Purchase| n8nWebhook
    bKashWorkflow <-->|Creates bKash Payment URL| bKashPGW
    bKashPGW -->|Payment Callback / Return URL| bKashWorkflow
    bKashWorkflow <-->|Query Payment Status & Verify Signature| bKashPGW
    bKashWorkflow <-->|Idempotent Credit Addition / Transaction Log| SupaDB
```

---

## 3. Technology Stack & Responsibilities

| Domain | Technology | Core Responsibility |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite + TypeScript | Lightning-fast SPA rendering, type safety, modular component tree |
| **Styling & Design System** | Tailwind CSS + Shadcn UI + Lucide | Curated dark theme palette, responsive layouts, accessible UI primitives |
| **Client State** | Zustand | Global UI state (theme, active modals, upload queues, notification toasts) |
| **Server State & Cache** | TanStack Query (React Query) | Cache invalidation, query synchronization, optimistic UI updates |
| **Forms & Validation** | React Hook Form + Zod | Client-side input validation, file size/mime-type enforcement, schema typing |
| **Hosting & Edge CDN** | Vercel | Global CDN deployment, instant previews, SSL, Edge routing |
| **Auth & Authorization** | Supabase Auth (GoTrue) | JWT tokens, social OAuth (Google), email/password sessions, secure cookies |
| **Database & Security** | Supabase PostgreSQL + RLS | Relational data persistence, Row Level Security policies, database triggers |
| **Temporary Media CDN** | Cloudinary | Direct temporary asset uploads, automated 24-hour expiration lifecycle |
| **Backend & Workflows** | n8n Cloud | Secure orchestration, third-party API key protection, payment verification |
| **AI Removal Engine** | AI Removal API (e.g. Clipdrop / Remove.bg / Stability) | High-precision human, object, animal, and product background segmentation |
| **Payment Gateway** | Official bKash PGW (Tokenized API) | Bangladeshi Taka (BDT) checkout, verification, idempotent transaction auditing |

---

## 4. End-to-End Image Processing Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant React as React Frontend
    participant Cloud as Cloudinary
    participant n8n as n8n Cloud Workflow
    participant Supa as Supabase (DB & Auth)
    participant AI as AI Removal API

    User->>React: Drops image (JPG/PNG/WEBP, <10MB, <5000x5000)
    React->>React: Validates file type, dimensions & size (Zod)
    React->>Cloud: Direct upload temporary source image
    Cloud-->>React: Returns source_image_url
    
    React->>n8n: POST /webhook/process-image (JWT token, source_image_url)
    n8n->>Supa: Verify JWT token & check remaining user credits
    alt Insufficient Credits / Not Entitled
        Supa-->>n8n: Credits = 0 & Daily Free Limit Exceeded
        n8n-->>React: 402 Payment Required ("Insufficient Credits")
        React-->>User: Display Credit Top-Up / Upgrade Modal
    else Sufficient Credits
        Supa-->>n8n: Entitled -> Atomically reserve 1 credit & create job (pending)
        n8n->>AI: POST /remove-background (source_image_url)
        AI-->>n8n: Returns transparent PNG buffer
        n8n->>Cloud: Upload processed PNG to temporary bucket
        Cloud-->>n8n: Returns processed_image_url
        n8n->>Supa: Update job (status: 'completed', output_url, duration_ms)
        n8n->>Supa: Deduct credit ledger & record usage
        n8n-->>React: 200 OK (job_id, processed_image_url, metadata)
        React-->>User: Render interactive Before/After comparison slider
    end
```

---

## 5. Official bKash Payment Gateway Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant React as React Frontend
    participant n8n as n8n Cloud Payment Engine
    participant Supa as Supabase DB
    participant bKash as Official bKash Gateway

    User->>React: Selects Credit Pack / Plan & Clicks "Pay with bKash"
    React->>n8n: POST /webhook/bkash/create-payment (JWT, plan_id)
    n8n->>Supa: Query authoritative price & plan details (Never trust frontend price)
    n8n->>Supa: Insert pending transaction record (status: 'pending')
    n8n->>bKash: POST /tokenized/checkout/create (amount, invoiceNumber, callbackUrl)
    bKash-->>n8n: Returns paymentID & bkashURL redirect
    n8n-->>React: Return bkashURL
    React->>User: Redirects to official bKash Checkout UI
    
    User->>bKash: Enters bKash mobile number, OTP & PIN
    bKash->>n8n: Redirects to callbackUrl?paymentID=...&status=success
    n8n->>bKash: POST /tokenized/checkout/execute (paymentID)
    bKash-->>n8n: Returns trxID, transactionStatus ('Completed')
    
    n8n->>Supa: Check transaction status (IDEMPOTENCY CHECK)
    alt Already processed (Duplicate callback prevention)
        n8n-->>React: Redirect to /dashboard/billing?status=already_processed
    else First-time verification
        n8n->>Supa: Update transaction ('successful', trxID, provider_data)
        n8n->>Supa: Add credits to user wallet / activate plan
        n8n->>Supa: Insert immutable audit log
        n8n-->>React: Redirect to /dashboard/billing?status=success
    end
```

---

## 6. Database Schema & Normalization Plan

The database is built on **Supabase PostgreSQL** with comprehensive **Row Level Security (RLS)**.

```mermaid
erDiagram
    PROFILES ||--o{ PROCESSING_JOBS : "initiates"
    PROFILES ||--|| CREDITS : "owns"
    PROFILES ||--o{ TRANSACTIONS : "makes"
    PROFILES ||--o{ SUBSCRIPTIONS : "holds"
    PROFILES ||--o{ API_KEYS : "generates"
    PLANS ||--o{ SUBSCRIPTIONS : "defines"
    PLANS ||--o{ TRANSACTIONS : "purchased_in"
    API_KEYS ||--o{ API_USAGE : "tracks"

    PROFILES {
        uuid id PK "Matches auth.users(id)"
        text email
        text full_name
        text avatar_url
        text role "user | admin"
        timestamptz created_at
        timestamptz updated_at
    }

    CREDITS {
        uuid id PK
        uuid user_id FK
        integer free_daily_remaining
        integer purchased_credits
        date last_reset_date
        timestamptz updated_at
    }

    PROCESSING_JOBS {
        uuid id PK
        uuid user_id FK
        text status "pending | processing | completed | failed | expired"
        text original_image_url
        text processed_image_url
        integer duration_ms
        integer file_size_bytes
        text mime_type
        text failure_reason
        timestamptz created_at
        timestamptz expires_at
    }

    PLANS {
        uuid id PK
        text code "free | pro_monthly | credit_pack_100 | business"
        text name
        numeric price_bdt
        integer credits_included
        boolean is_recurring
        boolean is_active
        jsonb features
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid plan_id FK
        text provider "bkash"
        text provider_payment_id
        text provider_trx_id
        numeric amount_bdt
        text status "pending | successful | failed | cancelled | refunded"
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        uuid plan_id FK
        text status "active | past_due | canceled | expired"
        timestamptz current_period_start
        timestamptz current_period_end
        timestamptz canceled_at
    }

    API_KEYS {
        uuid id PK
        uuid user_id FK
        text key_prefix
        text hashed_key
        text name
        boolean is_active
        timestamptz last_used_at
        timestamptz created_at
    }

    API_USAGE {
        uuid id PK
        uuid api_key_id FK
        uuid user_id FK
        text endpoint
        integer status_code
        integer response_time_ms
        timestamptz created_at
    }

    WEBHOOK_EVENTS {
        uuid id PK
        text provider "bkash | n8n | ai_provider"
        text event_type
        jsonb payload
        boolean processed
        timestamptz created_at
    }

    SYSTEM_LOGS {
        uuid id PK
        text log_level "info | warn | error | fatal"
        text source "frontend | n8n | db"
        text message
        jsonb context
        timestamptz created_at
    }
```

---

## 7. Security & Compliance Architecture

1. **No Sensitive Keys on Client**:
   - `SUPABASE_SERVICE_ROLE_KEY`: Stored exclusively in n8n Cloud.
   - `AI_API_SECRET_KEY`: Stored exclusively in n8n Cloud.
   - `BKASH_APP_SECRET` & `BKASH_PASSWORD`: Stored exclusively in n8n Cloud.
   - The Frontend only receives `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. **Row Level Security (RLS)**:
   - All tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
   - Default policy is `DENY ALL`.
   - Users can only `SELECT` and `UPDATE` records where `auth.uid() = user_id`.
   - Admin routes utilize custom claims (`app_metadata.role = 'admin'`).
3. **Payment Idempotency**:
   - Every transaction has a unique `provider_payment_id` and database unique constraints.
   - Incoming webhook execution checks status before modifying credits to prevent double-crediting.
4. **Data Minimization & Ephemeral Storage**:
   - Source images and output cutouts are permanently deleted from Cloudinary storage after 24 hours.
   - Database stores metadata (dimensions, file type, duration, status) without permanent raw image blobs.
