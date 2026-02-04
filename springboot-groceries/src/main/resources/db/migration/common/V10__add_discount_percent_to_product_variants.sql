ALTER TABLE product_variants
    ADD COLUMN discount_percent INTEGER NOT NULL DEFAULT 0
        CHECK (discount_percent BETWEEN 0 AND 100);
