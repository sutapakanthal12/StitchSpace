# ✅ StitchSpace - Running Locally & Vercel Deployment

## ✅ CURRENT STATUS: Both Services Running

### Local URLs (Development)

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Base**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📋 To Convert to Vercel & Deploy

### Step 1️⃣: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Create a new project

### Step 2️⃣: Deploy Backend to Vercel

```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace
vercel --env-file .env
```

**Note down your backend URL after deployment:**

- Example: `https://stitchspace-api.vercel.app`

### Step 3️⃣: Update Frontend with Backend URL

Edit `c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace\client\.env.production`:

```
REACT_APP_API_URL=https://your-backend-url-here
```

### Step 4️⃣: Deploy Frontend to Vercel

```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace\client
vercel
```

**Your frontend URL will be shown after deployment:**

- Example: `https://stitchspace.vercel.app`

---

## 🔄 Localhost to Vercel Conversion

### Updated Files Ready for Vercel:

✅ `.env` - Backend configuration  
✅ `.env.production` - Backend production settings  
✅ `client/.env.development` - Frontend dev settings  
✅ `client/.env.production` - Frontend prod settings  
✅ `vercel.json` - Frontend Vercel config  
✅ `api/vercel.json` - Backend Vercel config

### Automatic Conversion Will Change:

| Before (Localhost)          | After (Vercel)                        |
| --------------------------- | ------------------------------------- |
| `http://localhost:3000`     | `https://your-frontend.vercel.app`    |
| `http://localhost:5000`     | `https://your-backend.vercel.app`     |
| `http://localhost:5000/api` | `https://your-backend.vercel.app/api` |

---

## 🚀 Quick Commands

### Run Locally (Already Running!)

```bash
npm run dev
```

### Deploy Script (Windows)

```bash
deploy-vercel.bat
```

### Check Backend Health

```bash
curl http://localhost:5000/api/health
```

---

## 📝 Environment Variables Setup

### Backend (.env) - Already Configured:

```
MONGO_URI=mongodb+srv://sutapak2903_db_user:8hUVms9qwXkrtI1u@cluster0.jbnmoya.mongodb.net/stitchspace
JWT_SECRET=J2uZR9kHOBEs6eiP
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_dummy_key_for_development
STRIPE_PUBLISHABLE_KEY=pk_test_dummy_key_for_development
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012
```

### Frontend (.env.production) - Template Ready:

```
REACT_APP_API_URL=https://YOUR_BACKEND_VERCEL_URL
```

---

## 📚 API Endpoints

### Base URL:

- **Local**: `http://localhost:5000/api`
- **Vercel**: `https://your-backend.vercel.app/api`

### Common Endpoints:

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /products` - Get all products
- `GET /workshops` - Get all workshops
- `POST /orders` - Create order
- `GET /community` - Get community posts

---

## ⚠️ Important Notes

1. **All localhost links have been identified** - See `LOCALHOST_TO_VERCEL.md` for complete list
2. **Environment ready** - Just add Vercel backend URL to `.env.production`
3. **CORS configured** - Backend accepts both localhost and production requests
4. **Database connected** - MongoDB Atlas cloud database active
5. **Static files configured** - React build will be served from backend

---

## 🎯 Next Steps

1. ✅ Both services running locally
2. ⏳ Create Vercel account
3. ⏳ Deploy backend
4. ⏳ Get backend Vercel URL
5. ⏳ Update `.env.production`
6. ⏳ Deploy frontend
7. ✅ All localhost → Vercel conversion complete!

---

## 💡 Need Help?

- **Backend not starting?** Check if port 5000 is in use: `netstat -ano | findstr :5000`
- **Frontend not starting?** Check if port 3000 is in use: `netstat -ano | findstr :3000`
- **API connection issues?** Verify `REACT_APP_API_URL` is set correctly
- **Vercel deployment failed?** Check `.env` file has all required variables

---

**Created**: February 3, 2026
**Status**: ✅ Ready for Vercel Deployment
