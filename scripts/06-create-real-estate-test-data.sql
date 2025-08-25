-- First, ensure we have a real estate category
INSERT INTO categories (id, name, slug, description, is_active, sort_order, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Real Estate',
  'real-estate',
  'Premium real estate properties for sale and rent',
  true,
  1,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Get the real estate category ID
DO $$
DECLARE
  real_estate_category_id uuid;
  product_1_id uuid;
  product_2_id uuid;
BEGIN
  -- Get the real estate category ID
  SELECT id INTO real_estate_category_id FROM categories WHERE slug = 'real-estate';
  
  -- Create sample real estate products
  INSERT INTO products (id, name, slug, description, short_description, price, images, features, is_featured, is_active, category_id, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Luxury Villa in Victoria Island',
    'luxury-villa-victoria-island',
    'A stunning 4-bedroom luxury villa located in the heart of Victoria Island, Lagos. This property features modern amenities, a private pool, and breathtaking views of the Lagos lagoon.',
    'Luxury 4-bedroom villa with pool and lagoon views',
    250000000,
    ARRAY['/placeholder.svg?height=600&width=800'],
    ARRAY['Swimming Pool', 'Garden', 'Security', 'Parking', 'Modern Kitchen'],
    true,
    true,
    real_estate_category_id,
    now(),
    now()
  ) RETURNING id INTO product_1_id;

  INSERT INTO products (id, name, slug, description, short_description, price, images, features, is_featured, is_active, category_id, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Modern Apartment in Ikoyi',
    'modern-apartment-ikoyi',
    'A contemporary 3-bedroom apartment in the prestigious Ikoyi district. Features include a gym, 24/7 security, and panoramic city views.',
    'Modern 3-bedroom apartment with city views',
    150000000,
    ARRAY['/placeholder.svg?height=600&width=800'],
    ARRAY['Gym', 'Security', 'City Views', 'Elevator', 'Balcony'],
    true,
    true,
    real_estate_category_id,
    now(),
    now()
  ) RETURNING id INTO product_2_id;

  -- Create corresponding real estate properties
  INSERT INTO real_estate_properties (
    id, product_id, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built,
    amenities, location_details, is_available_for_booking, booking_price_per_night,
    minimum_stay_nights, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    product_1_id,
    'villa',
    4,
    5,
    3500,
    5000,
    2020,
    ARRAY['Swimming Pool', 'Garden', 'Security', 'Parking', 'Modern Kitchen', 'WiFi', 'Air Conditioning'],
    '{"city": "Lagos", "state": "Lagos State", "country": "Nigeria", "district": "Victoria Island"}',
    true,
    85000,
    2,
    now(),
    now()
  );

  INSERT INTO real_estate_properties (
    id, product_id, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built,
    amenities, location_details, is_available_for_booking, booking_price_per_night,
    minimum_stay_nights, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    product_2_id,
    'apartment',
    3,
    3,
    2200,
    NULL,
    2019,
    ARRAY['Gym', 'Security', 'City Views', 'Elevator', 'Balcony', 'WiFi', 'Air Conditioning'],
    '{"city": "Lagos", "state": "Lagos State", "country": "Nigeria", "district": "Ikoyi"}',
    true,
    65000,
    1,
    now(),
    now()
  );
END $$;
