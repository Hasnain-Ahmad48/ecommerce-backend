# MongoDB Connection Setup Guide

## Current Issue
Your `.env` file contains a placeholder MongoDB connection string that needs to be replaced with your actual MongoDB Atlas connection string.

## Steps to Fix:

### 1. Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Log in to your account
3. Select or create your cluster
4. Click **"Connect"** button
5. Choose **"Connect your application"**
6. Copy the connection string

### 2. Update Your .env File

Your `.env` file should contain:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE_NAME?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Important Notes:**
- Replace `YOUR_USERNAME` with your MongoDB Atlas database username
- Replace `YOUR_PASSWORD` with your MongoDB Atlas database password
  - **If your password contains special characters**, you need to URL-encode them:
    - `@` becomes `%40`
    - `#` becomes `%23`
    - `$` becomes `%24`
    - etc.
- Replace `YOUR_CLUSTER.mongodb.net` with your actual cluster hostname
- Replace `YOUR_DATABASE_NAME` with your database name (e.g., `mern_ecom`)

### 3. Verify IP Whitelist

1. In MongoDB Atlas, go to **Network Access**
2. Make sure your current IP address is whitelisted
3. Or add `0.0.0.0/0` for development (allows all IPs - not recommended for production)

### 4. Test the Connection

After updating your `.env` file, run:
```bash
node server.js
```

You should see:
```
✅ MongoDB Connected Successfully
```

## Example Connection String Format:
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/mern_ecom?retryWrites=true&w=majority
```

**DO NOT use the example above** - it's just showing the format. Use your own credentials!

