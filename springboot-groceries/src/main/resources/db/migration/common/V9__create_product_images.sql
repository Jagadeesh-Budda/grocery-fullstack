CREATE TABLE product_images (
                                id BIGSERIAL PRIMARY KEY,

                                product_id BIGINT NOT NULL,

                                image_url VARCHAR(500) NOT NULL,

                                is_primary BOOLEAN NOT NULL DEFAULT FALSE,

                                sort_order INTEGER NOT NULL DEFAULT 0,

                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_product_images_product
                                    FOREIGN KEY (product_id)
                                        REFERENCES products(id)
                                        ON DELETE CASCADE
);
