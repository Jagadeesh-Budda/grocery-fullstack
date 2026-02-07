-- =====================================================
-- R__seed_users.sql
-- =====================================================

INSERT INTO users (
    role,
    username,
    email,
    password,
    is_active
)
VALUES
    ('ROLE_ADMIN', 'admin', 'admin@grocery.com', '$2a$10$dummyhashedpassword', true),
    ('ROLE_USER',  'user',  'user@grocery.com',  '$2a$10$dummyhashedpassword', true)
    ON CONFLICT (email) DO NOTHING;
