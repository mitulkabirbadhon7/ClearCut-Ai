# Production Deployment & Hosting Guide — ClearCut AI

## 1. Overview
ClearCut AI is compiled as a static Single-Page Application (SPA) with in-browser neural AI acceleration, connecting to Supabase PostgreSQL, Cloudinary Ephemeral Storage, and n8n Cloud Automation.

---

## 2. Production Environment Variables Checklist

Configure these in your hosting provider (e.g. Vercel / Netlify / Cloudflare Pages):

| Variable Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_SUPABASE_URL` | **Yes** | Supabase Project REST Endpoint | `https://asnlfskuuvrthmgvdubc.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Supabase Public Anonymous Key | `eyJhbGciOi...` |
| `VITE_CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary Cloud Name | `ivwgjnw8` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | **Yes** | Unsigned Ephemeral Upload Preset | `clearcut_uploads` |
| `VITE_N8N_WEBHOOK_URL` | Optional | n8n Background Removal Webhook | `https://your-n8n.cloud/webhook/...` |
| `VITE_N8N_BKASH_CREATE_URL` | Optional | n8n bKash Create Payment Webhook | `https://your-n8n.cloud/webhook/bkash-create-payment` |
| `VITE_N8N_BKASH_EXECUTE_URL` | Optional | n8n bKash Execute Payment Webhook | `https://your-n8n.cloud/webhook/bkash-execute-payment` |

---

## 3. Deploying to Vercel (Recommended)

1. Push your code to GitHub (`main` branch).
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import the repository `mitulkabirbadhon7/SnapCut`.
4. Set the Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add the variables from the table above.
6. Click **Deploy**!

---

## 4. Deploying to Netlify

1. In [netlify.com](https://netlify.com), click **Add new site** ➔ **Import an existing project**.
2. Select your GitHub repository.
3. Configure Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add your Environment Variables under **Site Settings ➔ Environment Variables**.
5. Deploy Site.

---

## 5. Security & Ephemeral Storage Guarantees
- **Zero-Trust**: No service role keys or payment gateway secrets are exposed in browser bundles.
- **24-Hour Purge**: Ephemeral images uploaded to Cloudinary are purged every 24 hours.
- **RLS Enabled**: All PostgreSQL tables enforce Row Level Security.
