# Deploy Fraud Watch Dashboard (Public Access)

Deploy the **frontend** to Vercel and the **backend** to Render so the app is publicly accessible. Both have free tiers.

---

## Prerequisites

- A **GitHub** account
- Your project pushed to a GitHub repository

If the project is not on GitHub yet:

```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fraud-watch-dashboard.git
git branch -M main
git push -u origin main
```

---

## Step 1: Deploy the Backend (Render)

1. Go to **[render.com](https://render.com)** and sign up / log in (GitHub login is easiest).

2. Click **New** → **Web Service**.

3. Connect your GitHub repo:
   - Select the `fraud-watch-dashboard` repository.
   - If asked, authorize Render to access it.

4. Configure the service:
   - **Name:** `fraud-watch-api` (or any name).
   - **Region:** Choose closest to you.
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

5. **Environment variables** (Environment tab):
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = leave empty for now; you’ll set it after deploying the frontend (e.g. `https://your-app.vercel.app`).

6. Click **Create Web Service**. Wait for the first deploy to finish.

7. Copy your backend URL (e.g. `https://fraud-watch-api.onrender.com`). You’ll need it for the frontend.

8. **After Step 2**, come back to Render → your service → **Environment** and set:
   - `CORS_ORIGIN` = your Vercel frontend URL (e.g. `https://fraud-watch-dashboard.vercel.app`).
   - Save; Render will redeploy.

---

## Step 2: Deploy the Frontend (Vercel)

1. Go to **[vercel.com](https://vercel.com)** and sign up / log in (GitHub is easiest).

2. Click **Add New** → **Project**.

3. Import your GitHub repo:
   - Select `fraud-watch-dashboard`.
   - Click **Import**.

4. Configure the project:
   - **Framework Preset:** Vite (should be auto-detected).
   - **Root Directory:** leave as `.` (project root).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment variables**:
   - Name: `VITE_API_URL`
   - Value: your Render backend URL from Step 1, e.g. `https://fraud-watch-api.onrender.com`
   - Do **not** add a trailing slash.

6. Click **Deploy**. Wait until the deployment finishes.

7. Copy your frontend URL (e.g. `https://fraud-watch-dashboard.vercel.app`).

8. In **Render** (Step 1), set:
   - `CORS_ORIGIN` = your Vercel URL (e.g. `https://fraud-watch-dashboard.vercel.app`).
   - Save so the backend redeploys with the correct CORS.

---

## Step 3: Verify

1. Open your **Vercel** URL in a browser.
2. Upload a CSV (with columns: `transaction_id`, `sender_id`, `receiver_id`, `amount`, `timestamp`).
3. Click **Analyze**. You should see results and no “failed to fetch” errors.

**Backend health check:**  
Open `https://YOUR-RENDER-URL/health` in the browser. You should see something like:  
`{"status":"ok","timestamp":"..."}`

---

## Optional: Deploy with Netlify (Frontend)

If you prefer Netlify instead of Vercel:

1. Go to **[netlify.com](https://netlify.com)** → **Add new site** → **Import an existing project**.
2. Connect the same GitHub repo.
3. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variable:** `VITE_API_URL` = your Render backend URL (e.g. `https://fraud-watch-api.onrender.com`).
4. Deploy. Then set `CORS_ORIGIN` on Render to your Netlify URL (e.g. `https://your-site.netlify.app`).

---

## Summary

| Part      | Platform | URL you get              | Env vars |
|----------|----------|---------------------------|----------|
| Frontend  | Vercel   | `https://xxx.vercel.app`  | `VITE_API_URL` = backend URL |
| Backend   | Render   | `https://xxx.onrender.com`| `CORS_ORIGIN` = frontend URL |

After both are deployed and `CORS_ORIGIN` is set, the site is publicly accessible and the app will work from anywhere.

---

## Notes

- **Render free tier:** The backend may “spin down” after ~15 minutes of no traffic. The first request after that can take 30–60 seconds; later requests are fast. Paid plans keep the service always on.
- **Vercel:** The frontend is served from a CDN and stays fast.
- To use a **custom domain**, configure it in the Vercel (frontend) and/or Render (backend) dashboards and set `CORS_ORIGIN` and `VITE_API_URL` to match your domains.
