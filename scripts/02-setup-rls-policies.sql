-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update user roles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Categories policies (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Products policies (public read for active, admin full access)
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true AND status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Real estate policies (public read for available, admin full access)
CREATE POLICY "Anyone can view available real estate" ON listings_real_estate FOR SELECT USING (available = true);
CREATE POLICY "Admins can manage real estate" ON listings_real_estate FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Cart policies (users own their carts)
CREATE POLICY "Users can view their own carts" ON carts FOR SELECT USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Users can create their own carts" ON carts FOR INSERT WITH CHECK (
  auth.uid() = user_id OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Users can update their own carts" ON carts FOR UPDATE USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Users can delete their own carts" ON carts FOR DELETE USING (
  auth.uid() = user_id OR (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Cart items policies (inherit from cart policies)
CREATE POLICY "Users can manage their cart items" ON cart_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.id = cart_items.cart_id 
    AND (carts.user_id = auth.uid() OR (auth.uid() IS NULL AND carts.session_id IS NOT NULL))
  )
);

-- Orders policies (users can view their own, admins can view all)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Order items policies (inherit from order policies)
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Guest sessions policies
CREATE POLICY "Anyone can view guest sessions" ON guest_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create guest sessions" ON guest_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update guest sessions" ON guest_sessions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete guest sessions" ON guest_sessions FOR DELETE USING (true);

-- Product reviews policies
CREATE POLICY "Users can view their own product reviews" ON product_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create product reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own product reviews" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own product reviews" ON product_reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all product reviews" ON product_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Real estate properties policies
CREATE POLICY "Anyone can view real estate properties" ON real_estate_properties FOR SELECT USING (true);
CREATE POLICY "Admins can manage real estate properties" ON real_estate_properties FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Real estate bookings policies
CREATE POLICY "Users can view their own real estate bookings" ON real_estate_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create real estate bookings" ON real_estate_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own real estate bookings" ON real_estate_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own real estate bookings" ON real_estate_bookings FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all real estate bookings" ON real_estate_bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Wishlist items policies
CREATE POLICY "Users can view their own wishlist items" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create wishlist items" ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wishlist items" ON wishlist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wishlist items" ON wishlist_items FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all wishlist items" ON wishlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
