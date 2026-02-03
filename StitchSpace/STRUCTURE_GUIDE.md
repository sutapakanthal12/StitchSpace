# StitchSpace - Reorganized Project Structure

## 📁 New Folder Organization

```
StitchSpace/
├── client/
│   └── src/
│       ├── sections/
│       │   ├── buyer/
│       │   │   ├── BuyerDashboard.js        # Buyer profile, orders, wishlist
│       │   │   └── Marketplace.js           # Browse & filter products
│       │   ├── artisan/
│       │   │   └── ArtisanDashboard.js      # Sell products, create workshops
│       │   ├── learner/
│       │   │   └── LearnerDashboard.js      # Enroll, track progress
│       │   └── common/
│       │       └── Home.js                  # Homepage for all users
│       ├── pages/
│       │   ├── Auth.js                      # Login/Register
│       │   ├── Cart.js                      # Shopping cart
│       │   ├── Checkout.js                  # Payment
│       │   ├── Community.js                 # Community posts
│       │   ├── Workshops.js                 # Browse workshops
│       │   ├── Workshop.js                  # Workshop details & enroll
│       │   ├── Product.js                   # Product details
│       │   ├── ArtisanProfile.js            # Public artisan profile
│       │   └── ...
│       ├── components/
│       │   ├── Navigation.js
│       │   ├── Footer.js
│       │   ├── PrivateRoute.js
│       │   └── ...
│       └── App.js                           # Main routing (UPDATED)
├── routes/
│   ├── auth.js                              # Authentication endpoints
│   ├── products.js                          # Product CRUD
│   ├── workshops.js                         # Workshop CRUD
│   ├── orders.js                            # Order management
│   ├── users.js                             # User profiles
│   ├── community.js                         # Community posts
│   └── upload.js                            # Image uploads
├── models/
│   ├── User.js                              # User model (buyer, artisan, learner)
│   ├── Product.js                           # Product model
│   ├── Workshop.js                          # Workshop model
│   ├── Order.js                             # Order model
│   └── CommunityPost.js                     # Community posts
├── middleware/
│   └── auth.js                              # JWT authentication
├── server.js                                # Express server
├── .env                                     # Environment variables
└── README.md
```

---

## 🎯 Role-Based Sections Explained

### **BUYER SECTION** 👥

**Path**: `/src/sections/buyer/`

#### Pages:

- **Marketplace.js**: Browse, filter, and search products

  - Filter by category, price, eco-friendly, fair trade
  - Add to cart functionality
  - Quick add to cart buttons

- **BuyerDashboard.js**: Buyer's personal dashboard
  - View all orders
  - Track order status
  - Wishlist management
  - Saved addresses

#### Routes:

- `/marketplace` - Browse all products
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Payment page
- `/dashboard` - Buyer dashboard (orders, wishlist, addresses)

#### Key Features:

✅ Search & filter products
✅ Add to cart
✅ Checkout with Stripe
✅ View order history
✅ Wishlist (coming soon)
✅ Saved addresses (coming soon)

---

### **ARTISAN SECTION** 🎨

**Path**: `/src/sections/artisan/`

#### Pages:

- **ArtisanDashboard.js**: Complete artisan control panel
  - Create & manage products
  - Create & manage workshops
  - View sales metrics (revenue, total sales, active products)
  - Analytics & earnings

#### Routes:

- `/dashboard` - Artisan dashboard (when logged in as artisan)

#### Artisan Dashboard Features:

✅ **Overview Tab**: Sales analytics, revenue, active products
✅ **Products Tab**: View, edit, delete products
✅ **Workshops Tab**: Manage courses & workshops
✅ **Create Product Tab**: Form to add new products

#### Key Features:

✅ Create products with images
✅ Create workshops/courses
✅ Track sales & revenue
✅ Build public profile
✅ View earnings

---

### **LEARNER SECTION** 📚

**Path**: `/src/sections/learner/`

#### Pages:

- **LearnerDashboard.js**: Learner's learning center
  - View enrolled workshops
  - Track progress
  - Certificates (coming soon)

#### Routes:

- `/workshops` - Browse all workshops
- `/workshop/:id` - Workshop details & enroll button
- `/dashboard` - Learner dashboard (enrolled courses, progress)

#### Key Features:

✅ Browse workshops by category & level
✅ View workshop details
✅ Enroll in workshops
✅ Track progress per course
✅ Certificates (future)

---

### **COMMON SECTION** 🌐

**Path**: `/src/sections/common/`

#### Pages:

- **Home.js**: Landing page for everyone
  - Hero section
  - Explanation of 3 sections (Buyer, Artisan, Learner)
  - Featured artisans
  - Call-to-action buttons

#### Routes:

- `/` - Homepage
- `/community` - Community posts & discussions
- `/artisan-profile/:id` - View public artisan profile

---

## 🔄 User Journey by Role

### **AS A BUYER**

```
Visit Home → Register/Login (Role: Buyer) → Browse Marketplace
→ View Product → Add to Cart → Checkout → View Orders in Dashboard
```

### **AS AN ARTISAN**

```
Visit Home → Register/Login (Role: Artisan) → Dashboard
→ Create Product → Manage Products → Create Workshop
→ View Sales Metrics
```

### **AS A LEARNER**

