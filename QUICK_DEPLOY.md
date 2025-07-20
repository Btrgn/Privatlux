# 🚀 Quick Deploy to Make Your Website Live

## Option 1: Vercel + Railway (Fastest - 5 minutes)

### Step 1: Deploy Backend to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatlux
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   PORT=10000
   ```
7. Deploy!

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project" → Import your repository
4. Set root directory to `frontend`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app
   ```
6. Deploy!

## Option 2: Render (Alternative - 10 minutes)

### Backend on Render
1. Go to [Render.com](https://render.com)
2. Create account
3. "New Web Service" → Connect GitHub repo
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables (same as above)
6. Deploy!

### Frontend on Vercel
Same as Option 1, Step 2.

## 🔧 Required Setup

### 1. MongoDB Database
- Go to [MongoDB Atlas](https://mongodb.com/atlas)
- Create free cluster
- Get connection string
- Add to environment variables

### 2. Environment Variables
**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatlux
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=10000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## ✅ Your Website Will Be Live At:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app` or `https://your-app.onrender.com`

## 🎉 Done!
Your PrivatLux website is now live and accessible worldwide!

## 📞 Need Help?
- Check the full `DEPLOYMENT.md` guide
- Contact platform support
- Check deployment logs for errors 