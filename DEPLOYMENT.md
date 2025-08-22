# ABL Natasha Emporium - Production Deployment Guide

## Overview
This guide covers the complete deployment process for ABL Natasha Emporium, a luxury e-commerce platform built with Next.js 15, Supabase, and Vercel.

## Prerequisites
- Vercel account
- Supabase project
- Domain name (optional)

## Environment Variables
Set the following environment variables in your Vercel project:

### Database (Supabase)
\`\`\`
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Payments (Paystack)
\`\`\`
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
\`\`\`

### Admin Access
\`\`\`
ADMIN_EMAILS=talktostevenson@gmail.com,admin2@example.com
\`\`\`

### Application
\`\`\`
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

## Database Setup
1. Run the following SQL scripts in your Supabase SQL editor:
   - `scripts/01-create-database-schema.sql`
   - `scripts/02-setup-rls-policies.sql`
   - `scripts/03-create-storage-buckets.sql`
   - `scripts/04-fix-missing-columns.sql`
   - `scripts/05-setup-guest-sessions.sql`

## Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Next.js" framework preset

### 2. Configure Build Settings
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`
- Development Command: `pnpm dev`

### 3. Set Environment Variables
Add all environment variables listed above in the Vercel project settings.

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Post-Deployment Checklist

### Security
- [x] HTTPS enabled (automatic with Vercel)
- [x] Security headers configured
- [x] CSP policies implemented
- [x] Admin access restricted by email

### Performance
- [x] Image optimization enabled
- [x] Static asset caching configured
- [x] Compression enabled
- [x] Bundle optimization active

### Functionality
- [ ] Test user registration/login
- [ ] Test guest shopping flow
- [ ] Test admin dashboard access
- [ ] Test Paystack payments
- [ ] Test media uploads
- [ ] Test order management

### SEO
- [x] Meta tags configured
- [x] Structured data implemented
- [x] Sitemap generated
- [x] Robots.txt configured

## Monitoring
- Vercel Analytics enabled for performance monitoring
- Vercel Speed Insights enabled for Core Web Vitals
- Error tracking through Vercel Functions

## Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update NEXT_PUBLIC_BASE_URL environment variable

## Support
For deployment issues, contact the development team or check Vercel documentation.
