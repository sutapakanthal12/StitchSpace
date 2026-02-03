# Backend Deployment on Render - Complete Guide

## Prerequisites
- GitHub repository pushed (✅ Done: sutapakanthal12/StitchSpace)
- Render account (create at https://render.com)
- MongoDB Atlas URI with credentials
- All environment variables ready

---

## Step 1: Create a Web Service on Render

1. Go to https://render.com and log in with GitHub
2. Click **"+ New"** → **"Web Service"**
3. Connect your GitHub repository: `sutapakanthal12/StitchSpace`
4. Fill in the details:
   - **Name**: `stitchspace-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (optional, for testing)

---

## Step 2: Set Environment Variables in Render

In the Render dashboard, go to **Environment** and add these variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stitchspace?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
STRIPE_SECRET_KEY=sk_test_xxxxx (or sk_live_xxxxx for production)
RAZORPAY_KEY_ID=razorpay_key_id
RAZORPAY_KEY_SECRET=razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=https://stitch-space-isew.vercel.app
NODE_ENV=production
PORT=10000
```

---

## Step 3: Configure CORS in Backend

The backend already has CORS configured in `server.js`:

```javascript
const allowedOrigins = [
  "http://localhost:3000",           // Local development
  "https://stitch-space-isew.vercel.app", // Vercel deployment
];
```

**When your Vercel URL changes**, update this list and redeploy.

---

## Step 4: Deploy on Render

1. After setting all environment variables, click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for the build to complete (check **Logs**)
4. Once deployed, you'll get a URL like: `https://stitchspace-api.onrender.com`

---

## Step 5: Update Frontend with Backend URL

### In `.env.production`:
```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

### In Vercel Environment Variables:
Go to Vercel → Project Settings → Environment Variables, add:
```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

---

## Running Backend Locally (Development)

### Command:
```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace
npm install
node server.js
```

### Expected Output:
```
MongoDB connected
Server is running on http://localhost:5000
```

### Environment Variables (Local):
Create a `.env` file in the root directory:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stitchspace
JWT_SECRET=your-dev-secret
STRIPE_SECRET_KEY=sk_test_xxxxx
NODE_ENV=development
PORT=5000
```

---

## Running Backend on Render (Production)

### Automatic Deployment:
- Push to GitHub → Render auto-detects → builds and deploys
- Monitor in Render dashboard → **Logs**

### Manual Redeploy:
1. Go to Render dashboard
2. Click your service → **Manual Deploy** → **Deploy latest commit**

### Health Check:
```bash
curl https://stitchspace-api.onrender.com/api/health
```

Expected response:
```json
{"status": "Server is running"}
```

---

## Testing Endpoints Locally

```bash
# Health check
curl http://localhost:5000/api/health

# Login (example)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails on Render | Check logs, verify `npm install` and `node server.js` work locally |
| CORS errors | Update `allowedOrigins` in `server.js` with your Vercel URL |
| MongoDB connection timeout | Verify IP whitelist in MongoDB Atlas includes Render's IPs (0.0.0.0/0) |
| Port binding error | Render uses PORT from env vars; default is 10000, set to 5000 in .env |
| Environment vars not found | Ensure vars are set in Render dashboard before deploying |

---

## Important URLs

- **Frontend (Vercel)**: https://stitch-space-isew.vercel.app
- **Backend (Render)**: https://stitchspace-api.onrender.com
- **Local Backend**: http://localhost:5000
- **Local Frontend**: http://localhost:3000

---

## Quick Reference Commands

### Local Backend
```bash
# Development
cd StitchSpace
npm install
node server.js

# Production build (Render handles this)
npm install --production
node server.js
```

### Frontend Pointing to Local Backend
```bash
# In client/.env.development:
REACT_APP_API_URL=http://localhost:5000

# In client/.env.production:
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

---

## Next Steps
1. ✅ Backend server.js configured with CORS
2. ⏳ Deploy backend to Render (follow Step 1-4)
3. ⏳ Add Render URL to Vercel environment variables
4. ⏳ Test login/registration on both local and production
5. ⏳ Monitor logs for any errors

