-- Fix numeric field overflow and add proper real estate data with listing types
-- Using smaller, realistic numeric values and adding listing_type functionality

-- First, ensure we have a real estate category
INSERT INTO categories (id, name, slug, description, is_active, sort_order, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Real Estate',
  'real-estate',
  'Premium real estate properties for sale, rent, and lease',
  true,
  1,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Get the real estate category ID
DO $$
DECLARE
    real_estate_category_id UUID;
    product1_id UUID := gen_random_uuid();
    product2_id UUID := gen_random_uuid();
    product3_id UUID := gen_random_uuid();
    product4_id UUID := gen_random_uuid();
BEGIN
    -- Get category ID
    SELECT id INTO real_estate_category_id FROM categories WHERE slug = 'real-estate';
    
    -- Insert real estate products with reasonable prices
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price,
        category_id, is_active, is_featured, status, stock_quantity,
        images, features, specifications, created_at, updated_at
    ) VALUES 
    (
        product1_id,
        'Luxury Downtown Condo',
        'luxury-downtown-condo',
        'Beautiful 2-bedroom luxury condominium in the heart of downtown with stunning city views.',
        'Luxury 2BR condo with city views',
        850000.00,
        900000.00,
        real_estate_category_id,
        true,
        true,
        'active',
        1,
        ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
        ARRAY['City Views', 'Modern Kitchen', 'Balcony', 'Parking'],
        '{"bedrooms": 2, "bathrooms": 2, "sqft": 1200}',
        NOW(),
        NOW()
    ),
    (
        product2_id,
        'Family Suburban Home',
        'family-suburban-home',
        'Spacious 4-bedroom family home in quiet suburban neighborhood with large backyard.',
        'Spacious 4BR family home',
        650000.00,
        680000.00,
        real_estate_category_id,
        true,
        true,
        'active',
        1,
        ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
        ARRAY['Large Backyard', 'Garage', 'Modern Kitchen', 'Fireplace'],
        '{"bedrooms": 4, "bathrooms": 3, "sqft": 2500}',
        NOW(),
        NOW()
    ),
    (
        product3_id,
        'Modern Studio Apartment',
        'modern-studio-apartment',
        'Contemporary studio apartment perfect for young professionals, fully furnished.',
        'Modern furnished studio',
        2500.00,
        2800.00,
        real_estate_category_id,
        true,
        false,
        'active',
        1,
        ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        ARRAY['Furnished', 'Modern Appliances', 'City Location', 'Gym Access'],
        '{"bedrooms": 0, "bathrooms": 1, "sqft": 600}',
        NOW(),
        NOW()
    ),
    (
        product4_id,
        'Vacation Beach House',
        'vacation-beach-house',
        'Beautiful beachfront vacation rental with ocean views and private beach access.',
        'Beachfront vacation rental',
        450.00,
        500.00,
        real_estate_category_id,
        true,
        true,
        'active',
        1,
        ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'],
        ARRAY['Ocean Views', 'Private Beach', 'Hot Tub', 'WiFi'],
        '{"bedrooms": 3, "bathrooms": 2, "sqft": 1800}',
        NOW(),
        NOW()
    );

    -- Insert corresponding real estate properties with different listing types
    INSERT INTO real_estate_properties (
        id, product_id, property_type, bedrooms, bathrooms, square_feet,
        lot_size, year_built, amenities, virtual_tour_url,
        is_available_for_booking, booking_price_per_night, minimum_stay_nights,
        location_details, created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(),
        product1_id,
        'Condominium',
        2,
        2,
        1200,
        0,
        2020,
        ARRAY['Gym', 'Pool', 'Concierge', 'Parking'],
        'https://example.com/virtual-tour-1',
        false,
        0,
        0,
        '{"address": "123 Downtown Ave", "city": "Metro City", "state": "CA", "zip": "90210"}',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        product2_id,
        'Single Family Home',
        4,
        3,
        2500,
        8000,
        2015,
        ARRAY['Garage', 'Backyard', 'Fireplace', 'Central AC'],
        'https://example.com/virtual-tour-2',
        false,
        0,
        0,
        '{"address": "456 Suburban St", "city": "Suburbia", "state": "CA", "zip": "90211"}',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        product3_id,
        'Studio',
        0,
        1,
        600,
        0,
        2022,
        ARRAY['Gym', 'Rooftop', 'Laundry', 'Security'],
        'https://example.com/virtual-tour-3',
        false,
        0,
        0,
        '{"address": "789 Urban Blvd", "city": "Metro City", "state": "CA", "zip": "90212"}',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        product4_id,
        'Beach House',
        3,
        2,
        1800,
        5000,
        2018,
        ARRAY['Beach Access', 'Hot Tub', 'Deck', 'WiFi'],
        'https://example.com/virtual-tour-4',
        true,
        450.00,
        2,
        '{"address": "321 Beach Rd", "city": "Coastal Town", "state": "CA", "zip": "90213"}',
        NOW(),
        NOW()
    );

    -- Insert into listings_real_estate with different listing types
    INSERT INTO listings_real_estate (
        id, title, slug, description, price, currency, bedrooms, bathrooms,
        area, property_type, listing_type, address, location, features,
        amenities, available, featured, virtual_tour_url,
        meta_title, meta_description, created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(),
        'Luxury Downtown Condo',
        'luxury-downtown-condo-listing',
        'Beautiful 2-bedroom luxury condominium in the heart of downtown with stunning city views.',
        850000.00,
        'USD',
        2,
        2,
        1200,
        'Condominium',
        'for_sale',
        '123 Downtown Ave, Metro City, CA 90210',
        'Downtown Metro City',
        ARRAY['City Views', 'Modern Kitchen', 'Balcony', 'Parking'],
        ARRAY['Gym', 'Pool', 'Concierge', 'Parking'],
        true,
        true,
        'https://example.com/virtual-tour-1',
        'Luxury Downtown Condo for Sale',
        'Beautiful 2-bedroom luxury condominium in downtown with city views',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Family Suburban Home',
        'family-suburban-home-listing',
        'Spacious 4-bedroom family home in quiet suburban neighborhood with large backyard.',
        650000.00,
        'USD',
        4,
        3,
        2500,
        'Single Family Home',
        'for_sale',
        '456 Suburban St, Suburbia, CA 90211',
        'Suburbia',
        ARRAY['Large Backyard', 'Garage', 'Modern Kitchen', 'Fireplace'],
        ARRAY['Garage', 'Backyard', 'Fireplace', 'Central AC'],
        true,
        true,
        'https://example.com/virtual-tour-2',
        'Family Suburban Home for Sale',
        'Spacious 4-bedroom family home in quiet suburban neighborhood',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Modern Studio Apartment',
        'modern-studio-apartment-listing',
        'Contemporary studio apartment perfect for young professionals, fully furnished.',
        2500.00,
        'USD',
        0,
        1,
        600,
        'Studio',
        'for_rent',
        '789 Urban Blvd, Metro City, CA 90212',
        'Urban Metro City',
        ARRAY['Furnished', 'Modern Appliances', 'City Location', 'Gym Access'],
        ARRAY['Gym', 'Rooftop', 'Laundry', 'Security'],
        true,
        false,
        'https://example.com/virtual-tour-3',
        'Modern Studio Apartment for Rent',
        'Contemporary studio apartment perfect for young professionals',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Vacation Beach House',
        'vacation-beach-house-listing',
        'Beautiful beachfront vacation rental with ocean views and private beach access.',
        450.00,
        'USD',
        3,
        2,
        1800,
        'Beach House',
        'booking',
        '321 Beach Rd, Coastal Town, CA 90213',
        'Coastal Town',
        ARRAY['Ocean Views', 'Private Beach', 'Hot Tub', 'WiFi'],
        ARRAY['Beach Access', 'Hot Tub', 'Deck', 'WiFi'],
        true,
        true,
        'https://example.com/virtual-tour-4',
        'Vacation Beach House for Booking',
        'Beautiful beachfront vacation rental with ocean views',
        NOW(),
        NOW()
    );

END $$;
