-- Insert luxury real estate properties with booking capabilities
WITH property_products AS (
  INSERT INTO products (id, category_id, name, slug, description, short_description, price, sku, images, features, specifications, stock_quantity, is_featured, is_active, meta_title, meta_description)
  SELECT 
    gen_random_uuid(),
    (SELECT id FROM categories WHERE slug = 'real-estate'),
    'Malibu Oceanfront Villa',
    'malibu-oceanfront-villa',
    'Stunning oceanfront villa in exclusive Malibu with panoramic Pacific Ocean views. This architectural masterpiece features 6 bedrooms, 8 bathrooms, infinity pool, and private beach access.',
    'Luxury oceanfront villa with private beach access',
    12500000.00,
    'RE-MALIBU-OCEAN-01',
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    ARRAY['6 bedrooms, 8 bathrooms', 'Infinity pool', 'Private beach access', 'Smart home technology'],
    '{"bedrooms": 6, "bathrooms": 8, "sqft": 8500, "lot_size": 1.2, "year_built": 2019}'::jsonb,
    1,
    true,
    true,
    'Malibu Oceanfront Villa - Luxury Real Estate',
    'Stunning oceanfront villa in Malibu with panoramic ocean views and private beach access.'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    (SELECT id FROM categories WHERE slug = 'real-estate'),
    'Manhattan Penthouse Suite',
    'manhattan-penthouse-suite',
    'Exclusive penthouse in prime Manhattan location with breathtaking city skyline views. Features luxury amenities, private terrace, and concierge services.',
    'Luxury Manhattan penthouse with city views',
    8750000.00,
    'RE-NYC-PENT-01',
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    ARRAY['4 bedrooms, 5 bathrooms', 'Private terrace', '24/7 concierge', 'Premium building amenities'],
    '{"bedrooms": 4, "bathrooms": 5, "sqft": 4200, "floor": 45, "year_built": 2020}'::jsonb,
    1,
    true,
    true,
    'Manhattan Penthouse Suite - Luxury NYC Real Estate',
    'Exclusive Manhattan penthouse with breathtaking city views and luxury amenities.'
  
  RETURNING id, name, slug
)

-- Insert corresponding real estate property details for booking
INSERT INTO real_estate_properties (id, product_id, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built, amenities, location_details, is_available_for_booking, booking_price_per_night, minimum_stay_nights, virtual_tour_url)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 'Villa'
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 'Penthouse'
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 6
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 4
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 8
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 5
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 8500
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 4200
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 1.2
    WHEN p.slug = 'manhattan-penthouse-suite' THEN NULL
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 2019
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 2020
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN ARRAY['Infinity Pool', 'Private Beach', 'Home Theater', 'Wine Cellar', 'Gym', 'Smart Home System']
    WHEN p.slug = 'manhattan-penthouse-suite' THEN ARRAY['Private Terrace', 'Concierge Service', 'Fitness Center', 'Rooftop Garden', 'Valet Parking']
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN '{"address": "Pacific Coast Highway, Malibu, CA", "neighborhood": "Point Dume", "proximity": {"beach": "0 miles", "LAX": "45 minutes", "downtown_LA": "1 hour"}}'::jsonb
    WHEN p.slug = 'manhattan-penthouse-suite' THEN '{"address": "Fifth Avenue, Manhattan, NY", "neighborhood": "Upper East Side", "proximity": {"central_park": "2 blocks", "JFK": "45 minutes", "times_square": "15 minutes"}}'::jsonb
  END,
  true,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 2500.00
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 1800.00
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 3
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 2
  END,
  CASE 
    WHEN p.slug = 'malibu-oceanfront-villa' THEN 'https://virtualtour.example.com/malibu-villa'
    WHEN p.slug = 'manhattan-penthouse-suite' THEN 'https://virtualtour.example.com/manhattan-penthouse'
  END
FROM property_products p;
