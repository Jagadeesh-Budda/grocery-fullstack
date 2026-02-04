-- 1. Backfill existing rows
UPDATE product_variants
SET unit = 'pcs'
WHERE unit IS NULL;

-- 2. Enforce NOT NULL
ALTER TABLE product_variants
    ALTER COLUMN unit SET NOT NULL;

-- 3. Prevent empty strings
ALTER TABLE product_variants
    ADD CONSTRAINT chk_product_variants_unit
        CHECK (unit <> '');
