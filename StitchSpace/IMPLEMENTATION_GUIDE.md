# StitchSpace - Complete Implementation Guide

## Project Status: ✅ ACTIVE

### Current Stack

- **Frontend**: React + Axios
- **Backend**: Express + MongoDB + Mongoose
- **Auth**: JWT + Role-Based Access Control
- **Database**: MongoDB Atlas
- **Payment**: Stripe (configured)

---

## 🎯 SECTION-WISE BREAKDOWN

### 1️⃣ BUYER SECTION ✅

**Role**: `buyer` (default for new users)

#### Buyer Features Implemented:

- ✅ Register/Login as Buyer
- ✅ Browse Marketplace (all products)
- ✅ Add products to Cart (localStorage)
- ✅ View Product Details
- ✅ Checkout Page
- ✅ Order Confirmation
- ✅ View Order History

#### Buyer Pages:

| Page            | Path           | Status            |
| --------------- | -------------- | ----------------- |
| Marketplace     | `/marketplace` | ✅ Working        |
| Product Details | `/product/:id` | ✅ Working        |
| Cart            | `/cart`        | ✅ Working        |
| Checkout        | `/checkout`    | ✅ Working        |
| Dashboard       | `/dashboard`   | ✅ (shows orders) |

#### How to Test:

1. Register new account (auto role = buyer)
2. Go to Marketplace
3. Click on any product
4. Add to Cart
5. Go to Cart → Checkout
6. View in Dashboard → Orders

---

### 2️⃣ ARTISAN SECTION ✅

**Role**: `artisan` (select at registration or contact admin)

#### Artisan Features Implemented:

- ✅ Create Products
- ✅ Edit/Delete Products
- ✅ Manage Workshops
- ✅ Create Workshop
- ✅ View Sales Dashboard
- ✅ Public Artisan Profile

#### Artisan Pages:

| Page            | Path                   | Status            |
| --------------- | ---------------------- | ----------------- |
| Dashboard       | `/dashboard`           | ✅ (artisan view) |
| Create Product  | (in dashboard)         | ✅ Working        |
| Manage Products | (in dashboard)         | ✅ Working        |
| Create Workshop | (in dashboard)         | ✅ Working        |
| Profile         | `/artisan-profile/:id` | ✅ Working        |

#### How to Test:

1. Register as Artisan
2. Dashboard → Upload Product
3. Dashboard → Create Workshop
4. View your products & workshops

---

### 3️⃣ LEARNER SECTION ✅

**Role**: `learner` (alternative to buyer)

#### Learner Features Implemented:

- ✅ Browse Workshops
- ✅ Enroll in Workshops
- ✅ View Workshop Details
- ✅ Learning Dashboard
- ✅ Enrolled Courses List

#### Learner Pages:

| Page            | Path            | Status            |
| --------------- | --------------- | ----------------- |
| Workshops       | `/workshops`    | ✅ Working        |
| Workshop Detail | `/workshop/:id` | ✅ Working        |
| Dashboard       | `/dashboard`    | ✅ (learner view) |

#### How to Test:

1. Register as Learner
2. Go to Workshops page
3. Click Enroll in Workshop
4. View in Dashboard → Enrolled Workshops

---

### 4️⃣ COMMUNITY SECTION ✅

**Available to All Users**

#### Community Features:

- ✅ Post Comments
- ✅ Like Posts
- ✅ View Community Feed

#### Community Pages:

| Page      | Path         | Status     |
| --------- | ------------ | ---------- |
| Community | `/community` | ✅ Working |

---

## 🔑 USER ROLES EXPLAINED

```
┌─────────────────────────────────────────┐
│        BUYER (Default Role)             │
├─────────────────────────────────────────┤
│ • Register with any email               │
│ • Browse & buy products                 │
│ • Browse & enroll in workshops          │
│ • Can also participate in community     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          ARTISAN                        │
├─────────────────────────────────────────┤
│ • Create & sell products                │
│ • Create & teach workshops              │
│ • View sales analytics                  │
│ • Build public profile                  │
│ • Earn from products & courses          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          LEARNER                        │
├─────────────────────────────────────────┤
│ • Enroll in workshops                   │
│ • Learn textile skills                  │
│ • Track progress (future)               │
│ • Get certificates (future)             │
│ • Can buy products too                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           ADMIN (Reserved)              │
├─────────────────────────────────────────┤
│ • Manage users                          │
│ • Moderate content                      │
│ • View analytics                        │
└─────────────────────────────────────────┘
```

---

## 📋 BACKEND ROUTES

### Authentication

```
POST   /api/auth/register        → Create account
POST   /api/auth/login           → Login
GET    /api/auth/me              → Get current user
```

### Products (Marketplace)

```
GET    /api/products             → Get all products
GET    /api/products/:id         → Get product details
POST   /api/products             → Create product (artisan)
PUT    /api/products/:id         → Edit product (artisan)
DELETE /api/products/:id         → Delete product (artisan)
POST   /api/products/:id/review  → Add review
```

### Orders (Checkout/Purchases)

```
POST   /api/orders               → Create order
GET    /api/orders               → Get my orders
GET    /api/orders/:id           → Get order details
PUT    /api/orders/:id           → Update order status
```

### Workshops (Learning)

