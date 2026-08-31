# Architecture Decision Records (ADRs) — SnapCut AI

This document records the foundational architectural, technological, and design decisions made for the SnapCut AI project, including the context, rationale, and consequences of each choice.

---

## ADR-001: Serverless Orchestration (n8n Cloud + Supabase) vs. Custom Backend Server

### Status: Accepted
### Context:
SnapCut AI is a high-performance AI SaaS product focused on fast background removal, credit management, and bKash payments. Building a custom VPS-based Node.js (Express), Python (FastAPI), or Django backend incurs significant operational overhead (DevOps, Linux server security patching, process monitoring, Docker/Kubernetes management, reverse proxy configuration) which distracts from shipping core product value.

### Decision:
We choose a modern managed serverless architecture:
- **Frontend**: React + Vite + TypeScript hosted on **Vercel** Edge.
- **Identity & Data**: **Supabase** (Managed PostgreSQL, GoTrue Auth, Row Level Security).
- **Business Automation & Secret Management**: **n8n Cloud** workflows.

### Consequences:
- **Pros**:
  - Zero server maintenance, zero VPS security patch burdens.
  - Third-party API keys (AI Provider, bKash credentials, Supabase service role) remain completely isolated in n8n Cloud credentials.
  - Visual debugging and replayable webhook execution logs in n8n.
  - Automatic scaling and fast edge delivery.
- **Cons**:
  - Dependent on n8n Cloud and Supabase availability.
  - Complex custom business logic must be modularized into discrete n8n sub-nodes or Supabase Database Functions.

---

## ADR-002: Ephemeral 24-Hour Image Retention via Cloudinary

### Status: Accepted
### Context:
Users upload sensitive, personal, or proprietary e-commerce photos for background removal. Storing millions of user images permanently causes exponential cloud storage costs, security liabilities, and GDPR/privacy concerns.

### Decision:
SnapCut AI will operate under a strict **Ephemeral Media Storage Policy**:
1. Uploaded original images and processed PNG cutouts are stored in **Cloudinary** temporary storage.
2. Assets are tagged with auto-expiration policies (TTL: 24 hours maximum).
3. The PostgreSQL database stores only metadata (resolution, processing time, file size, timestamps).
4. History views indicate `"File expired"` once the 24-hour window lapses.

### Consequences:
- **Pros**:
  - Near-zero long-term storage cost.
  - High user trust and compliance with modern privacy standards.
  - Fast CDN delivery through Cloudinary transformation and edge caching.
- **Cons**:
  - Users cannot re-download ancient images without re-processing. (Clearly communicated in UI).

---

## ADR-003: Official bKash Tokenized Payment Gateway vs. Razorpay / Manual Transfers

### Status: Accepted
### Context:
The primary target market for SnapCut AI launch is Bangladesh. International payment gateways like Stripe or Razorpay either do not natively support Bangladeshi Taka (BDT) mobile financial services or require foreign corporate entities. Manual "Send Money" methods introduce high fraud rates, manual verification delays, and poor user trust.

### Decision:
Integrate exclusively with the **Official bKash Payment Gateway** (Merchant Tokenized Checkout API).
- All checkout flows generate signed merchant payment requests via n8n backend.
- Payment execution callbacks are verified via bKash `/execute` and `/query` endpoints before granting credits.
- Razorpay and manual transfers are strictly excluded from the architecture.

### Consequences:
- **Pros**:
  - 100% native frictionless payment for millions of Bangladeshi freelancers, e-commerce sellers, and agencies.
  - Automated, instant credit delivery upon payment confirmation.
  - Full audit trail with immutable bKash `trxID` records.
- **Cons**:
  - Requires approved bKash merchant credentials and API onboarding.
  - Sandbox testing environment must be rigorously verified before production release.

---

## ADR-004: Zero-Trust Client Model & Authoritative Server-Side Pricing

### Status: Accepted
### Context:
Client-side web applications are vulnerable to payload tampering (e.g., modifying price, credit quantity, or user IDs via DevTools or custom curl requests).

### Decision:
The React frontend is treated strictly as an untrusted presentation layer.
1. The frontend never sends credit balance changes or price amounts to the backend.
2. The frontend sends only `plan_id` and the user's verified `JWT`.
3. The backend (n8n / Supabase PostgreSQL) retrieves the authoritative price from the `plans` database table.
4. Credit deductions and additions occur atomically in PostgreSQL transactions with check constraints preventing negative balances (`credits >= 0`).

### Consequences:
- **Pros**:
  - Immune to client-side credit tampering and price manipulation.
  - Financial records match exact gateway invoices.
- **Cons**:
  - Requires strict database constraints and centralized plan ID schemas.

---

## ADR-005: Curated Dark-Mode First UI with Tailwind CSS & Shadcn UI

### Status: Accepted
### Context:
AI tools require a sleek, modern, professional visual language that creates immediate user confidence without feeling like a generic template or a blinding neon interface.

### Decision:
Implement a dark-first design system utilizing:
- **Tailwind CSS** for atomic, responsive styling.
- **Inter** typography for crisp readability.
- **Curated Palette**:
  - Dark Slate Background: `#020617`
  - Card Surfaces: `#0F172A` / Elevated `#172033`
  - Vibrant Brand Accent Gradient: `#22D3EE` -> `#2563EB` -> `#7C3AED` -> `#D946EF`
  - Text: `#F8FAFC` (Primary), `#94A3B8` (Muted)
- **Shadcn UI & Radix UI primitives** for accessible, headless components (Dialogs, Dropdowns, Tooltips, Sliders).

### Consequences:
- **Pros**:
  - Ultra-high visual polish, modern aesthetic, WCAG-compliant contrast.
  - Zero heavy monolithic UI framework bloat.
  - Full control over responsive breakpoints (360px mobile up to 4K ultra-wide).

---

## ADR-006: State Management Strategy — Zustand & TanStack Query

### Status: Accepted
### Context:
Modern web applications have two distinct state requirements: local client state (modals, active image slider positions, upload queue progress) and asynchronous server cache (user profile, credit balances, history, active transactions).

### Decision:
- **Zustand**: Lightweight, boilerplate-free global store for client-only state (drag-drop active status, preview comparison slider mode, toast notifications).
- **TanStack Query (React Query)**: For all asynchronous server queries, automatic background revalidation, optimistic updates, and cache invalidation upon credit consumption or payment completion.

### Consequences:
- **Pros**:
  - Clean separation of concerns.
  - Zero prop drilling.
  - Automatic query retries and synchronization with Supabase and n8n endpoints.

---

## ADR-007: Phase-by-Phase Git Branching & Verification Strategy

### Status: Accepted
### Context:
Complex SaaS applications risk accumulating hidden regressions when features are built simultaneously without iterative testing and documentation.

### Decision:
Adopt a strict 17-Phase Development Plan (Phase 0 to Phase 16).
- Standard branch model: `main` (production-ready), `develop` (integration), and `feature/<feature-name>`.
- Every phase must satisfy: **Plan -> Implement -> Run -> Test -> Verify -> Document -> Commit -> Push -> Phase Complete**.
- Automated and browser-based manual testing verified before merging into `develop` / `main`.

### Consequences:
- **Pros**:
  - Total visibility and step-by-step mentoring for the developer.
  - Zero untested code merged into the codebase.
  - Complete Git history with semantic commit messages.
