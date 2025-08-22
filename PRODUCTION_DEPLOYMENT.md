# ABL NATASHA EMPORIUM - Production Deployment Guide

## 🚀 Production Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Supabase project set up
- Environment variables configured

### Environment Variables Required

Add these environment variables in your Vercel project settings:

\`\`\`bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Admin Access
ADMIN_EMAILS=talktostevenson@gmail.com,admin2@example.com

# Payments
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### Database Setup

1. **Run SQL Scripts in Order:**
   \`\`\`sql
   -- 1. Create database schema
   scripts/01-create-database-schema.sql
   
   -- 2. Setup RLS policies
   scripts/02-setup-rls-policies.sql
   
   -- 3. Create storage buckets
   scripts/03-create-storage-buckets.sql
   
   -- 4. Fix missing columns
   scripts/04-fix-missing-columns.sql
   
   -- 5. Setup guest sessions
   scripts/05-setup-guest-sessions.sql
   \`\`\`

2. **Enable Row Level Security (RLS)** on all tables in Supabase dashboard

### Deployment Steps

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "Next.js" as framework preset

2. **Configure Build Settings:**
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables listed above

4. **Deploy:**
   - Click "Deploy" button
   - Wait for build to complete

### Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] RLS policies enabled
- [ ] Admin access working with ADMIN_EMAILS
- [ ] Theme switching functional
- [ ] Payment integration working
- [ ] Media upload working
- [ ] Mobile responsiveness verified
- [ ] SEO metadata loading correctly
- [ ] Analytics tracking active

### Performance Optimizations Included

✅ **Image Optimization:** Next.js Image component with lazy loading
✅ **Code Splitting:** Automatic route-based code splitting
✅ **Caching:** Proper cache headers and static asset optimization
✅ **SEO:** Structured data, meta tags, and sitemap
✅ **Analytics:** Vercel Analytics and Speed Insights
✅ **Security:** CSP headers and secure authentication

### Features Included

🎨 **Theme System:** Light/Dark mode with luxury color palette
🛒 **E-commerce:** Complete shopping cart and checkout with Paystack
👤 **Authentication:** Hybrid system (guest + registered users)
📱 **Responsive:** Mobile-first design with bottom navigation
🏠 **Real Estate:** Property listings with video previews
🍷 **Product Catalog:** Wines, cars, hair products, perfumes
👑 **Admin Dashboard:** Complete admin panel with media management
🎬 **Animations:** Framer Motion transitions throughout

### Support

For deployment issues, contact: talktostevenson@gmail.com

---

**ABL NATASHA EMPORIUM** - Luxury Redefined ✨
