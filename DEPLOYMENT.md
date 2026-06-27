# Deploying to Render (Frontend + Backend)

This guide covers deploying both services to [Render](https://render.com) and fixing the most common **Clerk auth** issues on production.

> **Note:** Deployment must be done from your Render account. This repo includes a `render.yaml` blueprint, but you still connect your GitHub repo and set secret env vars in the Render dashboard.

---

## Why Clerk Often Fails on Render

These are the top causes, in order of frequency:

### 1. Missing `VITE_CLERK_PUBLISHABLE_KEY` at **build time**

Vite replaces `import.meta.env.VITE_*` variables **when you run `npm run build`**, not at runtime.

If you add the key in Render **after** the first deploy, or only as a runtime variable, the built JS bundle still has `undefined` for the Clerk key → auth never initializes.

**Fix:**

1. Render Dashboard → your **Static Site** → **Environment**
2. Add `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` (from [Clerk Dashboard](https://dashboard.clerk.com) → API Keys)
3. Click **Manual Deploy → Clear build cache & deploy**

You should **not** see the "Frontend configuration error" screen after a correct deploy.

---

### 2. Clerk Dashboard domain not configured for your Render URL

Clerk only allows auth on domains you register.

**Fix in Clerk Dashboard → Configure → Domains / Paths:**

| Setting | Value (example) |
|---------|-----------------|
| Frontend URL | `https://ai-mock-interview-web.onrender.com` |
| Sign-in URL | `/login` |
| Sign-up URL | `/signup` |
| After sign-in | `/dashboard` |
| After sign-up | `/dashboard` |

Also add your Render URL under **Allowed origins** / **Authorized redirect URLs** if your Clerk plan shows those fields.

Use **`https://`** (not `http://`). Render free URLs look like `https://your-app.onrender.com`.

---

### 3. Frontend API still points to `/api` (dev proxy only)

Locally, Vite proxies `/api` → `localhost:5000`. On Render, there is **no proxy** unless you configure one.

If `VITE_API_URL` is not set in production, the browser calls `https://your-frontend.onrender.com/api/...` which does not exist.

**Fix:**

Set on the **frontend** static site (build-time env var):

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

Redeploy frontend after setting this.

---

### 4. Backend CORS blocks the frontend

The backend only accepts requests from origins listed in `CLIENT_URL`.

**Fix on backend Web Service:**

```env
CLIENT_URL=https://YOUR-FRONTEND.onrender.com
```

No trailing slash. Redeploy backend after changing.

---

### 5. React Router 404 on refresh (`/login`, `/dashboard`)

Static hosts must rewrite all routes to `index.html`. This repo includes:

- `frontend/public/_redirects`
- `render.yaml` rewrite rule `/* → /index.html`

If `/login` returns 404 on refresh, confirm the Render static site has the rewrite rule enabled.

---

## Deployment Order

Deploy in this order to avoid chicken-and-egg env var issues:

```
1. Backend  → get https://ai-mock-interview-api.onrender.com
2. Frontend → set VITE_API_URL to backend URL + /api
3. Backend  → set CLIENT_URL to frontend URL
4. Clerk    → add frontend Render URL
5. Redeploy both after env changes
```

---

## Option A — Deploy with `render.yaml` (Blueprint)

1. Push this repo to GitHub.
2. Render Dashboard → **New → Blueprint**
3. Connect the repo; Render reads `render.yaml`
4. Set secret env vars when prompted:
   - Backend: `DATABASE_URL`, `GROQ_API_KEY`, `CLIENT_URL`
   - Frontend: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`
5. Deploy backend first; copy its URL into frontend `VITE_API_URL`
6. Copy frontend URL into backend `CLIENT_URL`
7. Redeploy both

---

## Option B — Manual setup (two services)

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| Type | Web Service |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

**Environment variables:**

```env
DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
GROQ_API_KEY=gsk_...
CLIENT_URL=https://YOUR-FRONTEND.onrender.com
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_WHISPER_MODEL=whisper-large-v3
GROQ_CHAT_MODEL=llama-3.1-8b-instant
MAX_AUDIO_BYTES=8388608
```

Render sets `PORT` automatically — do not hardcode it.

---

### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| Type | Static Site |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**Environment variables (build time):**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

**Rewrite rule (required for React Router):**

| Source | Destination |
|--------|-------------|
| `/*` | `/index.html` |

---

## Clerk Dashboard Checklist

- [ ] Publishable key copied to Render frontend env (`VITE_CLERK_PUBLISHABLE_KEY`)
- [ ] Production domain = your Render frontend URL
- [ ] Sign-in path = `/login`, sign-up path = `/signup`
- [ ] Redirect after auth = `/dashboard`
- [ ] Frontend redeployed **after** adding env vars (clear build cache)

---

## Verify Production

1. Open `https://YOUR-BACKEND.onrender.com/api/health`
   - Expect: `{ "status": "ok", "dbConnected": true, "groqConfigured": true }`

2. Open frontend → `/login`
   - Clerk sign-in UI loads (not blank page, not config error)

3. Sign in → lands on `/dashboard`

4. Create interview → API calls go to backend URL (check browser Network tab)

---

## Render Free Tier Notes

- Backend **spins down** after inactivity; first request may take 30–60 seconds (cold start).
- Free static sites stay up; free web services sleep.
- Neon PostgreSQL free tier works well with this project (already configured via `DATABASE_URL`).

---

## Can Cursor Deploy for You?

No — deployment requires **your** Render account, GitHub repo access, and secret keys (Groq, Clerk, Neon). This repo provides configs and docs; you connect Render to GitHub and paste secrets in the dashboard.

If Clerk still fails after following this guide, check the browser **Console** tab:

| Error | Likely cause |
|-------|----------------|
| `Missing publishableKey` | `VITE_CLERK_PUBLISHABLE_KEY` missing at build |
| CORS error on `/api/*` | Wrong `CLIENT_URL` on backend |
| 404 on `/api/*` | Wrong or missing `VITE_API_URL` on frontend |
| Clerk "invalid redirect" | Render URL not added in Clerk Dashboard |
