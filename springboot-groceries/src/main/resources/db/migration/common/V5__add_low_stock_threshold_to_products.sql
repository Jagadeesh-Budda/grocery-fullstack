-- Add low_stock_threshold used by dashboard low-stock query
-- Default chosen to be conservative for existing rows

ALTER TABLE products
    ADD COLUMN low_stock_threshold INT NOT NULL DEFAULT 5;
