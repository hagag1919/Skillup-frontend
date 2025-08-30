# Vercel Deployment Guide

This guide will help you deploy both the SkillUp website and admin dashboard to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository pushed to GitHub, GitLab, or Bitbucket
3. Vercel CLI installed globally: `npm install -g vercel`

## Deployment Options

### Option 1: Deploy Both Apps as Separate Projects (Recommended)

This approach creates two separate Vercel projects for better isolation and management.

#### Deploy SkillUp Website

1. **Navigate to the project root:**
   ```bash
   cd "d:\Protofilo\Web app\skillup-frontend"
   ```

2. **Deploy using the website configuration:**
   ```bash
   vercel --prod
   ```
   - Select "skillup-website" as the project name
   - Use the existing `vercel.json` configuration
   - Set the root directory to current folder when prompted

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your Vercel dashboard
   - Select the skillup-website project
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_API_BASE_URL=https://your-api-url.com/api
     VITE_APP_NAME=SkillUp
     VITE_ENVIRONMENT=production
     VITE_SENTRY_DSN=your-sentry-dsn
     VITE_GA_TRACKING_ID=your-ga-tracking-id
     VITE_CDN_URL=https://cdn.skillup.com
     ```

#### Deploy Admin Dashboard

1. **Deploy using the admin configuration:**
   ```bash
   vercel --prod --local-config vercel-admin.json
   ```
   - Select "skillup-admin-dashboard" as the project name
   - Use the `vercel-admin.json` configuration

2. **Set Environment Variables for Admin Dashboard:**
   - Go to your Vercel dashboard
   - Select the skillup-admin-dashboard project
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_API_BASE_URL=https://your-api-url.com/api
     VITE_DASHBOARD_VERSION=1.0.0
     VITE_ENVIRONMENT=production
     VITE_SENTRY_DSN=your-sentry-dsn
     ```

### Option 2: Deploy via Vercel Dashboard

1. **Connect your repository:**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your Git repository

2. **Configure the website deployment:**
   - Project Name: `skillup-website`
   - Framework Preset: Vite
   - Root Directory: Leave as root (it will use the vercel.json config)
   - Build Command: `cd skillup-website && npm install && npm run build`
   - Output Directory: `skillup-website/dist`
   - Install Command: `cd skillup-website && npm install`

3. **Configure environment variables** as listed above

4. **Deploy the admin dashboard:**
   - Create a new project for the admin dashboard
   - Use the same repository but configure it with:
     - Project Name: `skillup-admin-dashboard`
     - Build Command: `cd admin-dashboard && npm install && npm run build`
     - Output Directory: `admin-dashboard/dist`
     - Install Command: `cd admin-dashboard && npm install`

## Custom Domain Setup

1. **For the main website:**
   - Go to your skillup-website project settings
   - Navigate to Domains
   - Add your custom domain (e.g., `skillup.com`)

2. **For the admin dashboard:**
   - Go to your skillup-admin-dashboard project settings
   - Navigate to Domains
   - Add your admin subdomain (e.g., `admin.skillup.com`)

## Automatic Deployments

Both projects will automatically redeploy when you push changes to your main branch. You can configure different branches for staging environments in the Vercel dashboard.

## Troubleshooting

### Build Issues
- Ensure all dependencies are properly installed
- Check that environment variables are correctly set
- Verify that the build commands work locally first

### Environment Variables
- Make sure all required VITE_ prefixed variables are set
- Environment variables should be added in the Vercel dashboard, not in .env files for production

### Routing Issues
- Both apps use client-side routing with React Router
- The vercel.json configurations handle this with the catch-all route to index.html

## Local Testing

Before deploying, test the build locally:

```bash
# Test website build
cd skillup-website
npm install
npm run build
npm run preview

# Test admin dashboard build
cd ../admin-dashboard
npm install
npm run build
npm run preview
```

## Production URLs

After deployment, your apps will be available at:
- Website: `https://skillup-website.vercel.app` (or your custom domain)
- Admin Dashboard: `https://skillup-admin-dashboard.vercel.app` (or your custom domain)

## Environment Variables Reference

### Website (.env)
```
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_APP_NAME=SkillUp
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_CDN_URL=https://cdn.skillup.com
```

### Admin Dashboard (.env)
```
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_DASHBOARD_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your-sentry-dsn
```
