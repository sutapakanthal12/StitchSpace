# Railway Deployment Checklist ✅

## Pre-Deployment Setup

- [x] MongoDB URL updated: `mongodb+srv://sutapak2903_db_user:073zIcLCebwApqrO@cluster0.jbnmoya.mongodb.net/?appName=Cluster0`
- [x] NODE_ENV set to `production`
- [x] CORS configured for Vercel frontend: `https://stitch-space-isew.vercel.app`
- [x] railway.json configuration file created
- [x] server.js updated for dynamic FRONTEND_URL
- [x] package.json has correct start script: `npm start`
- [x] All dependencies in package.json
- [x] .gitignore properly configured (excludes .env)

## Environment Variables to Set on Railway

**Required:**
- [ ] MONGO_URI=mongodb+srv://sutapak2903_db_user:073zIcLCebwApqrO@cluster0.jbnmoya.mongodb.net/?appName=Cluster0
- [ ] JWT_SECRET=J2uZR9kHOBEs6eiP
- [ ] NODE_ENV=production
- [ ] PORT=5000
- [ ] FRONTEND_URL=https://stitch-space-isew.vercel.app

**Optional (for payment integrations):**
- [ ] STRIPE_SECRET_KEY=your_key_here
- [ ] STRIPE_PUBLISHABLE_KEY=your_key_here
- [ ] RAZORPAY_KEY_ID=your_key_here
- [ ] RAZORPAY_KEY_SECRET=your_key_here
- [ ] CLOUDINARY_NAME=your_name_here
- [ ] CLOUDINARY_API_KEY=your_key_here
- [ ] CLOUDINARY_API_SECRET=your_key_here
- [ ] EMAIL_SERVICE=gmail
- [ ] EMAIL_USER=your_email@gmail.com
- [ ] EMAIL_PASS=your_app_password

## Deployment Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - [ ] Account created

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - [ ] Project created

3. **Connect Repository**
   - Authorize Railway access to GitHub
   - Select your repository
   - [ ] Repository connected

4. **Deploy Service**
   - Railway will auto-detect Node.js
   - Click "Deploy"
   - Wait for deployment to complete (5-10 minutes)
   - [ ] Service deployed successfully

5. **Configure Environment Variables**
   - Go to Service Settings → Variables
   - Add all required variables listed above
   - [ ] All variables configured

6. **Get Backend URL**
   - After deployment, Railway shows your URL
   - Format: `https://your-project-name.up.railway.app`
   - [ ] Backend URL obtained: `_______________________`

## Vercel Frontend Updates

1. **Update Environment Variables**
   - Go to Vercel Project Settings
   - Add: `REACT_APP_API_URL=https://your-railway-url.up.railway.app`
   - [ ] Environment variable added

2. **Update apiConfig.js** (if needed)
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```
   - [ ] Already configured ✓

3. **Redeploy Frontend**
   - Push code to GitHub
   - Vercel auto-redeploys
   - [ ] Frontend redeployed

## Testing & Verification

1. **API Health Check**
   - [ ] GET `https://your-railway-url.up.railway.app/api/health` returns `{"status":"Server is running"}`

2. **Database Connection**
   - [ ] Check Railway logs for "MongoDB connected"
   - [ ] No connection timeout errors

3. **CORS Testing**
   - [ ] API calls from Vercel frontend work
   - [ ] No CORS errors in browser console
   - [ ] No "Not allowed by CORS" errors

4. **Functionality Tests**
   - [ ] User registration works
   - [ ] User login works
   - [ ] Product listing loads
   - [ ] Shopping cart functions
   - [ ] Checkout process works
   - [ ] Payment integration functions

5. **Monitor Backend Logs**
   - [ ] No 502/503 errors
   - [ ] Request logs show successful responses
   - [ ] No database connection errors

## Security Checklist

- [x] .env file not committed to GitHub
- [ ] All sensitive credentials in Railway environment variables only
- [ ] NODE_ENV set to production
- [ ] JWT_SECRET is secure and unique
- [ ] CORS only allows your Vercel domain
- [ ] MongoDB credentials are secure

## Troubleshooting

**If deployment fails:**
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Ensure Node.js version is compatible
4. Check if package.json has all dependencies

**If API calls fail:**
1. Verify CORS settings include Vercel URL
2. Check MongoDB connection string
3. Look for timeout errors in logs
4. Test health check endpoint

**If CORS errors persist:**
1. Check that FRONTEND_URL is set in Railway
2. Verify allowedOrigins in server.js
3. Test with curl from command line

## Deployment Complete! 🎉

**Backend URL:** `https://your-railway-url.up.railway.app`
**Frontend URL:** `https://stitch-space-isew.vercel.app`
**Database:** Connected to MongoDB Atlas
**Status:** ✅ Production Ready

### Next Steps:
1. Monitor Railway dashboard for performance
2. Set up error tracking (e.g., Sentry)
3. Configure backups for MongoDB
4. Monitor application logs regularly

---
**Last Updated:** 2026-02-04
**Deployment Guide:** [RAILWAY_DEPLOYMENT_GUIDE.md](RAILWAY_DEPLOYMENT_GUIDE.md)
