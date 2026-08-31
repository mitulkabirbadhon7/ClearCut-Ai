# Deployment & DevOps Guide — SnapCut AI

## 1. Overview
SnapCut AI utilizes a modern serverless deployment pipeline combining **GitHub** for version control, **Vercel** for edge hosting, **Supabase** for database hosting, and **n8n Cloud** for backend workflows.

---

## 2. GitHub Workflow & Branching Strategy

```
main (Production Release)
  ▲
  │ (Merge via PR when phase is complete & tested)
develop (Integration Branch)
  ▲
  │ (Merge feature branch upon feature verification)
feature/<feature-name> (Local Development)
```

### Rules:
1. Never commit broken code directly to `main` or `develop`.
2. Always test build locally (`npm run build` / `npm run lint`) prior to pushing.
3. Every commit must follow semantic conventions (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

---

## 3. Vercel Production Deployment Setup

1. **Connect Repository**: Link the GitHub repository (`SnapCut`) in Vercel.
2. **Framework Preset**: Vite.
3. **Build Command**: `npm run build`.
4. **Output Directory**: `dist`.
5. **Environment Variables**: Configure all `VITE_` variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - `VITE_N8N_WEBHOOK_URL`
   - `VITE_APP_URL`
