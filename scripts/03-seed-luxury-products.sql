-- Get category IDs for reference
WITH category_ids AS (
  SELECT 
    id as fashion_id,
    (SELECT id FROM categories WHERE slug = 'beauty-cosmetics') as beauty_id,
    (SELECT id FROM categories WHERE slug = 'fine-jewelry') as jewelry_id,
    (SELECT id FROM categories WHERE slug = 'real-estate') as realestate_id,
    (SELECT id FROM categories WHERE slug = 'luxury-services') as services_id,
    (SELECT id FROM categories WHERE slug = 'home-living') as home_id
  FROM categories WHERE slug = 'luxury-fashion'
)

-- Insert luxury fashion products
INSERT INTO products (id, category_id, name, slug, description, short_description, price, compare_at_price, sku, images, features, specifications, stock_quantity, is_featured, is_active, meta_title, meta_description) 
SELECT 
  gen_random_uuid(),
  c.fashion_id,
  'Hermès Birkin 35 Togo Leather',
  'hermes-birkin-35-togo',
  'The epitome of luxury handbags, this Hermès Birkin 35 in Togo leather represents timeless elegance and exceptional craftsmanship. Hand-stitched by master artisans in France.',
  'Iconic Hermès Birkin bag in premium Togo leather',
  45000.00,
  50000.00,
  'HER-BIRK-35-TOGO',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Hand-stitched by master craftsmen', 'Palladium hardware', 'Togo leather construction', 'Includes authenticity certificate'],
  '{"material": "Togo Leather", "hardware": "Palladium", "origin": "France", "dimensions": "35cm x 25cm x 18cm"}'::jsonb,
  2,
  true,
  true,
  'Hermès Birkin 35 Togo Leather - Luxury Handbag',
  'Authentic Hermès Birkin 35 in premium Togo leather. Hand-crafted luxury handbag with palladium hardware.'
FROM category_ids c

UNION ALL

SELECT 
  gen_random_uuid(),
  c.fashion_id,
  'Chanel Classic Flap Bag Medium',
  'chanel-classic-flap-medium',
  'The quintessential Chanel Classic Flap Bag in medium size, featuring the iconic quilted pattern and chain strap. A timeless investment piece.',
  'Iconic Chanel quilted flap bag in medium size',
  8500.00,
  9200.00,
  'CHA-FLAP-MED-BLK',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Quilted lambskin leather', 'Interlocking CC turn-lock', 'Chain and leather strap', 'Multiple compartments'],
  '{"material": "Lambskin Leather", "hardware": "Gold-tone", "origin": "France", "dimensions": "25cm x 15cm x 6cm"}'::jsonb,
  5,
  true,
  true,
  'Chanel Classic Flap Bag Medium - Designer Handbag',
  'Authentic Chanel Classic Flap Bag in quilted lambskin leather with gold-tone hardware.'

FROM category_ids c

UNION ALL

-- Beauty & Cosmetics Products
SELECT 
  gen_random_uuid(),
  c.beauty_id,
  'La Mer Crème de la Mer Moisturizing Cream',
  'la-mer-creme-moisturizing-cream',
  'The legendary moisturizing cream that started it all. Infused with the nutrient-rich Miracle Broth™, this transformative cream helps heal, soften and protect skin.',
  'Legendary luxury moisturizing cream with Miracle Broth™',
  380.00,
  420.00,
  'LAM-CREME-60ML',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Miracle Broth™ formula', 'Deeply moisturizing', 'Helps heal and protect skin', 'Suitable for all skin types'],
  '{"size": "60ml", "key_ingredient": "Miracle Broth", "skin_type": "All types", "origin": "USA"}'::jsonb,
  15,
  true,
  true,
  'La Mer Crème de la Mer - Luxury Moisturizing Cream',
  'Transform your skin with La Mer\'s legendary moisturizing cream featuring Miracle Broth™.'

FROM category_ids c

UNION ALL

SELECT 
  gen_random_uuid(),
  c.beauty_id,
  'Tom Ford Oud Wood Eau de Parfum',
  'tom-ford-oud-wood-parfum',
  'A composition of exotic, smoky woods including rare oud, sandalwood, rosewood, and Chinese pepper. This sophisticated fragrance is both distinctive and addictive.',
  'Exotic smoky wood fragrance with rare oud',
  350.00,
  380.00,
  'TF-OUD-WOOD-100ML',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Rare oud wood', 'Sandalwood and rosewood', 'Chinese pepper notes', 'Long-lasting fragrance'],
  '{"size": "100ml", "fragrance_family": "Woody", "concentration": "Eau de Parfum", "origin": "France"}'::jsonb,
  8,
  true,
  true,
  'Tom Ford Oud Wood - Luxury Eau de Parfum',
  'Sophisticated woody fragrance with rare oud, sandalwood, and exotic spices by Tom Ford.'

