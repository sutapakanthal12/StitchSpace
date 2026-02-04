# Railway Backend Deployment - MERN Project Guide

## Project Structure
```
StitchSpace/
├── /api                    ← Backend API (deploy on Railway)
│   ├── server.js          ✅ Clean Express server
│   ├── package.json       ✅ Backend dependencies only
│   ├── railway.json       ✅ Railway deployment config
│   ├── .railwayignore     ✅ Clean build files
│   └── vercel.json        ✅ (Legacy - for reference)
│
├── /client                ← Frontend (deployed on Vercel)
│   ├── src/
│   ├── public/
│   ├── package.json       ❌ DO NOT MODIFY
│   └── build/
│
├── /routes                ← API routes (used by /api)
├── /models                ← MongoDB models
├── /middleware            ← Express middleware
├── .env                   ← Environment variables
└── package.json           ← Root (monorepo config)
```

## What Was Fixed ✅

### 1. **Backend Root Directory: `/api`**
- ✅ Clean Express server at `/api/server.js`
- ✅ Backend-only `package.json` at `/api/package.json`
- ✅ Removed React build serving code
- ✅ Removed `path` import (no longer needed)

### 2. **Express Server Configuration (`/api/server.js`)**
- ✅ Clean API-only setup (no frontend serving)
- ✅ Listens on `process.env.PORT || 5000`
- ✅ CORS configured for Vercel: `https://stitch-space-isew.vercel.app`
- ✅ MongoDB connection with retry logic
- ✅ All 8 API routes properly configured
- ✅ Health check endpoint: `/api/health`
- ✅ 404 handler for undefined routes
- ✅ App exported for testing

### 3. **Backend Package.json (`/api/package.json`)**
- ✅ Backend dependencies only (no React)
- ✅ Node.js 18.x engine specified
- ✅ Start script: `"start": "node server.js"`
- ✅ Dev script: `"dev": "nodemon server.js"`
- ✅ All required packages included:
  - express, mongoose, cors, dotenv
  - bcryptjs, jsonwebtoken, multer
  - nodemailer, razorpay, stripe, axios

### 4. **Railway Configuration**
- ✅ `/api/railway.json` created with proper settings
- ✅ Build command: `npm install`
- ✅ Start command: `npm start`
- ✅ Auto-restart on failure enabled

### 5. **Removed Vercel-Specific Config**
- ✅ Updated `/api/vercel.json` to generic config
- ✅ Removed Vercel build specifications
- ✅ Removed Vercel environment variable references

### 6. **Clean Build Files**
- ✅ Created `/api/.railwayignore`
- ✅ Excludes: node_modules, .git, logs, env files
- ✅ Production-ready deployment

---

## 🚀 Deployment Steps on Railway

### Step 1: Prepare Code for Deployment

```bash
# From project root
cd StitchSpace

# Verify /api structure
ls -la api/
# Should show: server.js, package.json, railway.json, .railwayignore

# Verify start script
cat api/package.json | grep -A2 '"scripts"'
# Should show: "start": "node server.js"
```

### Step 2: Commit and Push

```bash
git add .
git commit -m "Fix Railway backend deployment - /api structure"
git push origin main
```

### Step 3: Create Railway Service for Backend

1. **Go to Railway Dashboard:** https://railway.app/dashboard
2. **Create New Project**
3. **Deploy from GitHub**
4. **Select Repository:** your-repo-name
5. **Choose Deployment Source:** 
   - Select `/api` folder as root directory
   - **CRITICAL:** Point Railway to `/api` folder
6. **Create Service**

### Step 4: Configure Environment Variables

In Railway Dashboard → Service → Variables, add:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:073zIcLCebwApqrO@cluster0.jbnmoya.mongodb.net/?appName=Cluster0
JWT_SECRET=J2uZR9kHOBEs6eiP
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://stitch-space-isew.vercel.app
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 5: Deploy

- Railway will auto-detect Node.js
- Build output: `npm install`
- Start command: `npm start`
- Wait 5-10 minutes for deployment

### Step 6: Verify Deployment

1. **Get Backend URL** from Railway dashboard
   - Format: `https://your-project.up.railway.app`

2. **Test Health Endpoint:**
   ```bash
   curl https://your-project.up.railway.app/api/health
   # Expected response: {"status":"Server is running"}
   ```

3. **Check Logs:**
   - Railway Dashboard → Logs tab
   - Look for: "MongoDB connected"
   - Verify no errors

### Step 7: Update Vercel Frontend

