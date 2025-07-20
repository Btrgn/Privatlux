#!/bin/bash

echo "🚀 PrivatLux Deployment Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Deployment Options:"
echo "1. Vercel (Frontend) + Railway (Backend) - Recommended"
echo "2. Vercel (Frontend) + Render (Backend)"
echo "3. Netlify (Frontend) + Heroku (Backend)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🔧 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Choose a deployment platform"
echo "3. Set up environment variables"
echo "4. Deploy!" 