FROM category_ids c

UNION ALL

-- Fine Jewelry Products
SELECT 
  gen_random_uuid(),
  c.jewelry_id,
  'Cartier Love Bracelet 18K Gold',
  'cartier-love-bracelet-18k-gold',
  'The iconic Cartier Love bracelet in 18K yellow gold. A symbol of unbreakable love, this bracelet is secured with a special screwdriver and worn as a permanent reminder of commitment.',
  'Iconic 18K gold bracelet with screw motifs',
  7150.00,
  7500.00,
  'CAR-LOVE-18K-YG',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['18K yellow gold', 'Iconic screw motifs', 'Includes screwdriver', 'Cartier authenticity certificate'],
  '{"material": "18K Yellow Gold", "width": "6.1mm", "origin": "France", "collection": "Love"}'::jsonb,
  3,
  true,
  true,
  'Cartier Love Bracelet 18K Gold - Luxury Jewelry',
  'Iconic Cartier Love bracelet in 18K yellow gold with signature screw motifs.'

FROM category_ids c

UNION ALL

SELECT 
  gen_random_uuid(),
  c.jewelry_id,
  'Rolex Submariner Date 41mm',
  'rolex-submariner-date-41mm',
  'The Rolex Submariner Date combines the functionality of a professional diving watch with the prestige of a luxury timepiece. Water-resistant to 300 meters.',
  'Professional diving watch with date function',
  13250.00,
  14000.00,
  'ROL-SUB-DATE-41',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Oystersteel case', 'Cerachrom bezel', 'Automatic movement', 'Water-resistant to 300m'],
  '{"case_size": "41mm", "movement": "Automatic", "water_resistance": "300m", "material": "Oystersteel"}'::jsonb,
  2,
  true,
  true,
  'Rolex Submariner Date 41mm - Luxury Diving Watch',
  'Professional Rolex Submariner diving watch with date function and 300m water resistance.'

FROM category_ids c

UNION ALL

-- Home & Living Products
SELECT 
  gen_random_uuid(),
  c.home_id,
  'Hermès Avalon Cashmere Throw',
  'hermes-avalon-cashmere-throw',
  'Luxurious cashmere throw blanket from Hermès featuring the iconic H pattern. Woven from the finest cashmere for ultimate comfort and elegance.',
  'Luxury cashmere throw with iconic H pattern',
  1890.00,
  2100.00,
  'HER-AVALON-CASH-OR',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['100% cashmere', 'Iconic H pattern', 'Hand-finished edges', 'Made in Scotland'],
  '{"material": "100% Cashmere", "dimensions": "135cm x 170cm", "pattern": "H Avalon", "origin": "Scotland"}'::jsonb,
  6,
  true,
  true,
  'Hermès Avalon Cashmere Throw - Luxury Home Textile',
  'Luxurious Hermès cashmere throw featuring the iconic H pattern, made in Scotland.'

FROM category_ids c;

-- Insert luxury services
INSERT INTO products (id, category_id, name, slug, description, short_description, price, sku, images, features, specifications, stock_quantity, is_featured, is_active, meta_title, meta_description)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM categories WHERE slug = 'luxury-services'),
  'Personal Shopping Concierge Service',
  'personal-shopping-concierge',
  'Exclusive personal shopping service with our luxury lifestyle experts. We curate personalized selections, arrange private appointments, and provide white-glove service for discerning clients.',
  'Exclusive personal shopping with luxury experts',
  500.00,
  'SERV-PERS-SHOP',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Dedicated luxury consultant', 'Private shopping appointments', 'Personalized curation', 'White-glove delivery service'],
  '{"duration": "4 hours", "includes": "Consultation, Shopping, Delivery", "availability": "By appointment"}'::jsonb,
  100,
  true,
  true,
  'Personal Shopping Concierge - Luxury Lifestyle Service',
  'Exclusive personal shopping service with luxury experts and white-glove delivery.'

UNION ALL

SELECT 
  gen_random_uuid(),
  (SELECT id FROM categories WHERE slug = 'luxury-services'),
  'VIP Event Planning & Management',
  'vip-event-planning',
  'Comprehensive luxury event planning service for exclusive gatherings, private parties, and corporate events. Our team handles every detail with discretion and excellence.',
  'Luxury event planning for exclusive gatherings',
  2500.00,
  'SERV-EVENT-VIP',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  ARRAY['Full event coordination', 'Exclusive venue access', 'Premium vendor network', 'Dedicated event manager'],
  '{"min_budget": "$10,000", "planning_time": "2-6 months", "guest_capacity": "10-500", "includes": "Full service planning"}'::jsonb,
  50,
  true,
  true,
  'VIP Event Planning - Luxury Event Management Service',
  'Comprehensive luxury event planning for exclusive gatherings and private parties.'
;
