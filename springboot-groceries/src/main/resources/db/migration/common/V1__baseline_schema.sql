-- USERS
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       role VARCHAR(50) NOT NULL,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- CATEGORIES
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            slug VARCHAR(255) NOT NULL UNIQUE,
                            image_url VARCHAR(255) NOT NULL,
                            description TEXT,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- PRODUCTS
CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT NOT NULL,
                          image_url VARCHAR(255) NOT NULL,
                          category_id BIGINT NOT NULL,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_products_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(id)
);


-- PRODUCT VARIANTS
CREATE TABLE product_variants (
                                  id BIGSERIAL PRIMARY KEY,
                                  product_master_id BIGINT NOT NULL,
                                  sku VARCHAR(100) NOT NULL UNIQUE,
                                  price NUMERIC(10,2) NOT NULL,
                                  discount_percent INT NOT NULL DEFAULT 0,
                                  unit VARCHAR(50) NOT NULL,
                                  image_url VARCHAR(255) NOT NULL,
                                  stock INT NOT NULL DEFAULT 0,
                                  is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_variants_product
                                      FOREIGN KEY (product_master_id)
                                          REFERENCES products(id)
);


-- PRODUCT IMAGES
CREATE TABLE product_images (
                                product_id BIGINT NOT NULL,
                                image_url VARCHAR(255) NOT NULL,

                                PRIMARY KEY (product_id, image_url),

                                CONSTRAINT fk_product_images_product
                                    FOREIGN KEY (product_id)
                                        REFERENCES products(id)
);

-- CARTS
CREATE TABLE carts (
                       id BIGSERIAL PRIMARY KEY,
                       user_id BIGINT NOT NULL UNIQUE,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_carts_user
                           FOREIGN KEY (user_id)
                               REFERENCES users(id)
);


-- CART ITEMS
CREATE TABLE cart_items (
                            id BIGSERIAL PRIMARY KEY,
                            cart_id BIGINT NOT NULL,
                            product_variant_id BIGINT NOT NULL,
                            quantity INT NOT NULL,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT fk_cart_items_cart
                                FOREIGN KEY (cart_id)
                                    REFERENCES carts(id),

                            CONSTRAINT fk_cart_items_variant
                                FOREIGN KEY (product_variant_id)
                                    REFERENCES product_variants(id)
);


-- ORDERS
CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        total_amount NUMERIC(10,2) NOT NULL,
                        status VARCHAR(50) NOT NULL,
                        is_active BOOLEAN NOT NULL DEFAULT TRUE,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_orders_user
                            FOREIGN KEY (user_id)
                                REFERENCES users(id)
);


-- ORDER ITEMS
CREATE TABLE order_items (
                             id BIGSERIAL PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             product_variant_id BIGINT NOT NULL,
                             product_id BIGINT NOT NULL,
                             product_name VARCHAR(255) NOT NULL,
                             variant_name VARCHAR(255) NOT NULL,
                             quantity INT NOT NULL,
                             price NUMERIC(10,2) NOT NULL,
                             subtotal NUMERIC(10,2) NOT NULL,
                             is_active BOOLEAN NOT NULL DEFAULT TRUE,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_order_items_order
                                 FOREIGN KEY (order_id)
                                     REFERENCES orders(id),

                             CONSTRAINT fk_order_items_variant
                                 FOREIGN KEY (product_variant_id)
                                     REFERENCES product_variants(id)
);
