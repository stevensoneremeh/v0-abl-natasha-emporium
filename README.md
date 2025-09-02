# ABL NATASHA ENTERPRISES ✨

*Luxury Lifestyle E-commerce Platform - Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/thatkinds-projects/v0-abl-natasha-emporium)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/HN7L5o1YfHO)

## 🏆 Overview

ABL NATASHA ENTERPRISES is a premium luxury e-commerce platform featuring an exclusive collection of:

- 🏠 **Luxury Real Estate** - Premium properties and investments
- 🍷 **Premium Wines** - Vintage collections and rare bottles
- 🚗 **Exotic Cars** - Luxury and exotic automobiles
- 💇‍♀️ **Hair & Wigs** - Premium hair products and luxury wigs
- 🌸 **Perfumes** - Exclusive fragrances and luxury perfumes

## ✨ Features

### 🎨 **Design & UX**
- **Luxury Theme System** - Light/Dark mode with emerald and gold color palette
- **Framer Motion Animations** - Smooth transitions and engaging interactions
- **Mobile-First Responsive** - Optimized for all devices with bottom navigation
- **Video Hero Sections** - Immersive video backgrounds with layered imagery

### 🛒 **E-commerce**
- **Hybrid Authentication** - Guest shopping + registered user accounts
- **Complete Shopping Cart** - Add to cart from any page with persistent storage
- **Paystack Integration** - Secure payment processing for Nigerian market
- **Order Management** - Complete order tracking and history

### 👤 **User Experience**
- **User Dashboard** - Personal profile, order history, and wishlist
- **Guest Shopping** - Shop without registration with localStorage cart
- **Real Estate Previews** - Hover video previews for property listings
- **Product Galleries** - Interactive image galleries with zoom functionality

### 👑 **Admin System**
- **Environment-Based Access** - Admin control via ADMIN_EMAILS environment variable
- **Media Management** - Upload and organize images/videos with Vercel Blob
- **Product Management** - Complete CRUD operations for products and categories
- **User Management** - View and manage user accounts and permissions
- **Analytics Dashboard** - Sales metrics and performance insights

### 🚀 **Performance & SEO**
- **Structured Data** - Rich snippets for better search visibility
- **Image Optimization** - Next.js Image with lazy loading and blur placeholders
- **Dynamic Sitemap** - Auto-generated sitemap for SEO
- **Vercel Analytics** - Performance monitoring and insights

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Animations:** Framer Motion
- **Database:** Supabase with Row Level Security
- **Authentication:** Supabase Auth with hybrid guest/user system
- **Payments:** Paystack integration
- **Storage:** Vercel Blob for media files
- **Deployment:** Vercel with automatic deployments

## 🚀 Deployment

Your project is live at:

**[https://vercel.com/thatkinds-projects/v0-abl-natasha-emporium](https://vercel.com/thatkinds-projects/v0-abl-natasha-emporium)**

## 🔧 Environment Variables

Required environment variables for production:

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

## 📊 Database Setup

Run these SQL scripts in order in your Supabase SQL editor:

1. `scripts/01-create-database-schema.sql` - Create all tables and relationships
2. `scripts/02-setup-rls-policies.sql` - Enable Row Level Security policies
3. `scripts/03-create-storage-buckets.sql` - Create storage buckets for media
4. `scripts/04-fix-missing-columns.sql` - Add any missing columns
5. `scripts/05-setup-guest-sessions.sql` - Setup guest session management

## 🎯 Admin Access

The admin system uses environment-based access control. Add admin email addresses to the `ADMIN_EMAILS` environment variable:

\`\`\`bash
ADMIN_EMAILS=talktostevenson@gmail.com,admin2@example.com
\`\`\`

Admin users can access:
- `/admin` - Main admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/media` - Media management

## 🔄 How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 🏗️ Continue Building

Continue building your app on:

**[https://v0.app/chat/projects/HN7L5o1YfHO](https://v0.app/chat/projects/HN7L5o1YfHO)**

## 📞 Support

For deployment issues or support, contact: **talktostevenson@gmail.com**

---

**ABL NATASHA ENTERPRISES** - *Luxury Redefined* ✨
