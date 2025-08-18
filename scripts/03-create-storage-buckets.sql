-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('videos', 'videos', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for images bucket (public read)
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Set up storage policies for videos bucket (private with signed URLs)
CREATE POLICY "Admins can manage videos" ON storage.objects FOR ALL USING (
  bucket_id = 'videos' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
