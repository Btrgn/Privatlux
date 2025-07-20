# 🗄️ MongoDB Atlas Setup (Free Database)

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create account with email/password

## Step 2: Create Free Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region closest to you
5. Click "Create"

## Step 3: Set Up Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `privatlux_user`
4. Password: Create a strong password
5. Role: "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `privatlux`

## Example Connection String:
```
mongodb+srv://privatlux_user:yourpassword@cluster0.xxxxx.mongodb.net/privatlux
```

## Step 6: Use in Railway

Copy this connection string and use it as the `MONGODB_URI` environment variable in Railway.

## 🎉 Database Ready!
Your MongoDB database is now ready for the PrivatLux website! 