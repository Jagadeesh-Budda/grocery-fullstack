-- Align DB role values with Java enum Role
UPDATE users
SET role = 'ROLE_ADMIN'
WHERE role = 'ADMIN';

UPDATE users
SET role = 'ROLE_USER'
WHERE role = 'USER';
