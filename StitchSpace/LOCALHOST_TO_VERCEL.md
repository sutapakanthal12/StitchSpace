# Localhost to Vercel Conversion Guide

## Current Localhost URLs

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Backend API endpoint**: `http://localhost:5000/api`

## After Vercel Deployment

### Step 1: Get Your Vercel URLs

**Backend URL** (from Vercel dashboard):

```
https://[your-backend-project].vercel.app
```

**Frontend URL** (from Vercel dashboard):

```
https://[your-frontend-project].vercel.app
```

### Step 2: Conversion Map

| Local                       | Vercel                                          |
| --------------------------- | ----------------------------------------------- |
| `http://localhost:5000`     | `https://[your-backend-project].vercel.app`     |
| `http://localhost:5000/api` | `https://[your-backend-project].vercel.app/api` |
| `http://localhost:3000`     | `https://[your-frontend-project].vercel.app`    |

### Step 3: Update Environment Variables

#### For Frontend (.env.production):

```
REACT_APP_API_URL=https://[your-backend-project].vercel.app
```

#### For Backend (Vercel Project Settings):

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
```

### Step 4: Vercel Deployment

#### Deploy Backend:

```bash
cd StitchSpace
vercel --env-file .env
```

#### Deploy Frontend:

```bash
cd client
# Update .env.production with your backend URL first
vercel --env-file .env.production
```

## Files Already Updated for Vercel

✅ `.env` - Backend environment variables
✅ `client/.env.development` - Development frontend settings
✅ `client/.env.production` - Production frontend template
✅ `client/package.json` - Added homepage for production builds
✅ `vercel.json` - Frontend Vercel configuration
✅ `api/vercel.json` - Backend Vercel serverless configuration

## Running Both Locally (Before Deploying)

```bash
# Terminal 1: Run backend
npm run server

# Terminal 2: Run frontend
cd client && npm start

# Or run both together:
npm run dev
```

Your app is now running:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints Examples

### Local Development:

```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/products
POST http://localhost:5000/api/orders
```

### After Vercel Deployment:

```
POST https://[your-backend-project].vercel.app/api/auth/register
POST https://[your-backend-project].vercel.app/api/auth/login
GET https://[your-backend-project].vercel.app/api/products
POST https://[your-backend-project].vercel.app/api/orders
```

## Important Notes

1. **CORS Configuration**: Ensure your backend CORS is configured to accept requests from your Vercel frontend URL
2. **Database**: Your MongoDB Atlas connection is already configured (cloud database)
3. **Environment Secrets**: Store all sensitive keys in Vercel Project Settings, not in code
4. **File Size**: Vercel has serverless function limits (50MB for standard)
5. **Build Output**: Frontend build is generated to `client/build`

## Troubleshooting

### CORS Errors

Update `server.js` CORS configuration:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://[your-frontend-project].vercel.app",
    ],
    credentials: true,
  })
);
```

### Backend Not Responding

Check that `REACT_APP_API_URL` in `.env.production` matches your Vercel backend URL exactly

### Build Fails

Ensure `client/package.json` has all required dependencies installed
