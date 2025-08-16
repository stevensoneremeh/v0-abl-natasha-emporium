-- Insert main product categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Real Estate', 'real-estate', 'Luxury properties and real estate investments', 1),
('Wines', 'wines', 'Premium wines and vintage collections', 2),
('Cars', 'cars', 'Luxury and exotic automobiles', 3),
('Hair & Wigs', 'hair-wigs', 'Premium hair products and luxury wigs', 4),
('Perfumes', 'perfumes', 'Exclusive fragrances and luxury perfumes', 5)
ON CONFLICT (slug) DO NOTHING;