```
Visit Home → Register/Login (Role: Learner) → Browse Workshops
→ Enroll in Workshop → View in Dashboard → Track Progress
```

---

## 📊 Database Models

### **User Model**

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
  workshops: [ObjectId],          // Artisan's created workshops
  products: [ObjectId],           // Artisan's products
  enrolledWorkshops: [ObjectId],  // Learner's enrolled courses
  purchases: [ObjectId],          // Buyer's orders
  createdAt: Date
}
```

### **Product Model**

```javascript
{
  name: String,
  description: String,
  artist: ObjectId (User),        // Artisan who created it
  category: String,               // Textiles, Clothing, etc.
  price: Number,
  quantity: Number (stock),
  images: [String],
  materials: [String],
  customizable: Boolean,
  fairTradeCertified: Boolean,
  ecoFriendly: Boolean,
  artisanStory: String,
  reviews: [{userId, rating, comment}],
  sold: Number,
  createdAt: Date
}
```

### **Workshop Model**

```javascript
{
  title: String,
  description: String,
  artisan: ObjectId (User),       // Instructor
  category: String,
  price: Number,
  duration: String,
  level: "Beginner" | "Intermediate" | "Advanced",
  startDate: Date,
  endDate: Date,
  enrolled: [ObjectId],           // Array of learner IDs
  materials: [String],
  images: [String],
  videoUrl: String,
  learningOutcomes: [String],
  createdAt: Date
}
```

### **Order Model**

```javascript
{
  buyer: ObjectId (User),
  items: [{product, quantity, price}],
  totalAmount: Number,
  status: "Pending" | "Processing" | "Shipped" | "Delivered",
  shippingAddress: {...},
  paymentMethod: String,
  stripePaymentId: String,
  createdAt: Date
}
```

---

## 🔐 Protected Routes

These routes require authentication (JWT token):

```
POST   /api/auth/register          → Create account
POST   /api/auth/login             → Login
GET    /api/auth/me                → Get current user (protected)

GET    /api/orders                 → Get my orders (protected)
POST   /api/orders                 → Create order (protected)

POST   /api/products               → Create product (artisan only)
PUT    /api/products/:id           → Edit product (artisan only)
DELETE /api/products/:id           → Delete product (artisan only)

POST   /api/workshops              → Create workshop (artisan only)
POST   /api/workshops/:id/enroll   → Enroll in workshop (protected)
```

---

## 🚀 Getting Started

### 1. **Install Dependencies**

```bash
# Backend
cd StitchSpace
npm install

# Frontend
cd client
npm install
```

### 2. **Setup Environment Variables**

```bash
# In .env file
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stitchspace
JWT_SECRET=your_secret_key
PORT=5000
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### 3. **Run Development Servers**

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

### 4. **Access the Application**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🧪 Testing Checklist

### Buyer Testing

- [ ] Register as Buyer
- [ ] Browse Marketplace
- [ ] Filter products by category & price
- [ ] Add product to cart
- [ ] Complete checkout
- [ ] View orders in Dashboard

### Artisan Testing

- [ ] Register as Artisan
- [ ] Create a product
- [ ] View sales metrics in Dashboard
- [ ] Create a workshop
- [ ] Edit product

### Learner Testing

- [ ] Register as Learner
- [ ] Browse Workshops
- [ ] Enroll in a workshop
- [ ] View enrolled workshops in Dashboard
- [ ] See progress tracker

### Community Testing

- [ ] Post in Community
- [ ] Like a post
- [ ] Comment on post

---

## 🎨 Frontend Routes Summary

| Route           | Component   | Role(s) | Purpose              |
| --------------- | ----------- | ------- | -------------------- |
| `/`             | Home        | All     | Landing page         |
| `/auth`         | Auth        | All     | Login/Register       |
| `/marketplace`  | Marketplace | All     | Browse products      |
| `/product/:id`  | Product     | All     | Product details      |
| `/cart`         | Cart        | All     | Shopping cart        |
| `/checkout`     | Checkout    | Buyer   | Payment              |
| `/workshops`    | Workshops   | All     | Browse courses       |
| `/workshop/:id` | Workshop    | All     | Course details       |
| `/community`    | Community   | All     | Social feed          |
| `/dashboard`    | Dashboard   | Auth    | Role-based dashboard |

---

## 🔄 State Management

Uses **React Hooks** (useState, useEffect) for:

- User authentication
- Cart management (localStorage)
- Fetching data from API
- Form handling

**No Redux needed yet** - suitable for current app complexity.

---

## 📦 Third-Party Libraries

- **axios**: API calls
- **react-router-dom**: Client-side routing
- **stripe**: Payment processing
- **cloudinary**: Image storage
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **nodemailer**: Email notifications (optional)

---

## 🎯 Next Steps

After verifying the restructured code works:

### Phase 2 Enhancements:

- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced search & recommendations
- [ ] Payment success emails
- [ ] Workshop progress tracking
- [ ] Certificate generation

### Phase 3 Features:

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Video streaming for workshops
- [ ] AI product recommendations
- [ ] Blockchain for fair trade verification

---

## 💬 Support

- **Backend Debug**: Check server console for errors
- **Frontend Debug**: Open browser DevTools
- **API Testing**: Use Postman for endpoint testing
- **Database**: Check MongoDB Atlas for data

---

**Happy Building! 🧵✨**
