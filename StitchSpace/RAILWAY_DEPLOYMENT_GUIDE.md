# Railway Backend Deployment Guide

## Overview

This guide will help you deploy the StitchSpace backend on Railway and connect it to your Vercel frontend.

## Prerequisites

- Railway account (https://railway.app)
- MongoDB Atlas connection string
- Git repository access
- Backend code ready for deployment

## Step 1: Prepare Your Backend

### 1.1 Update Environment Variables

Your `.env` file has been updated with:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:073zIcLCebwApqrO@cluster0.jbnmoya.mongodb.net/?appName=Cluster0
JWT_SECRET=J2uZR9kHOBEs6eiP
PORT=5000
NODE_ENV=production
```

### 1.2 Verify package.json

Ensure your `package.json` has the correct start script:

```json
"scripts": {
  "start": "node server.js",
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server.js",
  "client": "cd client && npm start",
  "build": "cd client && npm run build"
}
```

## Step 2: Deploy to Railway

### Option A: Deploy via Railway CLI

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**

   ```bash
   railway login
   ```

3. **Create a new project**

   ```bash
   railway init
   ```

   - Select "Create a new project"
   - Give it a name (e.g., "stitchspace-backend")

4. **Add MongoDB Plugin (Optional - if you want Railway to manage it)**

   ```bash
   railway add
   ```

   - Select MongoDB

5. **Deploy**
   ```bash
   railway up
   ```

### Option B: Deploy via Railway Web Dashboard

1. Go to https://railway.app/dashboard
2. Click "Create New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub repository
5. Select the repository containing this backend
6. Click "Deploy"

## Step 3: Configure Environment Variables on Railway

1. Go to your Railway project dashboard
2. Click on the deployed service
3. Go to "Variables" tab
4. Add the following environment variables:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:073zIcLCebwApqrO@cluster0.jbnmoya.mongodb.net/?appName=Cluster0
JWT_SECRET=J2uZR9kHOBEs6eiP
NODE_ENV=production
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://stitch-space-isew.vercel.app
```

## Step 4: Get Your Railway Backend URL

1. After deployment completes, go to your Railway service
2. Look for "Deployments" tab
3. Your backend will have a URL like: `https://your-project-name.up.railway.app`
4. Copy this URL

## Step 5: Update Your Frontend to Use Railway Backend

### On Vercel Frontend:

1. Go to your Vercel project settings
2. Add environment variable:

   ```
   REACT_APP_API_URL=https://your-project-name.up.railway.app
   ```

3. Update [client/src/config/apiConfig.js](client/src/config/apiConfig.js):

   ```javascript
   const API_URL =
     process.env.REACT_APP_API_URL ||
     "https://your-project-name.up.railway.app";
   export default API_URL;
   ```

4. Redeploy your Vercel frontend

## Step 6: Test the Connection

1. Visit your Vercel frontend URL
2. Test API calls:
   - Try logging in
   - Try making a product purchase
   - Check console for CORS errors
   - Monitor Network tab in DevTools

## Troubleshooting

### Issue: CORS Errors

**Solution:** Ensure `FRONTEND_URL` environment variable is set on Railway to your Vercel URL:

```
FRONTEND_URL=https://stitch-space-isew.vercel.app
```

### Issue: MongoDB Connection Timeout

**Solution:** Check if your MongoDB connection string is correct in Railway variables

### Issue: 502 Bad Gateway

**Solution:**

- Check server logs in Railway dashboard
- Verify all required environment variables are set
- Check if PORT is set to 5000

### Issue: Pages Not Loading

**Solution:** This is expected if you access the backend URL directly. The backend serves API endpoints at `/api/*` paths.

## Monitoring and Logs

1. Go to Railway project dashboard
2. Click on your service
3. Click "Logs" to see real-time server logs
4. Check for errors and warnings

## Next Steps

- Set up automatic deployments from your GitHub repository
- Configure custom domain (optional)
- Set up monitoring and alerting
- Test all payment integrations (Stripe, Razorpay)
- Monitor database performance

## Useful Links

- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vercel Docs: https://vercel.com/docs

---

**Deployment Status:** ✅ Ready for Railway Deployment
**Backend URL Format:** https://your-project-name.up.railway.app
**Frontend Connected:** https://stitch-space-isew.vercel.app
