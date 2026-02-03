# Vercel Deployment Guide for StitchSpace

## Step 1: Set Your Vercel URLs

Replace these with your actual Vercel deployment URLs after deployment:

- BACKEND_URL = https://stitchspace-api.vercel.app (example)
- FRONTEND_URL = https://stitchspace.vercel.app (example)

## Step 2: Environment Variables for Vercel Backend

Add these to your Vercel project settings:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:8hUVms9qwXkrtI1u@cluster0.jbnmoya.mongodb.net/stitchspace
JWT_SECRET=J2uZR9kHOBEs6eiP
PORT=5000
NODE_ENV=production
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
```

## Step 3: Deploy Backend

```bash
cd StitchSpace
vercel --env-file .env
```

## Step 4: After backend deployment, get your URL and update frontend

Set REACT_APP_API_URL in client/.env.production

## Step 5: Deploy Frontend

```bash
cd client
vercel --env-file .env.production
```

## Getting Vercel URLs

After deployment:

- Backend URL: Check your Vercel dashboard
- Frontend URL: Check your Vercel dashboard
