# Railway Backend - Build Configuration

This directory is the backend API for the StitchSpace MERN project.

## Quick Start

```bash
npm install
npm start
```

## Environment

This backend requires the following environment variables to be set:

- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT secret for authentication
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `STRIPE_SECRET_KEY` - Stripe API key
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `CLOUDINARY_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_SERVICE` - Email service provider
- `EMAIL_USER` - Email user/sender
- `EMAIL_PASS` - Email password/app password

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/products` - Get all products
- `GET /api/workshops` - Get all workshops
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `POST /api/payment/` - Process payment

## Files

- `server.js` - Express server entry point
- `package.json` - Node dependencies
- `railway.json` - Railway deployment configuration
- `Procfile` - Process file for Railway
- `start.sh` - Build script
