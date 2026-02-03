# StitchSpace - Quick Start Guide

## 🎯 What is StitchSpace?

StitchSpace is a full-stack MERN application that connects textile artisans with learners and conscious buyers. Based on the vision of creating a space "where hands create and minds connect," it provides:

1. **Learning Hub** - Interactive workshops by professional artisans
2. **Marketplace** - Buy and sell handmade textile products
3. **Community** - Share stories, participate in challenges, exchange knowledge
4. **Sustainability Focus** - Fair-trade and eco-friendly product highlighting

## ⚡ Quick Installation

### Prerequisites

- Node.js v14+ installed
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

### Step 1: Setup Backend

```bash
cd StitchSpace

# Install backend dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
```

**Edit .env file with:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stitchspace
JWT_SECRET=your_secret_key_12345
PORT=5000
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Step 2: Setup Frontend

```bash
cd client

# Install React dependencies
npm install

# Backend proxy is already configured to http://localhost:5000
```

### Step 3: Run the Application

**Option A: Run Frontend and Backend Separately**

```bash
# Terminal 1 - Backend
cd StitchSpace
npm start

# Terminal 2 - Frontend
cd StitchSpace/client
npm start
```

**Option B: Run Both Together**

```bash
cd StitchSpace
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📖 User Roles

### 1. Learner

- Browse and enroll in workshops
- Purchase handmade products
- Participate in community
- Save favorite artisans

### 2. Artisan

- Create and teach workshops
- Sell handmade products
- Build professional profile
- Track sales and earnings
- Manage customer orders

### 3. Admin

- Moderate community
- Manage platform content
- User management

## 🚀 Core Features

### Authentication System

```
Register → Login → Dashboard → Manage Profile
```

### Learning Hub Workflow

```
Browse Workshops → View Details → Enroll → Attend → Review
```

### Marketplace Workflow

```
Browse Products → Filter (Fair-Trade/Eco-Friendly) → Add to Cart → Checkout
```

### Community Features

```
Create Post → Like/Comment → Follow → Share Stories
```

## 📊 Database Models

### User

- Profile information
- Role-based access
- Workshops created
- Products listed
- Purchase history

### Workshop

- Course details
- Enrollment tracking
- Rating system
- Learning outcomes

### Product

- Product details
- Artisan information
- Reviews and ratings
- Sustainability tags

### Order

- Purchase history
- Payment tracking
- Shipping address
- Order status

### CommunityPost

- User stories
- Challenges
- Artwork sharing
- Comments and likes

## 🔒 Security Features

- JWT authentication
- Password encryption (bcryptjs)
- CORS protection
- Input validation
- Protected API routes

## 🎨 Design System

**Color Palette:**

- Primary: `#8B7355` (Brown - Craft heritage)
- Secondary: `#D4A574` (Tan - Warmth)
- Accent: `#F4E4C1` (Cream - Natural)
- Dark: `#2C1810` (Deep brown)

**Typography:**

- Headers: Bold, clear hierarchy
- Body: Readable, 16px base
- Responsive design for all devices

## 🔗 Key API Endpoints

**Authentication**

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

**Workshops**

- `GET /api/workshops` - List workshops
- `POST /api/workshops` - Create workshop
- `POST /api/workshops/:id/enroll` - Enroll

**Products**

- `GET /api/products` - List products
- `POST /api/products` - Create listing
- `GET /api/products/:id` - Product details

**Community**

- `GET /api/community` - Get posts
- `POST /api/community` - Create post

## 🛠️ Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Postman/Insomnia with the provided endpoints
3. **Database**: Monitor MongoDB Atlas dashboard
4. **Logs**: Check browser console and terminal for errors

## 🎓 Learning Resources

- Frontend: React Router, Axios, CSS
- Backend: Express, Mongoose, JWT
- Database: MongoDB
- Payment: Stripe API
- File Upload: Multer

## ⚠️ Troubleshooting

**Port already in use:**

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**MongoDB Connection Error:**

- Check MongoDB URI in .env
- Verify IP whitelist in MongoDB Atlas
- Ensure username/password are correct

**CORS Errors:**

- Verify frontend URL matches proxy in package.json
- Check backend CORS configuration

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🚢 Deployment Checklist

- [ ] Update production URLs
- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure payment keys
- [ ] Setup email notifications
- [ ] Test all features
- [ ] Backup database
- [ ] Monitor performance

## 📞 Support & Contact

**Email:** hello@stitchspace.com
**Issues:** Check GitHub issues or documentation

---

## 🎉 Next Steps

1. Complete the installation above
2. Create test user accounts (Learner & Artisan)
3. Create sample workshops and products
4. Test the full user journey
5. Customize branding and colors
6. Deploy to production

**Enjoy building with StitchSpace! 🧵✨**
