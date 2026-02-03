# 🚀 Quick Deployment Checklist

## ✅ COMPLETED (Ready Now)

- [x] Frontend build successful
  - Command: `npm run build`
  - Output: `client/build/` (Ready to deploy)
  - Size: ~92KB (gzipped)

- [x] Environment configuration
  - `client/.env.development` → localhost:5000
  - `client/.env.production` → render backend
  - `client/src/config/apiConfig.js` → Dynamic URL switching

- [x] Vercel configuration
  - `vercel.json` with rewrites for SPA routing
  - Handles 404 redirects to index.html

- [x] Code pushed to GitHub
  - Repository: https://github.com/sutapakanthal12/StitchSpace
  - Branch: main
  - Ready to deploy

---

## 🎯 TODO: Deploy to Vercel (Frontend)

### Step 1: Sign up on Vercel
```
Go to: https://vercel.com
Sign up with GitHub account
```

### Step 2: Deploy Frontend
```
Option A - Using CLI:
  vercel --prod

Option B - Using Dashboard:
  1. Click "New Project"
  2. Select StitchSpace repo
  3. Settings auto-detected
  4. Click "Deploy"
```

### Step 3: Get Vercel URL
```
You'll receive: https://stitchspace.vercel.app
(or similar domain)

SAVE THIS URL ↑
You need it for backend CORS
```

---

## 🎯 TODO: Deploy to Render (Backend)

### Step 1: Sign up on Render
```
Go to: https://render.com
Sign up with GitHub account
```

### Step 2: Create Web Service
```
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repo
4. Configure:
   - Name: stitchspace-api
   - Root Directory: StitchSpace
   - Build Command: npm install
   - Start Command: node server.js
```

### Step 3: Add Environment Variables
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

### Step 4: Deploy
```
Click "Create Web Service"
Wait 2-5 minutes for deployment

You'll get: https://stitchspace-api.onrender.com
(or similar URL)

SAVE THIS URL ↑
```

---

## 🎯 TODO: Connect Frontend & Backend

### Step 1: Update Frontend
```
Edit: client/.env.production

Change:
REACT_APP_API_URL=https://stitchspace-api.onrender.com

(Replace with your actual Render URL)
```

### Step 2: Update Backend CORS
```
Edit: server.js

Update CORS to include Vercel URL:
https://stitchspace.vercel.app
```

### Step 3: Redeploy
```
Git commit and push:
git add .
git commit -m "Update API URLs for production"
git push origin main

Vercel auto-deploys when GitHub updates
Redeploy Render backend with new CORS config
```

---

## 🧪 Testing After Deployment

### Test Frontend
```
✓ Visit: https://stitchspace.vercel.app
✓ Page should load without 404 errors
✓ Navigation should work
✓ Homepage should render
```

### Test Backend
```
✓ Visit: https://stitchspace-api.onrender.com/api/health
✓ Should return: {"status": "Server is running"}
```

### Test API Integration
```
✓ Open browser DevTools (F12)
✓ Go to Network tab
✓ Try to login/register
✓ Should see API calls to Render backend
✓ No CORS errors should appear
```

---

## 📝 Important Notes

### Render Free Tier
- Auto-sleeps after 15 min of inactivity
- First request takes ~30 seconds to wake up
- This is normal! Not a bug.
- Upgrade to paid tier to disable sleep

### MongoDB Connection
- Your MongoDB Atlas is already configured
- No changes needed
- Automatically allows Render IPs

### Build Information
```
✅ Build Tool: Create React App
✅ Output Folder: client/build
✅ Build Status: Successful
✅ Build Size: 92KB (gzipped)
✅ No errors (only ESLint warnings, safe to ignore)
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub | https://github.com/sutapakanthal12/StitchSpace | Source code |
| Vercel | https://vercel.com | Frontend deployment |
| Render | https://render.com | Backend deployment |
| MongoDB | https://www.mongodb.com/cloud/atlas | Database |

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend accessible at Vercel URL
- [ ] No 404 errors on routes
- [ ] Navigation works
- [ ] Backend accessible at Render URL
- [ ] `/api/health` endpoint responds
- [ ] CORS allows frontend URL
- [ ] API calls complete without errors
- [ ] Database connected and working
- [ ] GitHub repo up to date

---

**Status**: ✅ READY FOR DEPLOYMENT
**Frontend**: Ready
**Backend**: Ready
**Database**: Connected

Next step: Deploy on Vercel + Render!
