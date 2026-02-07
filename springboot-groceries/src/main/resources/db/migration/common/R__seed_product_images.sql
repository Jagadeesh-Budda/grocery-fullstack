-- =====================================================
-- Repeatable seed: product images
-- =====================================================

-- Banana
INSERT INTO product_images (product_id, image_url)
SELECT p.id, '/images/products/banana.png'
FROM products p
WHERE p.name = 'Banana'
    ON CONFLICT DO NOTHING;

-- Apple
INSERT INTO product_images (product_id, image_url)
SELECT p.id, '/images/products/apple.png'
FROM products p
WHERE p.name = 'Apple'
    ON CONFLICT DO NOTHING;

-- Tomato
INSERT INTO product_images (product_id, image_url)
SELECT p.id, '/images/products/tomato.png'
FROM products p
WHERE p.name = 'Tomato'
    ON CONFLICT DO NOTHING;

-- Potato
INSERT INTO product_images (product_id, image_url)
SELECT p.id, '/images/products/potato.png'
FROM products p
WHERE p.name = 'Potato'
    ON CONFLICT DO NOTHING;
