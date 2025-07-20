# PrivatLux - Premium Escort Directory Website

A modern, full-featured escort directory website similar to Vivastreet, built with Next.js and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm package manager

### Step-by-Step Setup

#### 1. Clone and Install Dependencies
```bash
# Navigate to project folder
cd privatlux

# Install all dependencies
npm run install:all
```

#### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file with your settings:
# - MONGODB_URI=mongodb://localhost:27017/privatlux
# - JWT_SECRET=your_secret_key_here
```

#### 3. Frontend Setup
```bash
# Navigate to frontend
cd ../frontend

# Copy environment file
cp .env.local.example .env.local

# The defaults should work for development
```

#### 4. Start Development Servers

**Option A: Start both servers together (from root directory)**
```bash
npm run dev
```

**Option B: Start individually**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
privatlux/
├── frontend/          # Next.js React application
│   ├── pages/         # Next.js pages
│   ├── components/    # Reusable components
│   ├── styles/        # Global styles
│   └── public/        # Static assets
├── backend/           # Express.js API server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── app.js         # Main server file
└── package.json       # Root package file
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/privatlux
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🌟 Features

### ✅ Currently Implemented
- ✅ **Complete Project Structure** - Organized backend/frontend architecture
- ✅ **Backend API with Express.js** - RESTful API with security middleware
- ✅ **MongoDB Database Models** - User, Escort, Review, Message, Payment schemas
- ✅ **JWT Authentication System** - Login, register, role-based access
- ✅ **Complete Route System** - Auth, escorts, messages, reviews, uploads
- ✅ **Frontend with Next.js & Tailwind CSS** - Modern React-based UI
- ✅ **User Authentication Pages** - Professional login/register forms
- ✅ **Escort Listing Page** - Search, filters, pagination
- ✅ **Image Upload System** - Multi-file uploads with validation
- ✅ **Review & Rating System** - Complete review functionality
- ✅ **Private Messaging System** - User-to-user communication
- ✅ **Payment Integration Ready** - Payment models and structure
- ✅ **Responsive Design** - Mobile-first, professional UI
- ✅ **Security Features** - Rate limiting, validation, CORS protection

### 🚧 Additional Features to Complete
1. Escort profile detail pages
2. Admin panel for moderation
3. Payment processing (Stripe integration)
4. Email notifications
5. Advanced search with geolocation
6. Real-time messaging
7. Mobile app (React Native)
8. SEO optimization

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- Security headers with Helmet

## 📱 Technology Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Lucide React (icons)
- React Hook Form
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Various security middleware

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas cloud database
```

**Port Already in Use:**
```bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

**Dependencies Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the MongoDB and Node.js setup
- Ensure all environment variables are set correctly

---

**Ready to start development!** 🎯

The foundation is now set up. You can begin adding features step by step.