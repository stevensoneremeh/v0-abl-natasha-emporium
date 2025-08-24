# ABL NATASHA ENTERPRISES - Admin Access Guide

## 🔐 Admin Access Instructions

### How to Access the Admin Dashboard

1. **Navigate to Admin Login**
   - Go to: `https://your-domain.com/admin`
   - Or use the direct admin login URL: `https://your-domain.com/admin/login`

2. **Admin Credentials**
   - **Email**: Use any email address listed in the `ADMIN_EMAILS` environment variable
   - **Password**: Use your regular account password
   - The system automatically grants admin access to emails in the admin list

3. **Admin Email Configuration**
   - Admin emails are configured in the `ADMIN_EMAILS` environment variable
   - Format: `admin1@example.com,admin2@example.com,admin3@example.com`
   - To add new admins, update this environment variable in your Vercel project settings

### Admin Dashboard Features

#### 📊 **Dashboard Overview** (`/admin/dashboard`)
- Real-time analytics and key metrics
- Sales performance charts
- User activity monitoring
- Quick action buttons for common tasks

#### 👥 **User Management** (`/admin/users`)
- View all registered users
- User activity tracking
- Account status management
- User role assignments

#### 📦 **Product Management** (`/admin/products`)
- Add, edit, and delete products
- Bulk product operations
- Inventory management
- Product category organization
- Image upload and management

#### 🛒 **Order Management** (`/admin/orders`)
- View all customer orders
- Order status updates
- Payment tracking
- Shipping management
- Order fulfillment workflow

#### 🏠 **Real Estate Management** (`/admin/real-estate`)
- Property listings management
- Booking requests handling
- Property media management
- Pricing and availability updates

#### 📁 **Media Management** (`/admin/media`)
- Upload and organize images
- File management system
- Bulk media operations
- Storage usage monitoring

#### ⚙️ **System Settings** (`/admin/settings`)
- Environment variables access
- System configuration
- Integration management
- Security settings

### 🔒 Security Features

1. **Role-Based Access Control**
   - Only emails in `ADMIN_EMAILS` can access admin features
   - Automatic permission checking on all admin routes
   - Session-based authentication

2. **Protected Routes**
   - All `/admin/*` routes require admin authentication
   - Automatic redirects for unauthorized access
   - Secure API endpoints with admin verification

3. **Environment Access**
   - Admins can view (but not edit) environment variables
   - Useful for debugging and configuration verification
   - Sensitive data is masked for security

### 🚀 Quick Start for New Admins

1. **First Time Setup**
   \`\`\`bash
   # Add your email to admin list in Vercel
   ADMIN_EMAILS=your-email@example.com,other-admin@example.com
   \`\`\`

2. **Create Admin Account**
   - Sign up normally at `/auth/sign-up`
   - Use an email from the admin list
   - System will automatically grant admin privileges

3. **Access Admin Panel**
   - Login normally at `/auth/login`
   - Navigate to `/admin` or click "Admin" in user menu
   - Full admin dashboard will be available

### 📱 Mobile Admin Access

- Admin dashboard is fully responsive
- Mobile-optimized interface
- Touch-friendly controls
- All features available on mobile devices

### 🛠️ Troubleshooting

**Can't Access Admin Panel?**
- Verify your email is in the `ADMIN_EMAILS` environment variable
- Check that you're logged in with the correct account
- Clear browser cache and try again

**Missing Admin Features?**
- Ensure environment variables are properly set
- Check that the admin layout is loading correctly
- Verify database connections are working

**Need to Add New Admin?**
- Update `ADMIN_EMAILS` in Vercel project settings
- Redeploy the application
- New admin can then sign up and access admin features

### 📞 Support

For technical support or admin access issues:
- Contact the development team
- Check the application logs in Vercel dashboard
- Review the admin middleware configuration

---

**Important**: Keep admin credentials secure and only share access with trusted team members. Regularly review the admin email list and remove access for former team members.
