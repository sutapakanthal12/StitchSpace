# Vercel Frontend Configuration - Environment Variables

## Overview
Your React frontend on Vercel needs to know where your backend API is. This guide shows how to set up environment variables.

---

## Step 1: Add Environment Variable to Vercel

1. Go to https://vercel.com and select your **StitchSpace** project
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://stitchspace-api.onrender.com` (your Render backend URL)
   - **Environments**: Select `Production`
4. Click **Save**

---

## Step 2: Verify Local Environment Files

### `.env.development` (Local development)
```
CI=false
REACT_APP_API_URL=http://localhost:5000
```

### `.env.production` (Local production build)
```
CI=false
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

Vercel's environment variables will **override** `.env.production` on deployment.

---

## Step 3: Trigger Redeploy

After adding the environment variable:
1. Go to Vercel → **Deployments**
2. Click the latest deployment
3. Click **Redeploy** (this ensures the new env var is picked up)

---

## Step 4: Verify the Setup

After redeployment, test the API connection:

### In Browser Console:
```javascript
// This should show your Render backend URL
console.log(process.env.REACT_APP_API_URL);
```

### Test Login:
1. Go to your Vercel URL: https://stitch-space-isew.vercel.app
2. Click **Login**
3. Enter valid credentials
4. Check browser DevTools → **Network** tab
5. Look for requests to `/api/auth/login` - the URL should be `https://stitchspace-api.onrender.com/api/auth/login`

---

## How It Works

### Development (Local)
```
Browser → Frontend (http://localhost:3000)
        → Backend (http://localhost:5000)
        [REACT_APP_API_URL from .env.development]
```

### Production (Vercel + Render)
```
Browser → Frontend (https://stitch-space-isew.vercel.app)
        → Backend (https://stitchspace-api.onrender.com)
        [REACT_APP_API_URL from Vercel env vars]
```

---

## Checking What Your App Uses

In your app's code (`App.js`):
```javascript
import { API_CONFIG } from "./config/apiConfig";

axios.defaults.baseURL = API_CONFIG.BASE_URL;
// API_CONFIG.BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
```

This means:
- **Vercel production**: Uses `REACT_APP_API_URL` from Vercel environment variables
- **Local development**: Uses `http://localhost:5000` (from `.env.development`)
- **Fallback**: If no env var, uses `http://localhost:5000`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Getting CORS error on Vercel | 1. Check backend CORS allows your Vercel URL<br>2. Verify `REACT_APP_API_URL` is set in Vercel<br>3. Redeploy |
| Env var not being picked up | 1. Redeploy the project<br>2. Check if it's in the correct environment (Production)<br>3. Clear Vercel cache (Settings → Git → Disconnect/Reconnect) |
| 404 on API calls | Check if `REACT_APP_API_URL` is pointing to correct Render backend URL |
| Localhost still being used on Vercel | 1. Add `REACT_APP_API_URL` to Vercel env vars<br>2. Make sure it's in Production environment<br>3. Redeploy |

---

## Quick Commands Reference

### Build locally to test:
```bash
cd client
npm run build
# This creates a production build using .env.production
```

### Test on Vercel:
1. Push to GitHub
2. Vercel auto-deploys
3. Check if `REACT_APP_API_URL` env var is set
4. Monitor deployment logs

---

## Complete Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL: `https://stitchspace-api.onrender.com`
- [ ] `REACT_APP_API_URL` added to Vercel env vars
- [ ] Vercel project redeployed
- [ ] Tested login on https://stitch-space-isew.vercel.app
- [ ] No CORS errors in browser console
- [ ] API calls go to Render backend (check Network tab)

