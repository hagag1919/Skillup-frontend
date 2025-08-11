# SkillUp Deployment Guide

A comprehensive guide for deploying the SkillUp e-learning platform to various hosting environments. This guide covers production deployment, environment configuration, monitoring, and maintenance procedures.

## 🚀 Deployment Overview

The SkillUp platform consists of two main applications:
- **SkillUp Website**: Student and instructor platform
- **Admin Dashboard**: Administrative interface

Both applications are built as static single-page applications (SPAs) that can be deployed to any static hosting provider.

## 🏗️ Build Process

### Prerequisites

Before deployment, ensure you have:
- Node.js v18+ installed
- Production environment variables configured
- Access to hosting platform credentials
- CI/CD pipeline configured (optional but recommended)

### Local Production Build

#### 1. Environment Setup

Create production environment files:

**skillup-website/.env.production:**
```env
VITE_API_BASE_URL=https://api.skillup.com
VITE_APP_NAME=SkillUp
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_CDN_URL=https://cdn.skillup.com
```

**admin-dashboard/.env.production:**
```env
VITE_API_BASE_URL=https://api.skillup.com
VITE_DASHBOARD_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-tracking-id
```

#### 2. Build Commands

```bash
# Install dependencies
npm install

# Build SkillUp Website
cd skillup-website
npm run build
cd ..

# Build Admin Dashboard
cd admin-dashboard
npm run build
cd ..
```

#### 3. Build Verification

```bash
# Preview builds locally
cd skillup-website
npm run preview

cd admin-dashboard
npm run preview
```

### Build Optimization

**Vite Production Configuration:**
```typescript
// vite.config.prod.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          router: ['react-router-dom'],
          store: ['@reduxjs/toolkit', 'react-redux'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});
```

## 🌐 Hosting Platforms

### AWS S3 + CloudFront

#### Setup Process

1. **Create S3 Buckets**
   ```bash
   # Create buckets for both applications
   aws s3 mb s3://skillup-website-prod
   aws s3 mb s3://skillup-admin-prod
   ```

