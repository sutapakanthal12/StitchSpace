# Render.com Deployment Configuration for StitchSpace Backend

This is the configuration for deploying the Express.js backend to Render.com

## Render Deployment Steps:

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account

### 2. Connect GitHub Repository
- Link your GitHub repo to Render
- Select the StitchSpace repository

### 3. Deploy Backend Service
- Create new **Web Service** on Render
- Select the repository
- Set **Root Directory** to: `StitchSpace/`
- Set **Build Command**: `npm install`
- Set **Start Command**: `node server.js`

### 4. Add Environment Variables
In Render Dashboard, add these environment variables:

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
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 5. Get Backend URL
After deployment on Render, you'll get a URL like:
```
https://stitchspace-api.onrender.com
```

### 6. Update Frontend
Update your `client/.env.production` with the Render backend URL:
```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

### 7. Deploy Frontend on Vercel
- Push updated code to GitHub
- Go to Vercel and deploy the frontend

## CORS Configuration

Your backend `server.js` needs CORS configured for your Vercel frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://your-vercel-app.vercel.app'  // Your production Vercel URL
  ],
  credentials: true
}));
```

## Render vs Vercel
- **Vercel**: Frontend (React) only - 1 year free tier
- **Render**: Backend (Node.js) - Free tier with auto-sleep after 15 min inactivity
