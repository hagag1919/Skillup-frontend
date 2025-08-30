#!/bin/bash

# SkillUp Frontend Deployment Script for Vercel

echo "🚀 Starting SkillUp Frontend Deployment to Vercel"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Function to deploy website
deploy_website() {
    echo "📱 Deploying SkillUp Website..."
    cd skillup-website
    
    # Install dependencies
    echo "📦 Installing website dependencies..."
    npm install
    
    # Test build locally
    echo "🔨 Testing website build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Website build successful"
        cd ..
        
        # Deploy to Vercel
        echo "🌐 Deploying to Vercel..."
        vercel --prod
        
        echo "✅ Website deployment completed!"
    else
        echo "❌ Website build failed. Please fix the errors before deploying."
        exit 1
    fi
}

# Function to deploy admin dashboard
deploy_admin() {
    echo "👑 Deploying Admin Dashboard..."
    cd admin-dashboard
    
    # Install dependencies
    echo "📦 Installing admin dashboard dependencies..."
    npm install
    
    # Test build locally
    echo "🔨 Testing admin dashboard build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Admin dashboard build successful"
        cd ..
        
        # Deploy to Vercel using admin config
        echo "🌐 Deploying admin dashboard to Vercel..."
        vercel --prod --local-config vercel-admin.json
        
        echo "✅ Admin dashboard deployment completed!"
    else
        echo "❌ Admin dashboard build failed. Please fix the errors before deploying."
        exit 1
    fi
}

# Main deployment logic
case "$1" in
    "website")
        deploy_website
        ;;
    "admin")
        deploy_admin
        ;;
    "both"|"")
        deploy_website
        deploy_admin
        ;;
    *)
        echo "Usage: $0 [website|admin|both]"
        echo "  website - Deploy only the SkillUp website"
        echo "  admin   - Deploy only the admin dashboard"
        echo "  both    - Deploy both applications (default)"
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure custom domains if needed"
echo "3. Check the deployment URLs in your Vercel dashboard"
