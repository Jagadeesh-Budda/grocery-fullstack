-- ========================
-- orders table
-- ========================
CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,

                        user_id BIGINT NOT NULL,

                        total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),

                        status VARCHAR(30) NOT NULL,

                        created_at TIMESTAMP NOT NULL,

                        CONSTRAINT fk_orders_user
                            FOREIGN KEY (user_id)
                                REFERENCES users(id)
);

-- ========================
-- order_items table
-- ========================
CREATE TABLE order_items (
                             id BIGSERIAL PRIMARY KEY,

                             order_id BIGINT NOT NULL,

                             variant_id BIGINT NOT NULL,

                             product_id BIGINT NOT NULL,

                             product_name VARCHAR(255) NOT NULL,

                             variant_name VARCHAR(255) NOT NULL,

                             quantity INTEGER NOT NULL CHECK (quantity >= 1),

                             price NUMERIC(10,2) NOT NULL CHECK (price > 0),

                             subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal > 0),

                             CONSTRAINT fk_order_items_order
                                 FOREIGN KEY (order_id)
                                     REFERENCES orders(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_order_items_variant
                                 FOREIGN KEY (variant_id)
                                     REFERENCES product_variants(id)
);
