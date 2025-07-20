# 🚀 Deploy PrivatLux Website to Live

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `privatlux-website`
4. Make it **Public** (required for free deployment)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/privatlux-website.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `privatlux-website` repository
4. Set **Root Directory** to: `backend`
5. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatlux
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   PORT=10000
   ```
6. Click "Deploy Now"

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project" → Import your `privatlux-website` repository
3. Set **Root Directory** to: `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app
   ```
5. Click "Deploy"

## Step 5: Update Frontend API URL

After Railway deployment, copy your Railway app URL and update the frontend environment variable in Vercel.

## Your Website Will Be Live At:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

## 🎉 Done!
Your PrivatLux website is now live and accessible worldwide! 