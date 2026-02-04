-- carts table
CREATE TABLE carts (
                       id BIGSERIAL PRIMARY KEY,
                       user_id BIGINT NOT NULL UNIQUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_carts_user
                           FOREIGN KEY (user_id) REFERENCES users(id)
);

-- cart_items table
CREATE TABLE cart_items (
                            id BIGSERIAL PRIMARY KEY,
                            cart_id BIGINT NOT NULL,
                            product_variant_id BIGINT NOT NULL,
                            quantity INTEGER NOT NULL CHECK (quantity >= 1),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT fk_cart_items_cart
                                FOREIGN KEY (cart_id)
                                    REFERENCES carts(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_cart_items_product_variant
                                FOREIGN KEY (product_variant_id)
                                    REFERENCES product_variants(id),

                            CONSTRAINT uq_cart_variant
                                UNIQUE (cart_id, product_variant_id)
);
