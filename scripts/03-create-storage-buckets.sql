-- Renamed eriggalive-assets to abl-natasha-assets for proper branding
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('videos', 'videos', false),
  ('media', 'media', true),
  ('abl-natasha-assets', 'abl-natasha-assets', true)
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
DROP POLICY IF EXISTS "Anyone can view abl-natasha-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload abl-natasha-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update abl-natasha-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete abl-natasha-assets" ON storage.objects;

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

-- Policies for media bucket (public read, admin write)
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

-- Policies for abl-natasha-assets bucket (public read, admin write)
CREATE POLICY "Anyone can view abl-natasha-assets" ON storage.objects FOR SELECT USING (bucket_id = 'abl-natasha-assets');
CREATE POLICY "Admins can upload abl-natasha-assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'abl-natasha-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can update abl-natasha-assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'abl-natasha-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
CREATE POLICY "Admins can delete abl-natasha-assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'abl-natasha-assets' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);
