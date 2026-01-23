-- =========================
-- CATEGORY → PRODUCT MASTER
-- =========================
CREATE INDEX idx_product_masters_category_id
    ON product_masters (category_id);

-- =========================
-- PRODUCT MASTER → VARIANTS
-- =========================
CREATE INDEX idx_product_variants_product_master_id
    ON product_variants (product_master_id);

-- =========================
-- USER → ORDERS
-- =========================
CREATE INDEX idx_orders_user_id
    ON orders (user_id);

-- =========================
-- ORDER → ORDER ITEMS
-- =========================
CREATE INDEX idx_order_items_order_id
    ON order_items (order_id);

-- =========================
-- VARIANT → ORDER ITEMS
-- =========================
CREATE INDEX idx_order_items_variant_id
    ON order_items (variant_id);

-- =========================
-- CART → CART ITEMS
-- =========================
CREATE INDEX idx_cart_items_cart_id
    ON cart_items (cart_id);

-- =========================
-- VARIANT → CART ITEMS
-- =========================
CREATE INDEX idx_cart_items_product_variant_id
    ON cart_items (product_variant_id);
