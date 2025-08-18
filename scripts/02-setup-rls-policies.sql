-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update user roles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies (public read for active, admin full access)
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Real estate policies (public read for available, admin full access)
CREATE POLICY "Anyone can view available real estate" ON listings_real_estate FOR SELECT USING (available = true);
CREATE POLICY "Admins can manage real estate" ON listings_real_estate FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Media assets policies (public read, admin write)
CREATE POLICY "Anyone can view media assets" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Admins can manage media assets" ON media_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
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
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies (inherit from order policies)
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
