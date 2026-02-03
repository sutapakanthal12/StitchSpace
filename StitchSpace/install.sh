#!/bin/bash
# StitchSpace Installation Script

echo "🧵 Welcome to StitchSpace Installation!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"
cd ..
echo ""

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
    echo "Required variables:"
    echo "  - MONGO_URI: MongoDB connection string"
    echo "  - JWT_SECRET: Your JWT secret key"
    echo "  - STRIPE_SECRET_KEY: Stripe API key"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your MongoDB URI and other configurations"
echo "2. Run: npm run dev (to start both backend and frontend)"
echo ""
echo "Frontend will be at: http://localhost:3000"
echo "Backend will be at: http://localhost:5000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
