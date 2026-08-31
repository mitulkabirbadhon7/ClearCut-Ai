# ClearCut AI ⚡

> **Fast + Simple + Professional AI-Powered Image Background Removal Platform**

[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![bKash](https://img.shields.io/badge/Payment-bKash%20PGW-E2136E)](https://developer.bkash.com/)

---

## 🌟 Overview

**ClearCut AI** is a production-ready AI SaaS application that allows e-commerce sellers, marketers, graphic designers, and content creators to remove image backgrounds with high precision in one click.

Engineered with a serverless, privacy-first architecture, ClearCut AI delivers instant cutouts with transparent PNG exports, an ephemeral 24-hour media lifecycle, a robust credit engine, and native **bKash Payment Gateway** integration for Bangladesh and global expansion.

---

## 🚀 Core Features

- ⚡ **One-Click AI Background Removal**: High-precision segmentation of subjects, products, portraits, and graphics.
- 🔍 **Interactive Before/After Comparison**: Real-time slider and transparent checkerboard preview.
- 🔒 **Privacy-First Ephemeral Storage**: Images are processed in temporary Cloudinary buckets with a strict 24-hour auto-purge policy.
- 💳 **Official bKash Payment Gateway**: Direct checkout with automated, idempotent credit top-ups in Bangladeshi Taka (BDT).
- 🛡️ **Supabase Auth & RLS Security**: Email/Password and Google OAuth with PostgreSQL Row Level Security.
- 📊 **User & Admin Dashboards**: Complete job history, usage analytics, credit management, and audit logs.
- ⚙️ **Developer API**: Hashed API keys, quota management, and rate-limited endpoints for programmatic background removal.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, Lucide Icons |
| **State Management** | Zustand (Client UI State), TanStack Query v5 (Server Data Cache) |
| **Forms & Validation** | React Hook Form, Zod |
| **Identity & Database** | Supabase Auth (JWT / OAuth), Supabase PostgreSQL (with RLS) |
| **Business Logic & AI** | n8n Cloud Webhooks, Third-Party AI Background Removal Engine |
| **Ephemeral Media** | Cloudinary Temporary Storage (24-hour auto-purge) |
| **Payment Gateway** | Official bKash Tokenized Merchant API |
| **Deployment** | Vercel (Edge CDN) |

---

## 🏗️ System Architecture

```
USER BROWSER (React + Vite + TypeScript on Vercel)
   │
   ├──► Direct Auth & Queries (with RLS) ──► Supabase Auth & PostgreSQL
   ├──► Direct Ephemeral Upload ────────────► Cloudinary (24h Retention)
   └──► Secure Job / Payment Requests ──────► n8n Cloud Automation Engine
                                                  ├──► AI Background Removal API
                                                  ├──► Supabase DB (Credit Ledger)
                                                  ├──► Cloudinary (Result Upload)
                                                  └──► Official bKash Gateway
```

---

## 📋 17-Phase Development Plan

- [x] **PHASE 0**: Environment Setup & Foundation Verification
- [ ] **PHASE 1**: GitHub + Project Foundation (`develop` & `main`, Vite + React + TS)
- [ ] **PHASE 2**: Design System & UI Foundation (Tailwind palette, typography, components)
- [ ] **PHASE 3**: High-Conversion Landing Page & Before/After Demos
- [ ] **PHASE 4**: Supabase Authentication (Email/Password, Google OAuth, Protected Routes)
- [ ] **PHASE 5**: PostgreSQL Database Foundation & Row Level Security (RLS)
- [ ] **PHASE 6**: Client Image Upload Engine & Validation Pipeline
- [ ] **PHASE 7**: n8n Cloud Automation Engine & AI Background Removal Integration
- [ ] **PHASE 8**: Interactive Result Engine, Checkerboard Preview & Processing History
- [ ] **PHASE 9**: User Dashboard & Processing Analytics
- [ ] **PHASE 10**: Authoritative Credit System & Consumption Engine
- [ ] **PHASE 11**: Official bKash Payment Gateway Integration & Audit Flow
- [ ] **PHASE 12**: Developer API Engine, Key Hashing & Rate Limiting
- [ ] **PHASE 13**: Admin Panel, Metric Dashboards & Audit Log Monitor
- [ ] **PHASE 14**: Security Hardening, Audit & Automated Tests
- [ ] **PHASE 15**: Vercel DevOps, CI/CD Pipeline & Production Deployment
- [ ] **PHASE 16**: Final Production Verification, Performance & SEO Audit

---

## 💻 Local Development Setup

### Prerequisites
Make sure the following tools are installed on your machine:
- **Node.js**: `v20.x` or higher (Installed: `v24.19.0`)
- **npm**: `v10.x` or higher (Installed: `v11.6.2`)
- **Git**: `v2.x` (Installed: `v2.53.0`)

### Verification Commands
```bash
node --version
npm --version
git --version
```

### Initializing the Project (Phase 1)
```bash
# Clone the repository (or navigate to workspace)
cd SnapCut-AI

# Install dependencies (once initialized in Phase 1)
npm install

# Start local development server
npm run dev
```

---

## 📁 Key Documentation

- [`PROJECT_TRACKER.txt`](file:///d:/Development/New%20folder/Remove_BG/PROJECT_TRACKER.txt) — Comprehensive development journal and phase tracking.
- [`SETUP_CHECKLIST.txt`](file:///d:/Development/New%20folder/Remove_BG/SETUP_CHECKLIST.txt) — External service credentials and deployment checklist.
- [`ARCHITECTURE.md`](file:///d:/Development/New%20folder/Remove_BG/ARCHITECTURE.md) — Complete architectural diagrams, data flows, and security model.
- [`DECISIONS.md`](file:///d:/Development/New%20folder/Remove_BG/DECISIONS.md) — Architecture Decision Records (ADRs) explaining technical choices.

---

## 📄 License & Ownership

**Project Owner**: MD Mitul Kabir Badhon  
**Application**: ClearCut AI  
**All Rights Reserved.**
