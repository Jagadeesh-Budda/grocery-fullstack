-- =====================================================
-- Repeatable seed: categories
-- =====================================================

INSERT INTO categories (name, slug, image_url, description, is_active)
VALUES
    ('Fruits & Vegetables', 'fruits-vegetables', '/images/categories/fruits.png', 'Fresh fruits and vegetables', true),
    ('Dairy Products', 'dairy-products', '/images/categories/dairy.png', 'Milk, cheese, butter and dairy items', true),
    ('Bakery', 'bakery', '/images/categories/bakery.png', 'Bread, cakes and baked items', true),
    ('Meat & Seafood', 'meat-seafood', '/images/categories/meat-seafood.png', 'Fresh meat and seafood', true),
    ('Pantry Staples', 'pantry-staples', '/images/categories/pantry.png', 'Rice, pulses, oils and staples', true),
    ('Snacks & Biscuits', 'snacks-biscuits', '/images/categories/snacks-biscuits.png', 'Tasty snacks and biscuits', true),
    ('Frozen Foods', 'frozen-foods', '/images/categories/frozen-foods.png', 'Frozen vegetables, meat, and ready-to-eat meals', true),
    ('Personal Care', 'personal-care', '/images/categories/personal-care.png', 'Personal hygiene and care products', true),
    ('Household Items', 'household-items', '/images/categories/household-items.png', 'Cleaning supplies and household essentials', true),
    ('Baby Products', 'baby-products', '/images/categories/baby-products.png', 'Products for babies and toddlers', true),
    ('Health & Wellness', 'health-wellness', '/images/categories/health-wellness.png', 'Vitamins, supplements and health products', true),

    ('Beverages', 'beverages', '/images/categories/beverages.png', 'Soft drinks, juices and beverages', true)
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;
