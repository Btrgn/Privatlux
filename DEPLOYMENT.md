# PrivatLux Deployment Guide

This guide will help you deploy your PrivatLux website to make it live on the internet.

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Install Vercel CLI** (if you have Node.js):
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., https://your-backend.railway.app)

#### Backend (Railway)
1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Select the backend folder** or deploy the entire project
4. **Set Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
   - `PORT`: 10000

### Option 2: Vercel + Render

#### Frontend (Vercel)
Same as above.

#### Backend (Render)
1. **Go to [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

### Option 3: Netlify + Heroku

#### Frontend (Netlify)
1. **Go to [Netlify.com](https://netlify.com)**
2. **Connect your GitHub repository**
3. **Build settings**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/out`

#### Backend (Heroku)
1. **Install Heroku CLI**
2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
3. **Deploy**:
   ```bash
   git push heroku main
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatlux
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=10000
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📦 Database Setup

### MongoDB Atlas (Recommended)
1. **Create account** at [MongoDB Atlas](https://mongodb.com/atlas)
2. **Create cluster**
3. **Get connection string**
4. **Add to environment variables**

### Alternative: Railway MongoDB
Railway provides MongoDB databases that can be easily connected to your backend.

## 🔒 Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use HTTPS in production
- [ ] Secure MongoDB connection
- [ ] Set up proper environment variables

## 🌐 Domain Setup

### Custom Domain (Optional)
1. **Purchase domain** (e.g., privatlux.com)
2. **Configure DNS** to point to your deployment
3. **Set up SSL certificates** (automatic with Vercel/Railway)

## 📱 Testing Your Deployment

1. **Test API endpoints**: `https://your-backend-url.com/api/health`
2. **Test frontend**: `https://your-frontend-url.com`
3. **Test user registration/login**
4. **Test file uploads**
5. **Test payment integration**

## 🚨 Troubleshooting

### Common Issues:
- **CORS errors**: Check CORS configuration in backend
- **Database connection**: Verify MongoDB URI
- **Build failures**: Check Node.js version compatibility
- **Environment variables**: Ensure all required vars are set

### Support:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [railway.app/docs](https://railway.app/docs)
- Render: [render.com/docs](https://render.com/docs)

## 🎉 Success!

Once deployed, your PrivatLux website will be live and accessible worldwide! 