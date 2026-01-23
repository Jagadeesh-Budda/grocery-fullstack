-- =========================
-- SEED CATEGORIES
-- =========================
INSERT INTO categories (name, image_url, active)
VALUES
    ('Grains', '/images/categories/grains.png', true),
    ('Vegetables', '/images/categories/vegetables.png', true),
    ('Fruits', '/images/categories/fruits.png', true),
    ('Dairy', '/images/categories/dairy.png', true)
ON CONFLICT (name) DO NOTHING;


-- =========================
-- SEED USERS (optional admin user)
-- password here should already be encoded in real apps
-- =========================
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@groceries.com', '$2a$10$dummyhash', 'ADMIN')
ON CONFLICT (username) DO NOTHING;


-- =========================
-- SEED PRODUCT MASTER
-- =========================
-- =========================
-- SEED PRODUCT MASTER
-- =========================

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT
    'Rice',
    'Premium quality rice',
    '/images/products/rice.png',
    true,
    c.id
FROM categories c
WHERE c.name = 'Grains'
  AND NOT EXISTS (
    SELECT 1 FROM product_masters WHERE name = 'Rice'
);

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT
    'Milk',
    'Fresh cow milk',
    '/images/products/milk.png',
    true,
    c.id
FROM categories c
WHERE c.name = 'Dairy'
  AND NOT EXISTS (
    SELECT 1 FROM product_masters WHERE name = 'Milk'
);




-- =========================
-- SEED PRODUCT VARIANTS
-- =========================
-- =========================
-- SEED PRODUCT VARIANTS
-- =========================

INSERT INTO product_variants
(name, mrp, discount_percent, unit, image_url, stock, product_master_id)
SELECT
    'Rice 1kg',
    45.00,
    5,
    'kg',
    '/images/products/rice_1kg.png',
    100,
    pm.id
FROM product_masters pm
WHERE pm.name = 'Rice'
  AND NOT EXISTS (
    SELECT 1
    FROM product_variants pv
    WHERE pv.name = 'Rice 1kg'
);

INSERT INTO product_variants
(name, mrp, discount_percent, unit, image_url, stock, product_master_id)
SELECT
    'Milk 1L',
    50.00,
    0,
    'litre',
    '/images/products/milk_1l.png',
    50,
    pm.id
FROM product_masters pm
WHERE pm.name = 'Milk'
  AND NOT EXISTS (
    SELECT 1
    FROM product_variants pv
    WHERE pv.name = 'Milk 1L'
);





-- =========================
-- SEED GROCERIES (legacy/simple entity)
-- =========================
-- =========================
-- SEED GROCERIES (legacy/simple entity)
-- =========================

INSERT INTO groceries (name, category, price, quantity)
SELECT 'Rice', 'Grains', 45.00, 100
WHERE NOT EXISTS (
    SELECT 1 FROM groceries WHERE name = 'Rice'
);

INSERT INTO groceries (name, category, price, quantity)
SELECT 'Wheat', 'Grains', 38.00, 200
WHERE NOT EXISTS (
    SELECT 1 FROM groceries WHERE name = 'Wheat'
);

INSERT INTO groceries (name, category, price, quantity)
SELECT 'Milk', 'Dairy', 50.00, 50
WHERE NOT EXISTS (
    SELECT 1 FROM groceries WHERE name = 'Milk'
);


