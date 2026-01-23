-- H2-compatible seed data

INSERT INTO categories (name, image_url, active)
SELECT 'Vegetables', 'default_category.jpg', TRUE
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Vegetables'
);

INSERT INTO categories (name, image_url, active)
SELECT 'Fruits', 'default_category.jpg', TRUE
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Fruits'
);
