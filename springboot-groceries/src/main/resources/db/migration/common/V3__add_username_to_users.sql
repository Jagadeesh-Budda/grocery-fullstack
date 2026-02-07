ALTER TABLE users
    ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- ensure uniqueness (safe even if column exists)
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username ON users(username);
