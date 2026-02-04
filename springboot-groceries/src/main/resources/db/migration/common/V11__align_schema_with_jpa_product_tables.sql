ALTER TABLE categories
    ALTER COLUMN image_url SET NOT NULL;

UPDATE categories SET is_active = active WHERE is_active IS DISTINCT FROM active;

ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS mrp DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS unit VARCHAR(100),
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS product_master_id BIGINT;

UPDATE product_variants
SET name = variant_name,
    mrp = price
WHERE name IS NULL OR mrp IS NULL;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

UPDATE products
SET image_url = base_image_url,
    active = is_active
WHERE image_url IS NULL OR active IS NULL;

ALTER TABLE product_variants
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN mrp SET NOT NULL,
    ALTER COLUMN unit SET NOT NULL,
    ALTER COLUMN image_url SET NOT NULL,
    ALTER COLUMN product_master_id SET NOT NULL;
