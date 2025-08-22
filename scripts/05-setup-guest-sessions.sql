-- Create guest sessions table for non-authenticated users
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create index for faster guest session lookups
CREATE INDEX IF NOT EXISTS idx_guest_sessions_guest_id ON guest_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_expires_at ON guest_sessions(expires_at);

-- Update cart_items table to support guest sessions
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS guest_id TEXT,
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE;

-- Make user_id nullable to support guest carts
ALTER TABLE cart_items ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint to ensure either user_id or guest_id is present
ALTER TABLE cart_items 
ADD CONSTRAINT check_user_or_guest 
CHECK ((user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL));

-- Update orders table to support guest orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_id TEXT,
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL;

-- Make user_id nullable for guest orders
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint for orders
ALTER TABLE orders 
ADD CONSTRAINT check_order_user_or_guest 
CHECK ((user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL));

-- Create function to clean up expired guest sessions
CREATE OR REPLACE FUNCTION cleanup_expired_guest_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM guest_sessions WHERE expires_at < NOW();
END;
$$;

-- Enable RLS on guest_sessions table
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for guest sessions (allow all operations for now since guests don't have auth.uid())
CREATE POLICY "Allow guest session operations" ON guest_sessions FOR ALL USING (true);
