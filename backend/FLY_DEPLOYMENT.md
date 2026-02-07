# Fly.io Deployment Guide

This guide will help you deploy the Liberia Digital Insights backend to Fly.io.

## Prerequisites

1. A Fly.io account (sign up at https://fly.io)
2. Fly CLI installed on your machine
3. Your Supabase credentials ready

## Step 1: Install Fly CLI

**macOS/Linux:**

```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**

```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

## Step 2: Authenticate

```bash
fly auth login
```

This will open a browser window for you to log in.

## Step 3: Navigate to Backend Directory

```bash
cd backend
```

## Step 4: Launch Your App

```bash
fly launch
```

When prompted:

- **App name**: Press Enter to use `liberia-digital-insights-api` (or choose your own)
- **Region**: Choose the closest to your users (e.g., `iad` for US East)
- **PostgreSQL**: No (we're using Supabase)
- **Redis**: No
- **Deploy now**: No (we need to set secrets first)

## Step 5: Set Environment Variables (Secrets)

Replace the placeholder values with your actual credentials:

```bash
fly secrets set \
  NODE_ENV=production \
  PORT=8080 \
  SUPABASE_URL=https://your-project.supabase.co \
  SUPABASE_ANON_KEY=your-anon-key-here \
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here \
  JWT_SECRET=your-random-secret-string-here \
  CORS_ORIGIN=https://your-frontend.vercel.app
```

> **Note**: Generate a strong JWT_SECRET using: `openssl rand -base64 32`

## Step 6: Deploy

```bash
fly deploy
```

This will:

1. Build your Docker image
2. Push it to Fly.io's registry
3. Deploy it to your chosen region
4. Start your application

## Step 7: Get Your API URL

```bash
fly status
```

Your API URL will be: `https://liberia-digital-insights-api.fly.dev`

## Step 8: Update Frontend

Update your frontend's `VITE_API_URL` environment variable to point to your new Fly.io URL:

```
VITE_API_URL=https://liberia-digital-insights-api.fly.dev
```

## Step 9: Update CORS

Once your frontend is deployed, update the CORS_ORIGIN secret:

```bash
fly secrets set CORS_ORIGIN=https://your-actual-frontend.vercel.app
```

## Useful Commands

### View logs

```bash
fly logs
```

### SSH into your app

```bash
fly ssh console
```

### Scale your app

```bash
fly scale count 2  # Run 2 instances
```

### Check app info

```bash
fly info
```

### Open app in browser

```bash
fly open
```

## Troubleshooting

### App won't start

Check logs: `fly logs`

### Environment variables not working

List secrets: `fly secrets list`
Set missing ones: `fly secrets set KEY=value`

### Need to redeploy

```bash
fly deploy --force
```

## Free Tier Limits

Fly.io's free tier includes:

- Up to 3 shared-cpu-1x VMs with 256MB RAM each
- 3GB persistent volume storage
- 160GB outbound data transfer

Your app will automatically scale to 0 when not in use and wake up on incoming requests.

## Next Steps

1. Deploy your frontend to Vercel
2. Update CORS_ORIGIN with your frontend URL
3. Test your API endpoints
4. Monitor your app with `fly logs`

---

**Need help?** Check out [Fly.io's documentation](https://fly.io/docs/) or their [community forum](https://community.fly.io/).
