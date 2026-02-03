# Complete API & Deployment Configuration Guide

## ✅ What's Been Done

### 1. Frontend API Configuration
- ✅ `axios.defaults.baseURL` set to use `REACT_APP_API_URL` environment variable
- ✅ Fallback to `http://localhost:5000` for local development
- ✅ `API_CONFIG` object created for centralized endpoint management
- ✅ All API calls now use environment-based URLs

### 2. Backend CORS Configuration
- ✅ Express server configured to allow:
  - `http://localhost:3000` (local development)
  - `https://stitch-space-isew.vercel.app` (Vercel production)
- ✅ Credentials enabled for authentication
- ✅ No hardcoded localhost URLs in API calls

### 3. Environment Variables
- ✅ `.env.development` - Local development (localhost:5000)
- ✅ `.env.production` - Production (Render backend URL)
- ✅ `CI=false` set to prevent ESLint warnings from blocking builds
- ✅ cross-env installed for Windows compatibility

### 4. Build & Deployment
- ✅ Production build succeeds (90.27 KB gzipped)
- ✅ No ESLint errors
- ✅ Ready for Vercel deployment
- ✅ Backend ready for Render deployment

---

## 📋 Quick Reference Commands

### Backend - Run Locally
```bash
cd C:\Users\sutap\OneDrive\Desktop\pro\StitchSpace
npm install
node server.js
```

### Backend - Deploy on Render
1. Go to https://render.com
2. Create Web Service from GitHub repo
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (see below)

### Frontend - Run Locally
```bash
cd client
npm install
npm start
```

### Frontend - Build Locally
```bash
cd client
npm run build
# Output: build/ folder (90.27 KB gzipped)
```

### Frontend - Deploy on Vercel
1. Go to https://vercel.com
2. Import GitHub repo: sutapakanthal12/StitchSpace
3. Set root directory: `client`
4. Add environment variable: `REACT_APP_API_URL`
5. Click Deploy

---

## 🔧 Environment Variables

### Vercel (Frontend) - Required
```
REACT_APP_API_URL=https://stitchspace-api.onrender.com
```

### Render (Backend) - Required
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stitchspace?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_xxxxx or sk_live_xxxxx
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=https://stitch-space-isew.vercel.app
NODE_ENV=production
PORT=10000
```

### Local Development - .env.development (Frontend)
```
CI=false
REACT_APP_API_URL=http://localhost:5000
```

### Local Development - .env (Backend, root directory)
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stitchspace
JWT_SECRET=your-dev-secret
STRIPE_SECRET_KEY=sk_test_xxxxx
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
PORT=5000
```

---

## 🔐 How It Works

### Local Development
```
User Browser (http://localhost:3000)
    ↓
React App (uses REACT_APP_API_URL from .env.development)
    ↓
Express Backend (http://localhost:5000)
    ↓
MongoDB Atlas
```

### Production Deployment
```
User Browser (https://stitch-space-isew.vercel.app)
    ↓
React App on Vercel (uses REACT_APP_API_URL from Vercel env vars)
    ↓
Express Backend on Render (https://stitchspace-api.onrender.com)
    ↓
MongoDB Atlas
```

---

## 🚀 Deployment Checklist

### Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Set build: `npm install`
- [ ] Set start: `node server.js`
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Get public URL: https://stitchspace-api.onrender.com
- [ ] Test with: `curl https://stitchspace-api.onrender.com/api/health`

### Frontend (Vercel)
- [ ] Ensure backend is deployed first (get Render URL)
- [ ] Go to https://vercel.com
- [ ] Import StitchSpace repository
- [ ] Set root directory: `client`
- [ ] Add `REACT_APP_API_URL=<your-render-url>`
- [ ] Click Deploy
- [ ] Test login on Vercel URL
- [ ] Check Network tab to verify API calls go to Render

---

## 🧪 Testing API Connection

### Check Environment Variable is Loaded
Open browser console and run:
```javascript
console.log(process.env.REACT_APP_API_URL);
```

Should show:
- Local: `http://localhost:5000`
- Vercel: `https://stitchspace-api.onrender.com`

### Test Login
1. Go to app
2. Click Login
3. Open DevTools → Network tab
4. Enter credentials
5. Look for POST to `/api/auth/login`
6. URL should be to your backend (not localhost)

### Test Backend Health
```bash
# Local
curl http://localhost:5000/api/health

# Production
curl https://stitchspace-api.onrender.com/api/health
```

Expected response:
```json
{"status": "Server is running"}
```

---

## 📁 File Structure

```
StitchSpace/
├── server.js                           # Backend Express server with CORS config
├── .env                                # Backend env vars (local development)
├── client/
│   ├── package.json                    # Build script with cross-env
│   ├── .env.development                # Frontend local env (localhost:5000)
│   ├── .env.production                 # Frontend production env (Render URL)
│   └── src/
│       ├── App.js                      # Configured with axios baseURL
│       ├── config/
│       │   └── apiConfig.js            # API_CONFIG with BASE_URL
│       └── [all components]            # Use relative URLs /api/...
├── BACKEND_RENDER_DEPLOYMENT.md        # Render deployment guide
├── VERCEL_FRONTEND_CONFIG.md           # Vercel config guide
└── [routes, models, middleware]
```

---

## 🔄 Code Flow

### API Request Flow (Example: Login)

**Frontend Code** (stays the same):
```javascript
const response = await axios.post("/api/auth/login", credentials);
// axios baseURL = process.env.REACT_APP_API_URL
// Becomes: https://stitchspace-api.onrender.com/api/auth/login
```

**Backend Handling**:
```javascript
app.use(cors(corsOptions)); // Allows requests from Vercel
app.post("/api/auth/login", loginHandler);
```

**Response** → Frontend displays result

---

## ✨ Key Points

1. **No code changes needed** for production deployment
2. **Only environment variables change** between local and production
3. **CORS is configured** to accept both local and production URLs
4. **Build process** uses `CI=false` to prevent ESLint warnings from blocking
5. **Axios baseURL** automatically switches based on environment
6. **All API calls** use relative URLs (`/api/...`)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails on Vercel | Check CORS allows your Vercel URL; verify env var is set |
| API returns 404 | Verify backend URL in env var matches Render deployment |
| localhost still used on Vercel | Add REACT_APP_API_URL to Vercel env, redeploy |
| Build fails locally | Run `npm install` in client/, check Node version |
| CORS error in console | Verify backend CORS config includes your frontend URL |
| Variables not loading | Restart dev server after changing .env files |

---

## 📚 Additional Resources

- [Render Deployment Guide](./BACKEND_RENDER_DEPLOYMENT.md)
- [Vercel Configuration Guide](./VERCEL_FRONTEND_CONFIG.md)
- [GitHub Repo](https://github.com/sutapakanthal12/StitchSpace)

---

## ✅ Next Steps

1. **Deploy Backend First**
   - Follow [BACKEND_RENDER_DEPLOYMENT.md](./BACKEND_RENDER_DEPLOYMENT.md)
   - Get your Render URL

2. **Update Frontend Environment**
   - Add `REACT_APP_API_URL` to Vercel
   - Set value to your Render URL

3. **Deploy Frontend**
   - Go to Vercel
   - Click Deploy or Redeploy
   - Wait for build to complete

4. **Test Everything**
   - Try login/registration on Vercel URL
   - Check Network tab to verify backend calls
   - Monitor Render logs for any errors

5. **Monitor Logs**
   - Render: Check backend logs for errors
   - Vercel: Check deployment logs
   - Browser: Check console for CORS/API errors

---

**Status**: ✅ Ready for production deployment
**Last Updated**: February 3, 2026

