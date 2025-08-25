-- Execute missing database columns and fixes
-- Add missing role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user';

-- Ensure products table has correct status column (rename is_active to status if needed)
DO $$
BEGIN
    -- Check if status column exists, if not, add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE products ADD COLUMN status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'active';
        -- Update status based on is_active column
        UPDATE products SET status = CASE WHEN is_active = true THEN 'active' ELSE 'draft' END;
    END IF;
END $$;

-- Create listings_real_estate table if it doesn't exist (for compatibility)
CREATE TABLE IF NOT EXISTS listings_real_estate (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  location TEXT NOT NULL,
  address TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  property_type TEXT CHECK (property_type IN ('house', 'apartment', 'villa', 'penthouse', 'land', 'commercial')),
  listing_type TEXT CHECK (listing_type IN ('sale', 'rent')) DEFAULT 'sale',
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  virtual_tour_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for the new table
CREATE INDEX IF NOT EXISTS idx_listings_real_estate_featured ON listings_real_estate(featured);
CREATE INDEX IF NOT EXISTS idx_listings_real_estate_available ON listings_real_estate(available);
CREATE INDEX IF NOT EXISTS idx_listings_real_estate_slug ON listings_real_estate(slug);

-- Create wishlist table for user wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for wishlist table
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
