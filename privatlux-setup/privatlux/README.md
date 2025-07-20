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
- Project structure setup
- Backend API with Express.js
- MongoDB database models
- JWT authentication system
- Frontend with Next.js and Tailwind CSS
- Responsive homepage design
- Security middleware

### 🚧 Next Steps to Complete
1. Create escort listing routes
2. Add user registration/login pages
3. Build escort profile components
4. Implement search and filtering
5. Add image upload functionality
6. Create admin panel
7. Add messaging system
8. Implement payment processing

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