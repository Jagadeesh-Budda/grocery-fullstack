-- Audit log
-- Records admin mutations with actor, entity, before/after JSON and timestamp.

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    actor_username VARCHAR(255) NULL,
    actor_user_id BIGINT NULL,

    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,

    before_json VARCHAR(100000) NULL,
    after_json VARCHAR(100000) NULL,

    CONSTRAINT fk_audit_log_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_log_entity_entity_id_created_at
    ON audit_log (entity, entity_id, created_at DESC);

CREATE INDEX idx_audit_log_actor_username_created_at
    ON audit_log (actor_username, created_at DESC);

CREATE INDEX idx_audit_log_created_at
    ON audit_log (created_at DESC);