```
GET    /api/workshops            → Get all workshops
GET    /api/workshops/:id        → Get workshop details
POST   /api/workshops            → Create workshop (artisan)
PUT    /api/workshops/:id        → Edit workshop (artisan)
DELETE /api/workshops/:id        → Delete workshop (artisan)
POST   /api/workshops/:id/enroll → Enroll in workshop
```

### Users (Profiles)

```
GET    /api/users/:id            → Get user profile
PUT    /api/users/:id            → Update profile
GET    /api/users                → Get all users (artisans)
```

### Community

```
GET    /api/community            → Get posts
POST   /api/community            → Create post
POST   /api/community/:id/like   → Like post
POST   /api/community/:id/comment → Add comment
```

### Upload

```
POST   /api/upload               → Upload image to Cloudinary
```

---

## 🗂️ DATABASE STRUCTURE

### Collections

**User**

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: "buyer" | "artisan" | "learner" | "admin",
  bio: String,
  profileImage: String,
  location: String,
  socialLinks: { instagram, facebook, twitter },
  workshops: [ObjectId],      // for artisans
  products: [ObjectId],       // for artisans
  enrolledWorkshops: [ObjectId], // for learners
  purchases: [ObjectId],      // orders
  createdAt: Date
}
```

**Product**

```javascript
{
  name: String,
  description: String,
  artist: ObjectId (User),
  category: String,
  price: Number,
  quantity: Number,
  images: [String],
  materials: [String],
  dimensions: String,
  customizable: Boolean,
  fairTradeCertified: Boolean,
  ecoFriendly: Boolean,
  artisanStory: String,
  reviews: [{userId, rating, comment, createdAt}],
  averageRating: Number,
  sold: Number,
  createdAt: Date
}
```

**Workshop**

```javascript
{
  title: String,
  description: String,
  artisan: ObjectId (User),
  category: String,
  price: Number,
  duration: String,
  level: "Beginner" | "Intermediate" | "Advanced",
  maxParticipants: Number,
  startDate: Date,
  endDate: Date,
  materials: [String],
  images: [String],
  videoUrl: String,
  learningOutcomes: [String],
  enrolled: [ObjectId],
  createdAt: Date
}
```

**Order**

```javascript
{
  buyer: ObjectId (User),
  items: [{product, quantity, price}],
  totalAmount: Number,
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
  shippingAddress: {fullName, address, city, state, zipCode, country},
  paymentMethod: String,
  stripePaymentId: String,
  createdAt: Date
}
```

**CommunityPost**

```javascript
{
  author: ObjectId (User),
  content: String,
  image: String,
  likes: [ObjectId],
  comments: [{author, text, createdAt}],
  createdAt: Date
}
```

---

## 🚀 HOW TO USE

### For Testing Different Roles

#### As BUYER:

1. Register with any email
2. Browse Marketplace → Add to Cart → Checkout
3. View Orders in Dashboard

#### As ARTISAN:

1. Register as "Artisan" role
2. Create Products in Dashboard
3. Create Workshops in Dashboard
4. Check sales in Dashboard

#### As LEARNER:

1. Register as "Learner" role
2. Browse Workshops page
3. Enroll in workshops
4. Track in Dashboard

---

## ⚙️ ENVIRONMENT SETUP

### .env File (Backend)

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stitchspace
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
CLOUDINARY_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## 🔐 SECURITY FEATURES

✅ Password Hashing (bcryptjs)
✅ JWT Token Authentication
✅ Role-Based Access Control
✅ Protected Routes (middleware/auth.js)
✅ CORS Configuration
✅ Request Size Limits (50mb)

---

## 🐛 COMMON ISSUES & FIXES

| Issue                         | Cause               | Fix                               |
| ----------------------------- | ------------------- | --------------------------------- |
| "buyer is not valid enum"     | Old server code     | Restart server: `node server.js`  |
| Marketplace shows no products | No products created | Login as artisan, create products |
| Payment fails                 | Stripe keys invalid | Update Stripe keys in .env        |
| Images not uploading          | Cloudinary error    | Check Cloudinary credentials      |
| Orders not saving             | MongoDB down        | Check MongoDB connection          |

---

## 📊 TESTING CHECKLIST

- [ ] Register as Buyer
- [ ] Register as Artisan
- [ ] Register as Learner
- [ ] Buyer: Browse & filter products
- [ ] Buyer: Add to cart & checkout
- [ ] Artisan: Create product
- [ ] Artisan: Create workshop
- [ ] Learner: Enroll in workshop
- [ ] View orders/workshops in Dashboard
- [ ] Community: Post & comment
- [ ] View Artisan Profile
- [ ] Search functionality works

---

## 🎯 READY FOR NEXT STEPS?

Once testing is complete, you can add:

### Phase 2 Features:

- [ ] AI Product Recommendations
- [ ] Email Notifications
- [ ] Payment Success Confirmation
- [ ] Workshop Progress Tracking
- [ ] Certificate Generation
- [ ] Advanced Filters
- [ ] Wishlist Feature

### Phase 3 Features:

- [ ] Mobile App (React Native)
- [ ] AR Product Preview
- [ ] Live Workshop Streaming
- [ ] Blockchain for Fair Trade Verification

---

## 📞 SUPPORT

Backend runs on: `http://localhost:5000`
Frontend runs on: `http://localhost:3000` (or 3002)

All API calls are proxied through the frontend!

Happy Building! 🎨✨
