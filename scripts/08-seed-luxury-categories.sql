-- Clear existing data and seed luxury categories
DELETE FROM categories;

INSERT INTO categories (id, name, slug, description, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'Luxury Fashion', 'luxury-fashion', 'Exquisite designer clothing, accessories, and haute couture pieces from the world''s most prestigious fashion houses.', '/placeholder.svg?height=400&width=600', NOW(), NOW()),
(gen_random_uuid(), 'Premium Beauty', 'premium-beauty', 'Exclusive skincare, cosmetics, and wellness products crafted with the finest ingredients and cutting-edge technology.', '/placeholder.svg?height=400&width=600', NOW(), NOW()),
(gen_random_uuid(), 'Real Estate', 'real-estate', 'Exceptional properties in prime locations, from penthouse apartments to exclusive estates and commercial investments.', '/placeholder.svg?height=400&width=600', NOW(), NOW()),
(gen_random_uuid(), 'Luxury Services', 'luxury-services', 'Bespoke concierge services, private experiences, and personalized lifestyle management for discerning clientele.', '/placeholder.svg?height=400&width=600', NOW(), NOW()),
(gen_random_uuid(), 'Fine Jewelry', 'fine-jewelry', 'Handcrafted jewelry featuring precious metals, rare gemstones, and timeless designs from master artisans.', '/placeholder.svg?height=400&width=600', NOW(), NOW()),
(gen_random_uuid(), 'Luxury Watches', 'luxury-watches', 'Swiss timepieces and exclusive watch collections representing the pinnacle of horological craftsmanship.', '/placeholder.svg?height=400&width=600', NOW(), NOW());
