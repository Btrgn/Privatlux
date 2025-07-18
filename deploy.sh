#!/bin/bash

# PrivatLux Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}
APP_NAME="privatlux"
PM2_APP_NAME="privatlux"

echo "🚀 Starting deployment for PrivatLux ($ENVIRONMENT)..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file with required environment variables"
    exit 1
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm ci --only=production

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd client
npm ci
echo "🏗️ Building frontend..."
npm run build
cd ..

# Run database migrations (if any)
if [ -f "migrations/migrate.js" ]; then
    echo "🗄️ Running database migrations..."
    node migrations/migrate.js
fi

# Stop existing PM2 process
echo "🛑 Stopping existing application..."
pm2 stop $PM2_APP_NAME || true

# Start application with PM2
echo "▶️ Starting application..."
pm2 start server.js --name $PM2_APP_NAME --env $ENVIRONMENT

# Save PM2 configuration
pm2 save

# Show status
pm2 status

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: https://privatlux.co.uk"

# Run health check
echo "🏥 Running health check..."
sleep 5

# Check if application is responding
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Health check passed - Application is responding"
else
    echo "❌ Health check failed - Application may not be running correctly"
    echo "Check logs with: pm2 logs $PM2_APP_NAME"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "Useful commands:"
echo "  pm2 logs $PM2_APP_NAME     # View application logs"
echo "  pm2 status                # View PM2 status"
echo "  pm2 restart $PM2_APP_NAME # Restart application"
echo "  pm2 stop $PM2_APP_NAME    # Stop application"
echo ""
echo "Application URLs:"
echo "  Production: https://privatlux.co.uk"
echo "  Admin Panel: https://privatlux.co.uk/admin"