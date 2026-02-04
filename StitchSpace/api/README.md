# StitchSpace Backend API

Production-ready Express.js + MongoDB backend for StitchSpace marketplace.

## Features

✅ **Robust Error Handling**

- MongoDB connection retries with exponential backoff
- Graceful shutdown handling
- Global error handlers
- Environment variable validation

✅ **Security & Performance**

- CORS properly configured for frontend
- JWT authentication
- MongoDB connection pooling
- Request size limits (50MB for JSON/form data)

✅ **Railway Ready**

- Listens on `0.0.0.0:PORT` (Railway requirement)
- Graceful SIGTERM/SIGINT handling
- Health check endpoint
- Proper process exit codes

✅ **Development Friendly**

- Detailed console logging
- Local MongoDB fallback
- Hot reload with nodemon
- Separate frontend/backend builds

---

## Environment Setup

### Required Environment Variables

```env
JWT_SECRET=your-secret-key  # Required! Server won't start without this
```

### Optional Environment Variables (with defaults)

```env
MONGO_URI=mongodb://localhost:27017/stitchspace
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
PORT=5000
HOST=0.0.0.0
```

### Third-Party Services (Optional)

```env
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Installation & Development

### Local Development

```bash
cd api
npm install
npm run dev          # Starts on http://localhost:5000
```

### Production (Railway)

Railway automatically handles:

1. Dependency installation
2. Environment validation
3. Server startup
4. Graceful shutdown

---

## API Endpoints

### Health Check

```
GET /api/health
```

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Resources

```
/api/users
/api/products
/api/orders
/api/workshops
/api/community
/api/payment
/api/upload
```

---

## Deployment on Railway

### 1. Environment Variables

Set in Railway Variables tab:

- MONGO_URI (MongoDB Atlas connection string)
- JWT_SECRET (secure random string)
- NODE_ENV = production
- FRONTEND_URL (Vercel domain)
- HOST = 0.0.0.0

### 2. MongoDB Access

Allow Railway to connect in MongoDB Network Access.

### 3. Deploy

Push to GitHub → Railway auto-deploys.

---

## Troubleshooting

### Server Won't Start

- Check JWT_SECRET is set
- Verify MONGO_URI format
- Check MongoDB IP whitelist

### CORS Errors

- Update FRONTEND_URL environment variable
- Hard refresh browser (Ctrl+Shift+R)

### Connection Errors

- Check network connectivity
- Verify MongoDB credentials
- Review server logs

---

## Scripts

```bash
npm start           # Production
npm run dev         # Development with auto-reload
npm run build       # No-op (backend doesn't need build)
```

---

**Status:** Production Ready ✅
**Node:** 18.x
**Last Updated:** February 4, 2026
