-- =========================
-- USERS
-- =========================
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL UNIQUE,
                            image_url TEXT NOT NULL,
                            active BOOLEAN NOT NULL
);

-- =========================
-- PRODUCT MASTER
-- =========================
CREATE TABLE product_masters (
                                 id BIGSERIAL PRIMARY KEY,
                                 name VARCHAR(255) NOT NULL,
                                 description TEXT NOT NULL,
                                 image_url TEXT NOT NULL,
                                 active BOOLEAN NOT NULL,
                                 category_id BIGINT NOT NULL,
                                 CONSTRAINT fk_product_category
                                     FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- =========================
-- PRODUCT IMAGES
-- =========================
CREATE TABLE product_images (
                                product_id BIGINT NOT NULL,
                                image_url TEXT NOT NULL,
                                CONSTRAINT fk_product_images
                                    FOREIGN KEY (product_id) REFERENCES product_masters(id)
);

-- =========================
-- PRODUCT VARIANTS
-- =========================
CREATE TABLE product_variants (
                                  id BIGSERIAL PRIMARY KEY,
                                  name VARCHAR(255) NOT NULL,
                                  mrp NUMERIC(10,2) NOT NULL,
                                  discount_percent INTEGER NOT NULL,
                                  unit VARCHAR(50) NOT NULL,
                                  image_url TEXT NOT NULL,
                                  stock INTEGER NOT NULL,
                                  product_master_id BIGINT NOT NULL,
                                  CONSTRAINT fk_variant_product
                                      FOREIGN KEY (product_master_id) REFERENCES product_masters(id)
);

-- =========================
-- CARTS
-- =========================
CREATE TABLE carts (
                       id BIGSERIAL PRIMARY KEY,
                       user_id BIGINT NOT NULL UNIQUE,
                       CONSTRAINT fk_cart_user
                           FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- CART ITEMS
-- =========================
CREATE TABLE cart_items (
                            id BIGSERIAL PRIMARY KEY,
                            cart_id BIGINT NOT NULL,
                            product_variant_id BIGINT NOT NULL,
                            quantity INTEGER NOT NULL,
                            CONSTRAINT fk_cart_item_cart
                                FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                            CONSTRAINT fk_cart_item_variant
                                FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        total_amount NUMERIC(10,2) NOT NULL,
                        status VARCHAR(50) NOT NULL,
                        created_at TIMESTAMP NOT NULL,
                        CONSTRAINT fk_order_user
                            FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
                             id BIGSERIAL PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             variant_id BIGINT NOT NULL,
                             product_id BIGINT NOT NULL,
                             product_name VARCHAR(255) NOT NULL,
                             variant_name VARCHAR(255) NOT NULL,
                             quantity INTEGER NOT NULL,
                             price NUMERIC(10,2) NOT NULL,
                             subtotal NUMERIC(10,2) NOT NULL,
                             CONSTRAINT fk_order_item_order
                                 FOREIGN KEY (order_id) REFERENCES orders(id),
                             CONSTRAINT fk_order_item_variant
                                 FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- =========================
-- GROCERIES (optional entity)
-- =========================
CREATE TABLE groceries (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           category VARCHAR(255) NOT NULL,
                           price NUMERIC(10,2) NOT NULL,
                           quantity INTEGER NOT NULL
);
