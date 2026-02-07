-- Multi-store inventory support

CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_by_store (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL,
    product_variant_id BIGINT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_by_store_store
        FOREIGN KEY (store_id) REFERENCES stores(id),

    CONSTRAINT fk_inventory_by_store_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id),

    CONSTRAINT uq_inventory_by_store_store_variant
        UNIQUE (store_id, product_variant_id)
);

CREATE INDEX idx_inventory_by_store_store_id
    ON inventory_by_store (store_id);

CREATE INDEX idx_inventory_by_store_variant_id
    ON inventory_by_store (product_variant_id);

CREATE INDEX idx_inventory_by_store_store_stock
    ON inventory_by_store (store_id, stock);
