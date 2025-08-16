-- Add product images for luxury items
WITH product_data AS (
  SELECT id, slug FROM products
)

-- Insert product images
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'la-mer-creme-moisturizing-cream' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'tom-ford-oud-wood-eau-de-parfum' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'manhattan-penthouse-central-park-views' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'hamptons-estate-waterfront-mansion' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'private-jet-charter-global-access' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'personal-concierge-platinum-service' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'cartier-love-bracelet-18k-gold' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'tiffany-diamond-solitaire-ring' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN '/placeholder.svg?height=600&width=600'
  END,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN 'Hermès Birkin 35 handbag in premium Togo leather'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN 'Chanel classic tweed jacket with signature details'
    WHEN p.slug = 'la-mer-creme-moisturizing-cream' THEN 'La Mer moisturizing cream jar with Miracle Broth'
    WHEN p.slug = 'tom-ford-oud-wood-eau-de-parfum' THEN 'Tom Ford Oud Wood eau de parfum bottle'
    WHEN p.slug = 'manhattan-penthouse-central-park-views' THEN 'Manhattan penthouse interior with Central Park views'
    WHEN p.slug = 'hamptons-estate-waterfront-mansion' THEN 'Hamptons waterfront estate exterior view'
    WHEN p.slug = 'private-jet-charter-global-access' THEN 'Luxury private jet interior cabin'
    WHEN p.slug = 'personal-concierge-platinum-service' THEN 'Professional concierge service office'
    WHEN p.slug = 'cartier-love-bracelet-18k-gold' THEN 'Cartier Love bracelet in 18K yellow gold'
    WHEN p.slug = 'tiffany-diamond-solitaire-ring' THEN 'Tiffany & Co. diamond solitaire engagement ring'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN 'Rolex Submariner Date watch in Oystersteel'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN 'Patek Philippe Calatrava watch in rose gold'
  END,
  true,
  1,
  NOW()
FROM product_data p;

-- Add additional product images (lifestyle shots)
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'manhattan-penthouse-central-park-views' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'hamptons-estate-waterfront-mansion' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN '/placeholder.svg?height=600&width=600'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN '/placeholder.svg?height=600&width=600'
  END,
  CASE 
    WHEN p.slug = 'hermes-birkin-35-togo-leather' THEN 'Hermès Birkin bag lifestyle shot with elegant styling'
    WHEN p.slug = 'chanel-tweed-jacket-classic' THEN 'Chanel tweed jacket styled in complete outfit'
    WHEN p.slug = 'manhattan-penthouse-central-park-views' THEN 'Manhattan penthouse living room with luxury furnishings'
    WHEN p.slug = 'hamptons-estate-waterfront-mansion' THEN 'Hamptons estate pool area with waterfront views'
    WHEN p.slug = 'rolex-submariner-date-steel' THEN 'Rolex Submariner Date worn on wrist lifestyle shot'
    WHEN p.slug = 'patek-philippe-calatrava-rose-gold' THEN 'Patek Philippe Calatrava elegant wrist presentation'
  END,
  false,
  2,
  NOW()
FROM product_data p
WHERE p.slug IN ('hermes-birkin-35-togo-leather', 'chanel-tweed-jacket-classic', 'manhattan-penthouse-central-park-views', 'hamptons-estate-waterfront-mansion', 'rolex-submariner-date-steel', 'patek-philippe-calatrava-rose-gold');
