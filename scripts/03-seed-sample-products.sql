-- Get category IDs for reference
DO $$
DECLARE
    real_estate_id UUID;
    wines_id UUID;
    cars_id UUID;
    hair_wigs_id UUID;
    perfumes_id UUID;
BEGIN
    SELECT id INTO real_estate_id FROM public.categories WHERE slug = 'real-estate';
    SELECT id INTO wines_id FROM public.categories WHERE slug = 'wines';
    SELECT id INTO cars_id FROM public.categories WHERE slug = 'cars';
    SELECT id INTO hair_wigs_id FROM public.categories WHERE slug = 'hair-wigs';
    SELECT id INTO perfumes_id FROM public.categories WHERE slug = 'perfumes';

    -- Sample Real Estate Properties
    INSERT INTO public.products (category_id, name, slug, description, short_description, price, images, features, is_featured, is_active) VALUES
    (real_estate_id, 'Luxury Penthouse - Victoria Island', 'luxury-penthouse-vi', 'Stunning 4-bedroom penthouse with panoramic city views in the heart of Victoria Island, Lagos. Features premium finishes, private elevator access, and world-class amenities.', 'Luxury 4BR penthouse with city views', 850000000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Private Elevator', 'Panoramic Views', 'Premium Finishes', 'Smart Home System'], TRUE, TRUE),
    
    (real_estate_id, 'Modern Villa - Lekki Phase 1', 'modern-villa-lekki', 'Contemporary 5-bedroom villa with swimming pool, landscaped gardens, and 24/7 security in exclusive Lekki Phase 1 estate.', 'Modern 5BR villa with pool', 450000000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Swimming Pool', 'Landscaped Gardens', '24/7 Security', 'Fitted Kitchen'], TRUE, TRUE);

    -- Sample Wines
    INSERT INTO public.products (category_id, name, slug, description, short_description, price, images, features, is_featured, is_active) VALUES
    (wines_id, 'Dom Pérignon Vintage 2013', 'dom-perignon-2013', 'Exceptional vintage champagne with complex aromas of white flowers, citrus, and stone fruits. A masterpiece of French winemaking tradition.', 'Premium vintage champagne', 450000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Vintage 2013', 'French Champagne', 'Gift Box Included', 'Limited Edition'], TRUE, TRUE),
    
    (wines_id, 'Château Margaux 2015', 'chateau-margaux-2015', 'Legendary Bordeaux wine from one of the most prestigious châteaux. Rich, elegant, and perfectly balanced with exceptional aging potential.', 'Legendary Bordeaux wine', 1200000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Bordeaux Premier Cru', 'Vintage 2015', 'Collector Item', 'Certificate of Authenticity'], TRUE, TRUE);

    -- Sample Cars
    INSERT INTO public.products (category_id, name, slug, description, short_description, price, images, features, is_featured, is_active) VALUES
    (cars_id, 'Mercedes-Benz S-Class 2024', 'mercedes-s-class-2024', 'The pinnacle of luxury sedans. Features advanced driver assistance, premium leather interior, and cutting-edge technology for the ultimate driving experience.', 'Luxury sedan with advanced tech', 95000000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Advanced Driver Assistance', 'Premium Leather Interior', 'Panoramic Sunroof', 'Burmester Sound System'], TRUE, TRUE),
    
    (cars_id, 'BMW X7 2024', 'bmw-x7-2024', 'Commanding luxury SUV with three rows of seating, powerful engine options, and sophisticated design. Perfect for families who demand excellence.', 'Luxury 7-seater SUV', 78000000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['7-Seater Configuration', 'Adaptive Suspension', 'Gesture Control', 'Wireless Charging'], FALSE, TRUE);

    -- Sample Hair & Wigs
    INSERT INTO public.products (category_id, name, slug, description, short_description, price, images, features, is_featured, is_active) VALUES
    (hair_wigs_id, 'Premium Human Hair Lace Front Wig', 'premium-lace-front-wig', 'Luxurious 100% human hair lace front wig with natural hairline. Hand-tied construction ensures maximum comfort and realistic appearance.', '100% human hair lace front wig', 285000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['100% Human Hair', 'Lace Front Construction', 'Natural Hairline', 'Heat Resistant'], TRUE, TRUE),
    
    (hair_wigs_id, 'Luxury Hair Extension Bundle', 'luxury-hair-extension-bundle', 'Premium grade hair extensions made from the finest human hair. Includes 3 bundles with closure for a complete transformation.', 'Premium hair extension bundle', 125000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['3 Bundles + Closure', 'Virgin Human Hair', 'Double Weft', 'Tangle Free'], FALSE, TRUE);

    -- Sample Perfumes
    INSERT INTO public.products (category_id, name, slug, description, short_description, price, images, features, is_featured, is_active) VALUES
    (perfumes_id, 'Tom Ford Black Orchid', 'tom-ford-black-orchid', 'Luxurious and sensual fragrance with notes of black orchid, bergamot, and dark chocolate. A sophisticated scent for the discerning individual.', 'Luxurious unisex fragrance', 185000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Unisex Fragrance', '100ml Bottle', 'Long Lasting', 'Luxury Packaging'], TRUE, TRUE),
    
    (perfumes_id, 'Creed Aventus', 'creed-aventus', 'Iconic masculine fragrance with notes of pineapple, birch, and musk. A timeless scent that exudes confidence and sophistication.', 'Iconic masculine fragrance', 295000.00, ARRAY['/placeholder.svg?height=400&width=600'], ARRAY['Masculine Scent', '120ml Bottle', 'Hand Crafted', 'Premium Quality'], TRUE, TRUE);

END $$;
