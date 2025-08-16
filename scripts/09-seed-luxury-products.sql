-- Clear existing product data
DELETE FROM products;
DELETE FROM product_images;
DELETE FROM product_videos;

-- Get category IDs for reference
WITH category_ids AS (
  SELECT 
    id as fashion_id,
    (SELECT id FROM categories WHERE slug = 'premium-beauty') as beauty_id,
    (SELECT id FROM categories WHERE slug = 'real-estate') as realestate_id,
    (SELECT id FROM categories WHERE slug = 'luxury-services') as services_id,
    (SELECT id FROM categories WHERE slug = 'fine-jewelry') as jewelry_id,
    (SELECT id FROM categories WHERE slug = 'luxury-watches') as watches_id
  FROM categories WHERE slug = 'luxury-fashion'
)

-- Insert luxury fashion products
INSERT INTO products (id, name, slug, short_description, description, price, compare_at_price, category_id, sku, status, featured, inventory_quantity, tags, weight, dimensions, seo_title, seo_description, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Hermès Birkin 35 Togo Leather',
  'hermes-birkin-35-togo-leather',
  'Iconic luxury handbag in premium Togo leather',
  'The epitome of luxury craftsmanship, this Hermès Birkin 35 features exquisite Togo leather construction with palladium hardware. Each bag is meticulously handcrafted by skilled artisans, making it not just an accessory but a timeless investment piece. The spacious interior and iconic silhouette make it perfect for the modern luxury lifestyle.',
  45000.00,
  52000.00,
  fashion_id,
  'HER-BIRKIN-35-TOGO',
  'active',
  true,
  3,
  ARRAY['handbag', 'luxury', 'hermes', 'leather', 'investment'],
  1.2,
  '{"length": 35, "width": 18, "height": 25, "unit": "cm"}'::jsonb,
  'Hermès Birkin 35 Togo Leather - Luxury Handbag | ABL Natasha Emporium',
  'Authentic Hermès Birkin 35 in premium Togo leather. Timeless luxury handbag with palladium hardware. Investment piece for discerning collectors.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Chanel Tweed Jacket Classic',
  'chanel-tweed-jacket-classic',
  'Timeless Chanel tweed jacket with signature details',
  'An iconic piece from the House of Chanel, this classic tweed jacket embodies Gabrielle Chanel''s revolutionary vision of feminine elegance. Crafted from the finest French tweed with signature chain-weighted hem, contrast trim, and functional pockets. This jacket represents the perfect balance of comfort and sophistication.',
  8500.00,
  9200.00,
  fashion_id,
  'CHA-TWEED-CLASSIC',
  'active',
  true,
  8,
  ARRAY['jacket', 'chanel', 'tweed', 'classic', 'designer'],
  0.8,
  '{"size": "36", "chest": 88, "length": 58, "unit": "cm"}'::jsonb,
  'Chanel Classic Tweed Jacket - Designer Fashion | ABL Natasha Emporium',
  'Authentic Chanel tweed jacket with signature details. Classic French craftsmanship meets timeless elegance. Perfect for sophisticated wardrobes.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

-- Premium Beauty Products
SELECT 
  gen_random_uuid(),
  'La Mer Crème de la Mer Moisturizing Cream',
  'la-mer-creme-moisturizing-cream',
  'Legendary moisturizing cream with Miracle Broth™',
  'The legendary moisturizing cream that started it all. Infused with the nutrient-rich Miracle Broth™, this transformative cream helps heal dryness and impart a radiant, more youthful-looking appearance. The bio-fermented sea kelp and other marine ingredients work in harmony to renew and restore skin''s natural vitality.',
  380.00,
  420.00,
  beauty_id,
  'LAM-CREME-60ML',
  'active',
  true,
  25,
  ARRAY['skincare', 'moisturizer', 'luxury', 'anti-aging', 'la-mer'],
  0.2,
  '{"volume": 60, "unit": "ml"}'::jsonb,
  'La Mer Crème de la Mer - Luxury Moisturizing Cream | ABL Natasha Emporium',
  'Legendary La Mer moisturizing cream with Miracle Broth™. Transform your skin with this iconic luxury skincare treatment.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Tom Ford Oud Wood Eau de Parfum',
  'tom-ford-oud-wood-eau-de-parfum',
  'Exotic and smoky fragrance with rare oud wood',
  'An exotic, smoky fragrance featuring rare oud wood, one of the most revered ingredients in perfumery. This sophisticated scent blends exotic rosewood and cardamom with sandalwood, creating a mesmerizing fragrance that''s both distinctive and addictive. Perfect for those who appreciate the finer things in life.',
  350.00,
  380.00,
  beauty_id,
  'TF-OUD-WOOD-100ML',
  'active',
  false,
  15,
  ARRAY['fragrance', 'perfume', 'tom-ford', 'oud', 'luxury'],
  0.3,
  '{"volume": 100, "unit": "ml"}'::jsonb,
  'Tom Ford Oud Wood Eau de Parfum - Luxury Fragrance | ABL Natasha Emporium',
  'Exotic Tom Ford Oud Wood fragrance with rare oud wood. Sophisticated and addictive scent for discerning fragrance lovers.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

-- Real Estate Properties
SELECT 
  gen_random_uuid(),
  'Manhattan Penthouse - Central Park Views',
  'manhattan-penthouse-central-park-views',
  'Luxurious 4-bedroom penthouse with panoramic city views',
  'An extraordinary penthouse offering unparalleled luxury living in the heart of Manhattan. This stunning 4-bedroom, 4.5-bathroom residence features floor-to-ceiling windows with breathtaking Central Park and city skyline views. Premium finishes include marble countertops, hardwood floors, and state-of-the-art appliances. Building amenities include 24-hour concierge, fitness center, and rooftop terrace.',
  12500000.00,
  13200000.00,
  realestate_id,
  'RE-MAN-PENT-001',
  'active',
  true,
  1,
  ARRAY['penthouse', 'manhattan', 'central-park', 'luxury', 'investment'],
  0.0,
  '{"bedrooms": 4, "bathrooms": 4.5, "sqft": 3200, "floor": "45th"}'::jsonb,
  'Manhattan Penthouse Central Park Views - Luxury Real Estate | ABL Natasha Emporium',
  'Extraordinary Manhattan penthouse with Central Park views. 4-bedroom luxury residence with premium finishes and building amenities.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Hamptons Estate - Waterfront Mansion',
  'hamptons-estate-waterfront-mansion',
  'Spectacular waterfront estate with private beach access',
  'A magnificent waterfront estate in the prestigious Hamptons, featuring 8 bedrooms, 10 bathrooms, and over 12,000 square feet of luxurious living space. This architectural masterpiece includes a gourmet kitchen, wine cellar, home theater, and infinity pool overlooking the bay. Private beach access and deep-water dock complete this exceptional property.',
  28500000.00,
  32000000.00,
  realestate_id,
  'RE-HAM-EST-001',
  'active',
  true,
  1,
  ARRAY['estate', 'hamptons', 'waterfront', 'mansion', 'beach'],
  0.0,
  '{"bedrooms": 8, "bathrooms": 10, "sqft": 12000, "acres": 2.5}'::jsonb,
  'Hamptons Waterfront Estate - Luxury Mansion | ABL Natasha Emporium',
  'Magnificent Hamptons waterfront estate with private beach. 8-bedroom mansion with luxury amenities and deep-water dock.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

-- Luxury Services
SELECT 
  gen_random_uuid(),
  'Private Jet Charter - Global Access',
  'private-jet-charter-global-access',
  'Exclusive private jet charter service worldwide',
  'Experience the ultimate in luxury travel with our private jet charter service. Our fleet of meticulously maintained aircraft offers unparalleled comfort, privacy, and convenience. From light jets for short trips to heavy jets for transcontinental flights, we provide personalized service with dedicated flight crews, gourmet catering, and ground transportation coordination.',
  15000.00,
  18000.00,
  services_id,
  'SVC-JET-CHARTER',
  'active',
  true,
  999,
  ARRAY['private-jet', 'charter', 'travel', 'luxury', 'aviation'],
  0.0,
  '{"service_type": "charter", "duration": "per_flight", "capacity": "up_to_14"}'::jsonb,
  'Private Jet Charter Service - Luxury Travel | ABL Natasha Emporium',
  'Exclusive private jet charter service worldwide. Luxury travel with personalized service, gourmet catering, and ground coordination.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Personal Concierge - Platinum Service',
  'personal-concierge-platinum-service',
  '24/7 luxury lifestyle management and concierge services',
  'Our Platinum Concierge Service provides comprehensive lifestyle management for discerning clients. From restaurant reservations and event planning to travel coordination and personal shopping, our dedicated team handles every detail with discretion and excellence. Available 24/7, we ensure your time is spent on what matters most to you.',
  5000.00,
  6000.00,
  services_id,
  'SVC-CONCIERGE-PLAT',
  'active',
  false,
  50,
  ARRAY['concierge', 'lifestyle', 'personal-service', 'luxury', '24-7'],
  0.0,
  '{"service_type": "monthly", "availability": "24_7", "response_time": "immediate"}'::jsonb,
  'Personal Concierge Platinum Service - Luxury Lifestyle | ABL Natasha Emporium',
  '24/7 luxury concierge service for lifestyle management. Personal shopping, travel coordination, and event planning with discretion.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

-- Fine Jewelry
SELECT 
  gen_random_uuid(),
  'Cartier Love Bracelet - 18K Gold',
  'cartier-love-bracelet-18k-gold',
  'Iconic Cartier Love bracelet in 18K yellow gold',
  'The legendary Cartier Love bracelet, a symbol of unbreakable love and commitment. Crafted in 18K yellow gold with the iconic screw motif, this timeless piece is secured with a special screwdriver, symbolizing a love that is locked away forever. A modern classic that transcends trends and generations.',
  7150.00,
  7800.00,
  jewelry_id,
  'CAR-LOVE-18K-YG',
  'active',
  true,
  12,
  ARRAY['bracelet', 'cartier', 'gold', 'love', 'iconic'],
  0.1,
  '{"material": "18K_yellow_gold", "size": "17", "width": "6.1mm"}'::jsonb,
  'Cartier Love Bracelet 18K Gold - Luxury Jewelry | ABL Natasha Emporium',
  'Iconic Cartier Love bracelet in 18K yellow gold. Symbol of unbreakable love with signature screw motif and special screwdriver.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Tiffany & Co. Diamond Solitaire Ring',
  'tiffany-diamond-solitaire-ring',
  'Classic Tiffany setting with brilliant-cut diamond',
  'The epitome of elegance and craftsmanship, this Tiffany & Co. diamond solitaire ring features a brilliant-cut diamond set in the iconic Tiffany setting. The six-prong platinum setting maximizes the diamond''s brilliance and fire, creating a timeless piece that celebrates life''s most precious moments.',
  18500.00,
  22000.00,
  jewelry_id,
  'TIF-SOL-2CT-PLAT',
  'active',
  true,
  5,
  ARRAY['ring', 'diamond', 'tiffany', 'solitaire', 'engagement'],
  0.05,
  '{"carat": 2.0, "cut": "brilliant", "color": "F", "clarity": "VS1", "metal": "platinum"}'::jsonb,
  'Tiffany Diamond Solitaire Ring - Luxury Engagement Ring | ABL Natasha Emporium',
  'Classic Tiffany diamond solitaire ring with brilliant-cut diamond. Iconic six-prong platinum setting for maximum brilliance.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

-- Luxury Watches
SELECT 
  gen_random_uuid(),
  'Rolex Submariner Date - Steel',
  'rolex-submariner-date-steel',
  'Iconic diving watch with unidirectional bezel',
  'The legendary Rolex Submariner Date, an icon among diving watches and luxury timepieces. Features a robust 40mm Oystersteel case, unidirectional rotatable bezel with Cerachrom insert, and the self-winding Perpetual movement. Water-resistant to 300 meters, this watch combines functionality with timeless elegance.',
  14800.00,
  16500.00,
  watches_id,
  'ROL-SUB-DATE-STEEL',
  'active',
  true,
  8,
  ARRAY['watch', 'rolex', 'submariner', 'diving', 'steel'],
  0.15,
  '{"case_diameter": "40mm", "material": "oystersteel", "movement": "automatic", "water_resistance": "300m"}'::jsonb,
  'Rolex Submariner Date Steel - Luxury Diving Watch | ABL Natasha Emporium',
  'Iconic Rolex Submariner Date diving watch in Oystersteel. Unidirectional bezel, Perpetual movement, 300m water resistance.',
  NOW(),
  NOW()
FROM category_ids

UNION ALL

SELECT 
  gen_random_uuid(),
  'Patek Philippe Calatrava - Rose Gold',
  'patek-philippe-calatrava-rose-gold',
  'Elegant dress watch with manual-winding movement',
  'The Patek Philippe Calatrava represents the purest expression of the round watch. This elegant timepiece features a 39mm rose gold case, silvery opaline dial, and the manually wound caliber 215 PS movement. With its clean lines and timeless design, the Calatrava embodies understated luxury and horological excellence.',
  32500.00,
  35000.00,
  watches_id,
  'PP-CAL-39-RG',
  'active',
  true,
  3,
  ARRAY['watch', 'patek-philippe', 'calatrava', 'dress-watch', 'rose-gold'],
  0.12,
  '{"case_diameter": "39mm", "material": "rose_gold", "movement": "manual", "power_reserve": "44h"}'::jsonb,
  'Patek Philippe Calatrava Rose Gold - Luxury Dress Watch | ABL Natasha Emporium',
  'Elegant Patek Philippe Calatrava in rose gold. Manual-winding movement, silvery opaline dial, timeless design excellence.',
  NOW(),
  NOW()
FROM category_ids;
