#!/bin/bash

# PrivatLux Installation Script
# This script automates the setup process for the PrivatLux platform

set -e

echo "🚀 PrivatLux Platform Installation"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ before continuing."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

echo ""
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Check if client directory exists
if [ ! -d "client" ]; then
    echo "❌ Client directory not found. Please ensure the project structure is correct."
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example file not found."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file with your actual configuration:"
    echo "   - Database connection (MongoDB)"
    echo "   - PayPal credentials"
    echo "   - Cloudinary settings"
    echo "   - Email configuration"
    echo "   - JWT secret"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
chmod +x deploy.sh

echo "🔧 Setting up development environment..."

# Check if MongoDB is running (optional)
if command -v mongo &> /dev/null; then
    if mongo --eval "db.adminCommand('ismaster')" &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start MongoDB with: mongod"
    fi
else
    echo "⚠️  MongoDB not found locally"
    echo "   Please ensure you have a MongoDB instance running"
    echo "   Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env"
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start development servers:"
echo "   npm run dev:full    # Start both backend and frontend"
echo "   npm run server      # Start backend only (port 5000)"
echo "   npm run client      # Start frontend only (port 3000)"
echo ""
echo "3. For production deployment:"
echo "   ./deploy.sh production"
echo ""
echo "📋 Project Structure:"
echo "   ├── server.js           # Main backend server"
echo "   ├── routes/             # API routes"
echo "   ├── models/             # Database models"
echo "   ├── middleware/         # Custom middleware"
echo "   ├── client/             # React frontend"
echo "   ├── .env                # Environment variables"
echo "   └── deploy.sh           # Deployment script"
echo ""
echo "🔗 URLs:"
echo "   Development Frontend: http://localhost:3000"
echo "   Development Backend:  http://localhost:5000"
echo "   API Health Check:     http://localhost:5000/api/health"
echo ""
echo "📚 Documentation: See README.md for detailed setup instructions"
echo ""
echo "⚠️  Remember to:"
echo "   - Configure your PayPal developer account"
echo "   - Set up Cloudinary for image storage"
echo "   - Configure email service for notifications"
echo "   - Set secure JWT secret in production"
echo ""
echo "🎊 Ready to launch PrivatLux! Happy coding!"