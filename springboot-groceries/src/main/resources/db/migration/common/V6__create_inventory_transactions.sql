-- Inventory transaction ledger
-- Records stock movements for admin adjustments and order lifecycle.

CREATE TABLE inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    type VARCHAR(50) NOT NULL,

    variant_id BIGINT NOT NULL,
    order_id BIGINT NULL,

    delta INT NOT NULL,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,

    reason TEXT NULL,

    actor_username VARCHAR(255) NULL,
    actor_user_id BIGINT NULL,

    CONSTRAINT fk_inventory_tx_variant
        FOREIGN KEY (variant_id) REFERENCES product_variants(id),

    CONSTRAINT fk_inventory_tx_order
        FOREIGN KEY (order_id) REFERENCES orders(id),

    CONSTRAINT fk_inventory_tx_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE INDEX idx_inventory_tx_variant_created_at
    ON inventory_transactions (variant_id, created_at DESC);

CREATE INDEX idx_inventory_tx_order_created_at
    ON inventory_transactions (order_id, created_at DESC);

CREATE INDEX idx_inventory_tx_created_at
    ON inventory_transactions (created_at DESC);