2. **Configure S3 for Static Hosting**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::skillup-website-prod/*"
       }
     ]
   }
   ```

3. **Create CloudFront Distribution**
   ```json
   {
     "CallerReference": "skillup-website-cf-dist",
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "S3-skillup-website-prod",
           "DomainName": "skillup-website-prod.s3.amazonaws.com",
           "S3OriginConfig": {
             "OriginAccessIdentity": ""
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-skillup-website-prod",
       "ViewerProtocolPolicy": "redirect-to-https",
       "Compress": true
     },
     "CustomErrorResponses": {
       "Quantity": 1,
       "Items": [
         {
           "ErrorCode": 404,
           "ResponsePagePath": "/index.html",
           "ResponseCode": "200"
         }
       ]
     }
   }
   ```

4. **Deploy Script**
   ```bash
   #!/bin/bash
   # deploy-aws.sh

   echo "Building applications..."
   npm run build

   echo "Deploying SkillUp Website..."
   aws s3 sync skillup-website/dist/ s3://skillup-website-prod --delete
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

   echo "Deploying Admin Dashboard..."
   aws s3 sync admin-dashboard/dist/ s3://skillup-admin-prod --delete
   aws cloudfront create-invalidation --distribution-id YOUR_ADMIN_DISTRIBUTION_ID --paths "/*"

   echo "Deployment complete!"
   ```

### Vercel

#### Configuration

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "skillup-website/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "admin-dashboard/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin-dashboard/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/skillup-website/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/admin/:path*",
      "destination": "/admin/index.html"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

#### Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify

#### Configuration

**netlify.toml:**
```toml
[build]
  command = "npm run build:all"
  publish = "dist"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Deploy Script

```bash
#!/bin/bash
# deploy-netlify.sh

echo "Building for Netlify..."

# Build both applications
cd skillup-website && npm run build && cd ..
cd admin-dashboard && npm run build && cd ..

# Create combined dist directory
mkdir -p dist
cp -r skillup-website/dist/* dist/
mkdir -p dist/admin
cp -r admin-dashboard/dist/* dist/admin/

echo "Build complete. Ready for Netlify deployment."
```

### GitHub Pages

#### Workflow Configuration

**.github/workflows/deploy-pages.yml:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd skillup-website && npm ci && cd ..
          cd admin-dashboard && npm ci && cd ..

      - name: Build applications
        run: |
          cd skillup-website && npm run build && cd ..
          cd admin-dashboard && npm run build && cd ..

      - name: Combine builds
        run: |
          mkdir -p dist
          cp -r skillup-website/dist/* dist/
          mkdir -p dist/admin
          cp -r admin-dashboard/dist/* dist/admin/

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔧 CI/CD Pipelines

### GitHub Actions

**Complete CI/CD Pipeline:**

**.github/workflows/ci-cd.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Test and Lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [skillup-website, admin-dashboard]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: ${{ matrix.app }}/package-lock.json

      - name: Install dependencies
        working-directory: ${{ matrix.app }}
        run: npm ci

      - name: Run linting
        working-directory: ${{ matrix.app }}
        run: npm run lint

      - name: Run type checking
        working-directory: ${{ matrix.app }}
        run: npm run type-check

      - name: Run tests
        working-directory: ${{ matrix.app }}
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ${{ matrix.app }}/coverage/lcov.info
          flags: ${{ matrix.app }}

  build:
    name: Build Applications
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd skillup-website && npm ci && cd ..
          cd admin-dashboard && npm ci && cd ..

      - name: Build applications
        run: |
          cd skillup-website && npm run build && cd ..
          cd admin-dashboard && npm run build && cd ..

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: |
            skillup-website/dist/
            admin-dashboard/dist/

  deploy-staging:
    name: Deploy to Staging
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files

      - name: Deploy to staging
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: |
          aws s3 sync skillup-website/dist/ s3://skillup-staging --delete
          aws s3 sync admin-dashboard/dist/ s3://skillup-admin-staging --delete

  deploy-production:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files

      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          CLOUDFRONT_ADMIN_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_ADMIN_DISTRIBUTION_ID }}
        run: |
          aws s3 sync skillup-website/dist/ s3://skillup-production --delete
          aws s3 sync admin-dashboard/dist/ s3://skillup-admin-production --delete
          aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
          aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ADMIN_DISTRIBUTION_ID --paths "/*"

      - name: Notify deployment
        run: |
          echo "✅ Production deployment completed successfully!"
          echo "Website: https://skillup.com"
          echo "Admin: https://admin.skillup.com"
```

### GitLab CI/CD

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - skillup-website/node_modules/
    - admin-dashboard/node_modules/

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - cd skillup-website && npm ci && npm run test:coverage && cd ..
    - cd admin-dashboard && npm ci && npm run test:coverage && cd ..
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path:
          - skillup-website/coverage/cobertura-coverage.xml
          - admin-dashboard/coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - cd skillup-website && npm ci && npm run build && cd ..
    - cd admin-dashboard && npm ci && npm run build && cd ..
  artifacts:
    paths:
      - skillup-website/dist/
      - admin-dashboard/dist/
    expire_in: 1 hour
  only:
    - main
    - develop

deploy:staging:
  stage: deploy
  script:
    - aws s3 sync skillup-website/dist/ s3://skillup-staging --delete
    - aws s3 sync admin-dashboard/dist/ s3://skillup-admin-staging --delete
  environment:
    name: staging
    url: https://staging.skillup.com
  only:
    - develop

deploy:production:
  stage: deploy
  script:
    - aws s3 sync skillup-website/dist/ s3://skillup-production --delete
    - aws s3 sync admin-dashboard/dist/ s3://skillup-admin-production --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
  environment:
    name: production
    url: https://skillup.com
  only:
    - main
  when: manual
```

## 🔒 Security Configuration

### HTTPS and SSL

#### AWS Certificate Manager

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name skillup.com \
  --subject-alternative-names admin.skillup.com \
  --validation-method DNS
```

#### Security Headers

**nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name skillup.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Environment Secrets

#### AWS Systems Manager Parameter Store

```bash
# Store secrets in Parameter Store
aws ssm put-parameter \
  --name "/skillup/prod/api-url" \
  --value "https://api.skillup.com" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/skillup/prod/sentry-dsn" \
  --value "your-sentry-dsn" \
  --type "SecureString"
```

#### GitHub Secrets

Required secrets for GitHub Actions:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `CLOUDFRONT_ADMIN_DISTRIBUTION_ID`
- `SENTRY_DSN`
- `GA_TRACKING_ID`

## 📊 Monitoring and Analytics

### Application Monitoring

#### Sentry Integration

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT,
  integrations: [
    new BrowserTracing({
      tracingOrigins: [
        'localhost',
        /^https:\/\/api\.skillup\.com/,
      ],
    }),
  ],
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out development errors
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      return null;
    }
    return event;
  },
});
```

#### Performance Monitoring

```typescript
// src/utils/performance.ts
export const performanceMonitor = {
  markStart: (name: string) => {
    performance.mark(`${name}-start`);
  },

  markEnd: (name: string) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration}ms`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(measure.duration)
      });
    }
  }
};
```

### Infrastructure Monitoring

#### CloudWatch Alarms

```bash
# Create CloudWatch alarm for 4xx errors
aws cloudwatch put-metric-alarm \
  --alarm-name "SkillUp-4xx-Errors" \
  --alarm-description "Alert on 4xx errors" \
  --metric-name "4xxErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic "Average" \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator "GreaterThanThreshold" \
  --dimensions Name=DistributionId,Value=YOUR_DISTRIBUTION_ID \
  --evaluation-periods 2
```

#### Health Checks

```typescript
// src/utils/healthCheck.ts
export const healthCheck = {
  async checkAPI(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  async checkServices(): Promise<{ [key: string]: boolean }> {
    const checks = {
      api: await this.checkAPI(),
      localStorage: this.checkLocalStorage(),
      sessionStorage: this.checkSessionStorage(),
    };

    // Report to monitoring service
    Object.entries(checks).forEach(([service, status]) => {
      if (!status) {
        console.error(`Service ${service} is down`);
        // Send alert to monitoring service
      }
    });

    return checks;
  },

  checkLocalStorage(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  },

  checkSessionStorage(): boolean {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }
};
```

## 🔄 Backup and Recovery

### Code Repository Backup

```bash
#!/bin/bash
# backup-repo.sh

BACKUP_DIR="/backups/skillup-$(date +%Y%m%d)"
REPO_URL="https://github.com/skillup/skillup-frontend.git"

# Clone repository
git clone $REPO_URL $BACKUP_DIR

# Create archive
tar -czf "${BACKUP_DIR}.tar.gz" $BACKUP_DIR

# Upload to S3
aws s3 cp "${BACKUP_DIR}.tar.gz" s3://skillup-backups/code/

# Cleanup local backup
rm -rf $BACKUP_DIR "${BACKUP_DIR}.tar.gz"

echo "Backup completed: ${BACKUP_DIR}.tar.gz"
```

### Database Backup (if applicable)

```bash
#!/bin/bash
# backup-database.sh

BACKUP_FILE="skillup-db-$(date +%Y%m%d-%H%M%S).sql"

# Dump database
pg_dump $DATABASE_URL > $BACKUP_FILE

# Encrypt backup
gpg --symmetric --cipher-algo AES256 $BACKUP_FILE

# Upload to S3
aws s3 cp "${BACKUP_FILE}.gpg" s3://skillup-backups/database/

# Cleanup
rm $BACKUP_FILE "${BACKUP_FILE}.gpg"

echo "Database backup completed: ${BACKUP_FILE}.gpg"
```

### Disaster Recovery Plan

1. **Repository Recovery**
   - Clone from GitHub backup
   - Restore from S3 backup if needed
   - Rebuild applications

2. **Infrastructure Recovery**
   - Recreate AWS resources using Infrastructure as Code
   - Restore DNS settings
   - Update CDN configurations

3. **Data Recovery**
   - Restore database from latest backup
   - Verify data integrity
   - Test application functionality

## 📈 Scaling Strategies

### CDN Optimization

```typescript
// vite.config.ts - CDN configuration
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins: [
    {
      name: 'cdn-imports',
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>`
        );
      }
    }
  ]
});
```

### Load Balancing

**nginx Configuration:**
```nginx
upstream skillup_app {
    server 10.0.1.100:80;
    server 10.0.1.101:80;
    server 10.0.1.102:80;
}

server {
    listen 80;
    server_name skillup.com;

    location / {
        proxy_pass http://skillup_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🛠️ Maintenance Procedures

### Regular Maintenance Tasks

#### Weekly Tasks
```bash
#!/bin/bash
# weekly-maintenance.sh

echo "Starting weekly maintenance..."

# Update dependencies
npm audit fix
npm update

# Run full test suite
npm run test:full

# Check for security vulnerabilities
npm audit

# Generate performance report
npm run lighthouse

# Update documentation
npm run docs:build

echo "Weekly maintenance completed."
```

#### Monthly Tasks
```bash
#!/bin/bash
# monthly-maintenance.sh

echo "Starting monthly maintenance..."

# Analyze bundle sizes
npm run analyze

# Update Docker images
docker pull node:18-alpine

# Review and update dependencies
npm outdated

# Performance benchmarking
npm run benchmark

# Security scan
npm run security:scan

echo "Monthly maintenance completed."
```

### Update Procedures

#### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update minor versions
npm update

# Update major versions (review breaking changes first)
npm install package@latest

# Test after updates
npm run test:full
npm run build
npm run e2e
```

#### Security Updates
```bash
# Check for security vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Review and manually fix remaining issues
npm audit fix --force

# Verify fixes
npm audit
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] CDN configuration verified

### Deployment
- [ ] Build artifacts created
- [ ] Staging deployment successful
- [ ] Smoke tests passed
- [ ] Production deployment initiated
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Cache invalidation completed

### Post-deployment
- [ ] Application accessible
- [ ] Core functionality working
- [ ] Performance metrics normal
- [ ] Error rates within acceptable limits
- [ ] User acceptance testing completed
- [ ] Rollback plan ready if needed
- [ ] Team notified of deployment
- [ ] Documentation updated with any changes

---

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

#### Environment Variable Issues
```bash
# Verify environment variables
printenv | grep VITE_

# Check build output for variable replacement
grep -r "import.meta.env" dist/
```

#### Routing Issues (SPA)
```nginx
# Ensure proper SPA routing configuration
location / {
    try_files $uri $uri/ /index.html;
}
```

#### CORS Issues
```javascript
// Verify API base URL configuration
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

### Performance Issues

#### Bundle Size Analysis
```bash
# Generate bundle analysis
npm run build -- --analyze

# Check for duplicate dependencies
npx webpack-bundle-analyzer dist/stats.json
```

#### Memory Leaks
```javascript
// Monitor memory usage in browser DevTools
// Check for unremoved event listeners
// Verify component cleanup in useEffect
```

---

**Deployment Guide Complete** 🚀

This deployment guide should be updated as new hosting platforms are added or deployment procedures change. Always test deployment procedures in staging environments before applying to production.
