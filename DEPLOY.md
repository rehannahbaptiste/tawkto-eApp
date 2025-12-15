# 🚀 Deploy to Render - Step by Step Guide

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com - it's free!)

## Step 1: Push Your Code to GitHub

1. **Initialize git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Convert to Node.js application"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/tawkto-eApp.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Render

### Method A: Using Blueprint (Recommended - Easiest!)

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Click **"Apply"**
6. Your app will be deployed automatically! 🎉

### Method B: Manual Setup

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `tawkto-eapp` (or your choice)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Click **"Advanced"** and add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically)

6. Click **"Create Web Service"**

## Step 3: Your API is Live!

Your API will be available at:
```
https://tawkto-eapp.onrender.com
```

### Test Your Endpoints

**Get Services:**
```bash
curl https://tawkto-eapp.onrender.com/api/services
```

**Get Branches:**
```bash
curl https://tawkto-eapp.onrender.com/api/branches
```

**Select Service:**
```bash
curl -X POST https://tawkto-eapp.onrender.com/api/selections/service \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "svc-001"}'
```

**Select Branch:**
```bash
curl -X POST https://tawkto-eapp.onrender.com/api/selections/branch \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "svc-001", "branchId": "br-001"}'
```

## 📊 Optional: Add a Database

If you want to store data in PostgreSQL instead of in-memory:

1. In Render Dashboard, click **"New"** → **"PostgreSQL"**
2. Choose the **Free** plan
3. Create the database
4. Copy the **Internal Database URL**
5. Go to your Web Service → **Environment**
6. Add environment variable:
   - `DATABASE_URL` = paste the connection string
7. Redeploy your service

## 🔄 Auto-Deploy Updates

Every time you push to GitHub, Render will automatically redeploy:

```bash
git add .
git commit -m "Update feature"
git push
```

## 📝 Important Notes

- **Free tier**: Your service will spin down after 15 minutes of inactivity
- **Cold starts**: First request after inactivity takes ~30 seconds
- **Upgrade**: For 24/7 uptime, upgrade to paid plan ($7/month)

## 🎉 Success!

Your Node.js API is now running on Render!

Visit your service URL to see it live.
