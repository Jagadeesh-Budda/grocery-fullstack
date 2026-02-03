-- =========================
-- Categories
-- =========================
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            slug VARCHAR(120) UNIQUE NOT NULL,
                            image_url TEXT,
                            is_active BOOLEAN DEFAULT true,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Products
-- =========================
CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          category_id BIGINT NOT NULL,
                          name VARCHAR(150) NOT NULL,
                          slug VARCHAR(160) NOT NULL,
                          base_image_url TEXT,
                          description TEXT,
                          is_active BOOLEAN DEFAULT true,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_products_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(id)
                                  ON DELETE CASCADE
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);

-- =========================
-- Product Variants
-- =========================
CREATE TABLE product_variants (
                                  id BIGSERIAL PRIMARY KEY,
                                  product_id BIGINT NOT NULL,
                                  variant_name VARCHAR(50) NOT NULL,      -- 500g, 1kg, pack of 6
                                  price DECIMAL(10,2) NOT NULL,
                                  stock INT DEFAULT 0,
                                  sku VARCHAR(100) UNIQUE,
                                  is_active BOOLEAN DEFAULT true,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_variants_product
                                      FOREIGN KEY (product_id)
                                          REFERENCES products(id)
                                          ON DELETE CASCADE
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_price ON product_variants(price);
