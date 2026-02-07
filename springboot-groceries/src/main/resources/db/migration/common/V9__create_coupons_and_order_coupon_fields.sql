-- Basic coupon system
-- - Flat % discount
-- - Expiry date
-- - Usage limit

CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    percent_off INT NOT NULL,
    expires_at TIMESTAMP NULL,
    usage_limit INT NULL,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons (code);
CREATE INDEX idx_coupons_is_active_expires_at ON coupons (is_active, expires_at);

ALTER TABLE orders
    ADD COLUMN coupon_id BIGINT NULL;

ALTER TABLE orders
    ADD COLUMN subtotal_amount NUMERIC(10,2) NULL;

ALTER TABLE orders
    ADD COLUMN discount_amount NUMERIC(10,2) NULL;

UPDATE orders
SET subtotal_amount = total_amount,
    discount_amount = 0
WHERE subtotal_amount IS NULL
   OR discount_amount IS NULL;

ALTER TABLE orders
    ALTER COLUMN subtotal_amount SET NOT NULL;

ALTER TABLE orders
    ALTER COLUMN discount_amount SET NOT NULL;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id);

CREATE INDEX idx_orders_coupon_id ON orders (coupon_id);
