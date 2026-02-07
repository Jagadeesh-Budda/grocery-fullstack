-- Add slug column
ALTER TABLE products
    ADD COLUMN slug VARCHAR(255);

-- Backfill slug for existing products
UPDATE products
SET slug = lower(replace(name, ' ', '-'))
WHERE slug IS NULL;

-- Add unique constraint
ALTER TABLE products
    ADD CONSTRAINT uq_products_slug UNIQUE (slug);
