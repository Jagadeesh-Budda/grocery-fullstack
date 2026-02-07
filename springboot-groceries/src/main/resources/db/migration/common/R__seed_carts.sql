-- =====================================================
-- R__seed_carts.sql
-- Repeatable Flyway migration: Seed dev user cart
-- Idempotent: DELETE + INSERT pattern
-- Depends on: R__seed_users.sql (dev user must exist)
-- Creates exactly ONE cart for the dev user
-- =====================================================

-- Cart items and carts for dev user already cleared in R__seed_users.sql
-- Insert exactly ONE cart for the dev user

-- Repeatable seed: carts
-- Ensures exactly one active cart per dev user

DELETE FROM cart_items;
DELETE FROM carts;

INSERT INTO carts (user_id, is_active, created_at)
SELECT id, true, CURRENT_TIMESTAMP
FROM users
WHERE email = 'dev@grocery.local';


