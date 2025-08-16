-- Ensure categories table exists and is populated
-- This script will insert categories if they don't already exist

INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Real Estate', 'real-estate', 'Luxury properties and real estate investments', '/placeholder.svg?height=400&width=600'),
('Wines', 'wines', 'Premium wines and vintage collections', '/placeholder.svg?height=400&width=600'),
('Cars', 'cars', 'Luxury and exotic automobiles', '/placeholder.svg?height=400&width=600'),
('Hair & Wigs', 'hair-wigs', 'Premium hair products and luxury wigs', '/placeholder.svg?height=400&width=600'),
('Perfumes', 'perfumes', 'Exclusive fragrances and luxury perfumes', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
