# StitchSpace: Where Hands Create, Minds Connect

A modern MERN stack platform connecting textile artisans, learners, and conscious buyers through craft education, sustainable commerce, and community engagement.

## 🎯 Project Overview

StitchSpace bridges the gap between traditional textile arts and the digital age by offering:

- **Learning Hub**: Interactive workshops taught by world-class artisans
- **Marketplace**: Handmade products from certified fair-trade artisans
- **Community Space**: Forums, challenges, and artist storytelling
- **Sustainability Focus**: Fair-trade and eco-friendly filtering

## 📋 Requirements

- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## ⚙️ Installation & Setup

### Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# - MONGO_URI: MongoDB connection string
# - JWT_SECRET: Your secret key for JWT
# - STRIPE_SECRET_KEY: Stripe API key
# - STRIPE_PUBLISHABLE_KEY: Stripe publishable key
# - EMAIL credentials for notifications

# Run development server
npm run dev
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start React development server
npm start
```

## 🚀 Running the Project

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

### Production Build

```bash
cd client
npm run build
cd ..
npm start
```

## 📁 Project Structure

```
StitchSpace/
├── server.js                 # Express server
├── package.json
├── .env.example
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema
│   ├── Workshop.js          # Workshop schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── CommunityPost.js     # Community post schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── users.js             # User management endpoints
│   ├── workshops.js         # Workshop CRUD & enrollment
│   ├── products.js          # Product marketplace
│   ├── orders.js            # Order processing
│   ├── community.js         # Community interactions
│   └── upload.js            # File upload handling
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.js
    │   │   ├── Footer.js
    │   │   └── PrivateRoute.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Workshops.js
    │   │   ├── Workshop.js
    │   │   ├── Marketplace.js
    │   │   ├── Product.js
    │   │   ├── Community.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── Auth.js
    │   │   ├── Dashboard.js
    │   │   └── ArtisanProfile.js
    │   ├── App.js
    │   └── index.css
    └── public/
        └── index.html
```

## 🔑 Key Features

### For Learners

- Browse and enroll in textile workshops
- Learn from experienced artisans
- Shop handmade products
- Participate in community challenges
- Rate and review workshops

### For Artisans

- Create and manage workshops
- Sell handmade products
- Track earnings and sales
- Build professional profile
- Reach global audience

### For All Users

- Community engagement (posts, stories, challenges)
- Fair-trade and eco-friendly product filtering
- Artisan storytelling and transparency
- User authentication & profiles
- Secure payment processing (Stripe)

## 🔐 Authentication

- JWT-based authentication
- User roles: Learner, Artisan, Admin
- Password hashing with bcryptjs
- Token expiration (7 days)

## 💳 Payment Integration

- Stripe integration for secure payments
- Order management system
- Transaction history

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Workshops

- `GET /api/workshops` - List all workshops
- `POST /api/workshops` - Create workshop (Artisan)
- `GET /api/workshops/:id` - Get workshop details
- `POST /api/workshops/:id/enroll` - Enroll in workshop
- `POST /api/workshops/:id/review` - Add workshop review

### Products

- `GET /api/products` - List products with filters
- `POST /api/products` - Create product listing
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/review` - Review product

### Community

- `GET /api/community` - Get community posts
- `POST /api/community` - Create post
- `POST /api/community/:id/like` - Like post
- `POST /api/community/:id/comment` - Comment on post

## 🎨 Styling

- CSS custom properties for theming
- Responsive design (Mobile-first)
- Color scheme: Brown/Tan/Cream (earthy tones)
- Smooth animations and transitions

## 🔒 Security Features

- JWT authentication
- Password hashing with bcryptjs
- CORS enabled
- Input validation
- Protected routes

## 🚀 Deployment

### Deploy to Heroku

```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Environment Variables (Production)

- Set all .env variables in hosting platform
- Enable MongoDB Atlas IP whitelist
- Configure Stripe keys for production

## 📝 Environment Variables

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stitchspace
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
EMAIL_SERVICE=gmail
EMAIL_USER=...
EMAIL_PASS=...
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Created by: Alivia Chatterjee
Course: Principles of Web Development

## 📞 Support

For issues, questions, or suggestions, please contact: hello@stitchspace.com

---

**Happy Stitching! 🧵**
