-- Added media and eriggalive-assets buckets to fix bucket not found errors
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('videos', 'videos', false),
  ('media', 'media', true),
  ('eriggalive-assets', 'eriggalive-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for images bucket (public read)
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view eriggalive-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload eriggalive-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update eriggalive-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete eriggalive-assets" ON storage.objects;

CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Set up storage policies for videos bucket (private with signed URLs)
CREATE POLICY "Admins can manage videos" ON storage.objects FOR ALL USING (
  bucket_id = 'videos' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Added policies for media bucket (public read, admin write)
CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE USING (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE USING (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Added policies for eriggalive-assets bucket (public read, admin write)
CREATE POLICY "Anyone can view eriggalive-assets" ON storage.objects FOR SELECT USING (bucket_id = 'eriggalive-assets');
CREATE POLICY "Admins can upload eriggalive-assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'eriggalive-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update eriggalive-assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'eriggalive-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can delete eriggalive-assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'eriggalive-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
