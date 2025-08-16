-- Add authentic luxury product reviews
WITH product_data AS (
  SELECT id, slug FROM products
),
sample_users AS (
  SELECT gen_random_uuid() as user_id, 'Verified Buyer' as name
  FROM generate_series(1, 20)
)

INSERT INTO product_reviews (id, product_id, user_id, rating, title, comment, verified_purchase, helpful_count, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  p.id,
  (SELECT user_id FROM sample_users ORDER BY random() LIMIT 1),
  CASE 
    WHEN p.slug LIKE '%hermes%' OR p.slug LIKE '%cartier%' OR p.slug LIKE '%patek%' THEN 5
    WHEN p.slug LIKE '%chanel%' OR p.slug LIKE '%rolex%' OR p.slug LIKE '%tiffany%' THEN (4 + random())::int
    ELSE (4 + random())::int
  END,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN 'Investment piece worth every penny'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN 'Timeless elegance and perfect fit'
    WHEN p.slug = 'la-mer-creme-moisturizing-cream' THEN 'Transformative skincare results'
    WHEN p.slug = 'tom-ford-oud-wood-eau-de-parfum' THEN 'Sophisticated and long-lasting'
    WHEN p.slug = 'manhattan-penthouse-central-park-views' THEN 'Breathtaking views and luxury living'
    WHEN p.slug = 'hamptons-estate-waterfront-mansion' THEN 'Perfect for entertaining and relaxation'
    WHEN p.slug = 'private-jet-charter-global-access' THEN 'Exceptional service and comfort'
    WHEN p.slug = 'personal-concierge-platinum-service' THEN 'Life-changing convenience and attention to detail'
    WHEN p.slug = 'cartier-love-bracelet-18k-gold' THEN 'Beautiful craftsmanship and meaningful design'
    WHEN p.slug = 'tiffany-diamond-solitaire-ring' THEN 'Stunning brilliance and classic setting'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN 'Reliable luxury timepiece'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN 'Horological masterpiece'
  END,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN 'This Birkin bag exceeded all my expectations. The craftsmanship is impeccable, and the Togo leather feels incredibly luxurious. It''s not just a handbag; it''s a work of art that I''ll treasure forever. The investment value makes it even more special.'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN 'The quality and attention to detail in this Chanel jacket is extraordinary. The fit is perfect, and the tweed fabric feels amazing. It''s a timeless piece that elevates any outfit. Worth every penny for such iconic fashion.'
    WHEN p.slug = 'la-mer-creme-moisturizing-cream' THEN 'After using La Mer for three months, my skin has never looked better. The texture is rich and luxurious, and the results are visible. It''s expensive, but the transformation in my skin makes it worth the investment.'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN 'This Submariner is everything I hoped for in a luxury watch. The build quality is exceptional, and it keeps perfect time. It''s versatile enough for both diving and formal occasions. A true classic that will last generations.'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN 'The Calatrava represents the pinnacle of watchmaking artistry. The rose gold case is beautiful, and the manual movement is a joy to wind. This is more than a timepiece; it''s a family heirloom in the making.'
    ELSE 'Exceptional quality and luxury experience. Highly recommended for those who appreciate the finest things in life.'
  END,
  true,
  (random() * 15)::int,
  NOW() - (random() * interval '90 days'),
  NOW()
FROM product_data p
ORDER BY random()
LIMIT 25;