1. **Go to Vercel Project Settings**
2. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-railway-url.up.railway.app
   ```
3. **Redeploy Frontend:**
   - Push to GitHub, or
   - Manual redeploy in Vercel

---

## ✅ Verification Checklist

**Backend Structure:**
- [ ] `/api/server.js` exists and is clean (no frontend code)
- [ ] `/api/package.json` has start script: `"start": "node server.js"`
- [ ] `/api/railway.json` exists with proper settings
- [ ] `/api/.railwayignore` created
- [ ] No React-related dependencies in `/api/package.json`
- [ ] Root `/server.js` has no frontend serving code

**Express Configuration:**
- [ ] Server listens on `process.env.PORT || 5000`
- [ ] CORS allows Vercel domain
- [ ] MongoDB connects with retry logic
- [ ] All 8 API routes mounted
- [ ] Health check at `/api/health` works
- [ ] 404 handler for undefined routes

**Railway Configuration:**
- [ ] `/api` folder selected as root
- [ ] All environment variables set
- [ ] `npm start` runs `node server.js`
- [ ] Logs show "MongoDB connected"
- [ ] Health endpoint responds

**Frontend Integration:**
- [ ] Vercel has `REACT_APP_API_URL` set
- [ ] Frontend calls correct backend URL
- [ ] No CORS errors in console
- [ ] API calls work from frontend

---

## 🔧 File Changes Summary

### Created Files:
```
/api/server.js          ← Clean Express backend
/api/package.json       ← Backend dependencies only
/api/railway.json       ← Railway configuration
/api/.railwayignore     ← Build ignore rules
```

### Modified Files:
```
/server.js              ← Removed React build serving
/api/vercel.json        ← Removed Vercel-specific config
```

### Unchanged:
```
/client/                ← Frontend (DO NOT MODIFY)
/routes/                ← API routes (used by /api)
/models/                ← MongoDB models
/middleware/            ← Middleware
.env                    ← Environment variables
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module '../routes/auth'"
**Solution:** Ensure routes are in parent directory. Path is relative to `/api/server.js`:
```javascript
require("../routes/auth")  // ✅ Correct
require("./routes/auth")   // ❌ Wrong
```

### Issue: 502 Bad Gateway
**Solution:**
1. Check Railway logs for errors
2. Verify all environment variables set
3. Ensure MongoDB URL is correct
4. Check NODE_ENV is 'production'

### Issue: CORS Error from Frontend
**Solution:**
1. Verify FRONTEND_URL in Railway variables
2. Check Vercel has correct REACT_APP_API_URL
3. Verify allowedOrigins includes Vercel URL

### Issue: "Cannot GET /"
**Solution:** This is expected! Backend is API-only:
- Health check: GET `/api/health`
- API routes only at `/api/*`
- No HTML homepage

### Issue: Database Connection Timeout
**Solution:**
1. Verify MongoDB connection string exact match
2. Check MongoDB Atlas allows Railway IP
3. Ensure MONGO_URI set in Railway variables
4. Check database is accessible

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│  Vercel Frontend (Already Deployed) │
│  https://stitch-space-isew.vercel.app
└────────────────┬────────────────────┘
                 │ CORS Configured
                 ↓
         ┌───────────────────┐
         │  Railway Backend  │ ← YOU ARE HERE
         │ (Node.js + Express)
         │  /api/server.js   │
         └────────┬──────────┘
                  │ Queries
                  ↓
         ┌───────────────────┐
         │  MongoDB Atlas    │
         │  (Cluster0)       │
         └───────────────────┘
```

---

## 🎯 Next Steps

1. **Verify all files created correctly**
2. **Commit and push code to GitHub**
3. **Go to Railway.app and create new project**
4. **Deploy from GitHub (select `/api` folder)**
5. **Add environment variables**
6. **Update Vercel REACT_APP_API_URL**
7. **Test health endpoint**
8. **Run end-to-end tests**

---

## 📞 Quick Commands

```bash
# Test locally before deploying
cd api
npm install
npm start
# Backend runs on http://localhost:5000

# Test health check
curl http://localhost:5000/api/health

# Push changes
git add .
git commit -m "Railway backend deployment ready"
git push
```

---

## 🔗 Resources

- **Railway Docs:** https://docs.railway.app
- **Express Guide:** https://expressjs.com
- **MongoDB Docs:** https://docs.atlas.mongodb.com
- **CORS Info:** https://enable-cors.org

---

**Status:** ✅ Backend Ready for Railway Deployment

Your `/api` backend is now clean, properly configured, and ready for production deployment on Railway!
