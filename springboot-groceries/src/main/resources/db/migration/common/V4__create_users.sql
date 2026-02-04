CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(100),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
