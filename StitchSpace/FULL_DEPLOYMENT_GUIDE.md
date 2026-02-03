# 🚀 StitchSpace - Full Deployment Guide

## ✅ Current Status

- ✅ Frontend build successful (React)
- ✅ Build folder: `client/build`
- ✅ Vercel.json configured for frontend only
- ✅ Environment variables set up
- ✅ API configuration ready for environment switching

---

## 📋 Architecture Overview

```
┌─────────────────────────────────┐
│     User Browser                │
└───────────────┬─────────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
┌────▼─────────────┐   ┌──▼──────────────────┐
│  Vercel          │   │  Render             │
│  (Frontend)      │   │  (Backend + DB)     │
│  stitchspace.    │   │  stitchspace-api.   │
│  vercel.app      │   │  onrender.com       │
└──────────────────┘   └─────────────────────┘
     React.js             Express.js + MongoDB
     Static Files         APIs
```

---

## 🎯 STEP 1: Deploy Frontend on Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace

# Install Vercel CLI globally (if not already done)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your StitchSpace GitHub repository
5. Vercel auto-detects the setup
6. Configure Build Settings:
   - **Framework**: Next.js (or React)
   - **Build Command**: `cd StitchSpace/client && npm run build`
   - **Output Directory**: `StitchSpace/client/build`
7. Click "Deploy"

### After Vercel Deployment

You'll get a URL like:

```
https://stitchspace.vercel.app
```

**Save this URL** - you'll need it for backend CORS configuration.

---

## 🎯 STEP 2: Deploy Backend on Render

### Setup on Render.com

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Create new **Web Service**
4. Select your GitHub repository
5. Configure:

   - **Name**: `stitchspace-api`
   - **Root Directory**: `StitchSpace`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Node Version**: `18.x`

6. Add Environment Variables:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:8hUVms9qwXkrtI1u@cluster0.jbnmoya.mongodb.net/stitchspace
JWT_SECRET=J2uZR9kHOBEs6eiP
NODE_ENV=production
PORT=5000
STRIPE_SECRET_KEY=sk_test_dummy_key_for_development
STRIPE_PUBLISHABLE_KEY=pk_test_dummy_key_for_development
CLOUDINARY_NAME=dummy_cloudinary_name
CLOUDINARY_API_KEY=dummy_api_key
CLOUDINARY_API_SECRET=dummy_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012
CORS_ORIGIN=https://stitchspace.vercel.app
```

7. Click "Create Web Service"

### After Render Deployment

You'll get a URL like:

```
https://stitchspace-api.onrender.com
```

---

## 🎯 STEP 3: Connect Frontend & Backend

### Update Frontend with Backend URL

Edit `client/.env.production`:

```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

### Update Backend CORS

In `server.js`, update CORS to accept your Vercel URL:

```javascript
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://stitchspace.vercel.app", // Your Vercel frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
```

---

## 🎯 STEP 4: Redeploy Frontend

After updating `.env.production`, push to GitHub and redeploy:

```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace

# Commit changes
git add client/.env.production
git commit -m "Update backend API URL for Render deployment"

# Push to GitHub
git push origin main

# Redeploy on Vercel (auto-deploys when GitHub is updated)
# Or manually: vercel --prod
```

---

## 📁 Folder Structure Summary

```
StitchSpace/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── config/
│   │   │   └── apiConfig.js    # API configuration
│   │   └── ...components
│   ├── build/              # Production build (READY TO DEPLOY)
│   ├── .env.development    # Local dev settings
│   ├── .env.production     # Production settings
│   └── package.json
├── server.js               # Express backend entry
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── middleware/            # Authentication, CORS
├── vercel.json            # Vercel frontend config
└── RENDER_DEPLOYMENT.md   # Render backend guide
```

---

## 🧪 Testing URLs

After deployment, test these:

### Frontend

```
https://stitchspace.vercel.app/
https://stitchspace.vercel.app/auth
https://stitchspace.vercel.app/marketplace
https://stitchspace.vercel.app/community
```

### Backend Health Check

```
https://stitchspace-api.onrender.com/api/health
```

### API Endpoints (Change URL as needed)

```
GET  https://stitchspace-api.onrender.com/api/products
GET  https://stitchspace-api.onrender.com/api/workshops
GET  https://stitchspace-api.onrender.com/api/community
POST https://stitchspace-api.onrender.com/api/auth/login
```

---

## 🔄 Environment Variables Summary

### Frontend (.env.production)

```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

### Backend (Render Dashboard)

```
MONGO_URI=...
JWT_SECRET=...
NODE_ENV=production
CORS_ORIGIN=https://stitchspace.vercel.app
```

---

## ⚠️ Important Notes

### 1. Render Free Tier Behavior

- Auto-sleeps after 15 min of inactivity
- First request takes 30 seconds to wake up
- **Solution**: Upgrade to paid tier or use keep-alive service

### 2. MongoDB Connection

- Your MongoDB Atlas connection is already active
- No changes needed
- IP whitelist must allow Render's IPs (automatically configured)

### 3. File Uploads (Cloudinary)

- Currently using dummy credentials
- Update these in Render environment variables for production

### 4. Email Service

- Using Gmail credentials
- Make sure Gmail allows "Less secure apps" or use App Passwords

### 5. Payment Gateways

- Stripe: Currently in test mode
- Razorpay: Currently in test mode
- Update keys in Render for production

---

## 🚨 Troubleshooting

### Frontend shows 404 error

- ✅ Fix: Vercel.json has rewrites configured
- Ensure `vercel.json` is in root directory

### Backend not responding

- Check Render deployment logs
- Verify MongoDB is accessible
- Check CORS_ORIGIN matches your Vercel URL

### CORS errors in browser

- Update `server.js` CORS configuration
- Make sure CORS_ORIGIN env var is set on Render
- Redeploy backend

### API calls fail in production

- Verify `client/.env.production` has correct API URL
- Check if Render backend is awake (first request takes 30s)
- Check browser console for exact error

---

## ✅ Deployment Checklist

- [ ] Frontend build successful (`npm run build`)
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] Vercel frontend URL noted
- [ ] Render account created
- [ ] Backend deployed on Render
- [ ] Render backend URL noted
- [ ] `.env.production` updated with Render URL
- [ ] `server.js` CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] Frontend redeployed
- [ ] Tested frontend at Vercel URL
- [ ] Tested API calls from frontend
- [ ] Database connection verified

---

## 📚 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Express CORS**: https://github.com/expressjs/cors

---

**Status**: ✅ Ready for Production Deployment
**Created**: February 3, 2026
**Last Updated**: February 3, 2026
