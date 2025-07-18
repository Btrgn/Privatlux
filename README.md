# PrivatLux.co.uk - Premium Adult Escort Platform

An exclusive, premium adult escort listing platform built for the UK market. Features sophisticated design, membership-based access, and comprehensive payment integration.

## 🌟 Features

### Core Platform Features
- **Dual User System**: Separate registration and dashboards for Members and Escorts
- **Premium Content Access**: Blurred photos/content for non-members, full access for paid members
- **Professional Design**: Dark theme with gold/pink accents, mobile-optimized
- **Payment Integration**: PayPal integration for memberships and escort subscriptions
- **Admin Management**: Complete admin dashboard for user and content management

### Member Features
- Monthly/yearly membership subscriptions
- Access to unblurred photos and full contact details
- Favorites system
- Advanced search and filtering
- Personalized recommendations
- Location-based browsing

### Escort Features
- Profile creation and management
- Photo gallery with automatic blur generation
- Pricing and availability management
- Subscription-based listing (Basic/Premium/VIP tiers)
- Verification badge system
- Analytics and view tracking

### Security & Compliance
- GDPR compliant with full privacy controls
- JWT-based authentication
- Rate limiting and security headers
- Image processing and storage via Cloudinary
- Comprehensive privacy policy and terms

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **PayPal SDK** for payments
- **Cloudinary** for image processing
- **Sharp** for image optimization
- **Helmet** for security headers

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Styled Components** for styling
- **React Query** for data fetching
- **React Hook Form** for forms
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 📋 Installation & Setup

### Prerequisites
- Node.js 14+
- MongoDB instance
- Cloudinary account
- PayPal developer account

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd privatlux-platform
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

3. **Environment Configuration**
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatlux

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Domain
DOMAIN=https://privatlux.co.uk
CLIENT_URL=https://privatlux.co.uk

# Security
CORS_ORIGIN=https://privatlux.co.uk
SESSION_SECRET=your_session_secret_key

# Admin
ADMIN_EMAIL=admin@privatlux.co.uk
ADMIN_PASSWORD=secure_admin_password
```

### Development Setup

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the development servers**
```bash
# Start both backend and frontend
npm run dev:full

# Or start separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### Production Deployment

#### Hostinger VPS Setup

1. **Connect to your Hostinger VPS**
```bash
ssh root@your-server-ip
```

2. **Install Node.js and MongoDB**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **Install PM2 for process management**
```bash
sudo npm install -g pm2
```

4. **Deploy the application**
```bash
# Clone your repository
git clone <your-repository>
cd privatlux-platform

# Install dependencies
npm install
cd client && npm install && npm run build
cd ..

# Set up environment variables
nano .env
# Add your production environment variables

# Start with PM2
pm2 start server.js --name "privatlux"
pm2 startup
pm2 save
```

5. **Setup Nginx as reverse proxy**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/privatlux.co.uk
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name privatlux.co.uk www.privatlux.co.uk;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/privatlux.co.uk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d privatlux.co.uk -d www.privatlux.co.uk
```

## 💳 Payment Configuration

### PayPal Setup
1. Create a PayPal Developer account
2. Create a new application
3. Get your Client ID and Secret
4. Configure webhook endpoints for payment notifications

### Pricing Structure
- **Member Subscriptions**:
  - Monthly: £29.99
  - Yearly: £299.99

- **Escort Subscriptions**:
  - Basic: £49.99/month
  - Premium: £99.99/month
  - VIP: £199.99/month

## 📊 Admin Features

### Dashboard Analytics
- User registration statistics
- Revenue tracking
- Popular locations
- Escort approval queue

### User Management
- View/edit all users
- Activate/deactivate accounts
- Membership management
- Payment history

### Content Moderation
- Escort profile approval
- Photo verification
- Content reporting
- Verification badges

## 🔐 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: API endpoint protection
- **Data Validation**: Input sanitization and validation
- **Image Security**: Automatic content filtering
- **GDPR Compliance**: Data protection and user rights

## 📱 Mobile Optimization

The platform is fully responsive and optimized for:
- Mobile phones (iOS/Android)
- Tablets
- Desktop browsers
- Progressive Web App features

## 🛠 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Escort Endpoints
- `GET /api/escorts` - List escorts with filters
- `GET /api/escorts/:id` - Get escort details
- `POST /api/escorts/profile` - Create escort profile
- `PUT /api/escorts/profile` - Update escort profile

### Payment Endpoints
- `GET /api/payments/plans` - Get pricing plans
- `POST /api/payments/create` - Create payment
- `POST /api/payments/execute` - Execute payment
- `GET /api/payments/history` - Payment history

### Member Endpoints
- `GET /api/members/favorites` - Get favorites
- `POST /api/members/favorites/:id` - Add to favorites
- `GET /api/members/recommendations` - Get recommendations

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/escorts` - Manage escorts
- `PUT /api/admin/escorts/:id/status` - Approve/reject escorts

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start backend only
npm run client       # Start frontend only
npm run dev:full     # Start both servers

# Production
npm run build        # Build frontend
npm start           # Start production server

# Database
npm run seed        # Seed database with sample data
npm run migrate     # Run database migrations
```

## 📞 Support & Maintenance

### Monitoring
- Server monitoring with PM2
- Error logging and reporting
- Performance metrics
- Database backup schedule

### Updates
- Regular security updates
- Feature enhancement releases
- Payment gateway updates
- Compliance updates

## 📋 Legal Compliance

### Privacy & Data Protection
- GDPR compliant data handling
- Cookie consent management
- Data retention policies
- User data export/deletion

### Age Verification
- 18+ age verification required
- Identity document verification for escorts
- Account verification process

### Content Guidelines
- No explicit content on homepage
- Content moderation system
- Reporting mechanisms
- Terms of service enforcement

## 🌍 Deployment Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Database secured and backed up
- [ ] Payment gateway configured
- [ ] Email service configured
- [ ] Image storage configured
- [ ] Error monitoring setup
- [ ] Analytics tracking setup
- [ ] Legal pages completed
- [ ] Admin account created
- [ ] Security headers configured
- [ ] Performance optimization
- [ ] Mobile testing completed

## 📄 License

This project is proprietary software developed for PrivatLux.co.uk. All rights reserved.

## 🤝 Contributing

This is a private commercial project. Contact the development team for contribution guidelines.

---

**PrivatLux.co.uk** - Premium Adult Entertainment Platform
Contact: support@privatlux.co.uk
