/*
 V12__add_more_oils.sql
 Adds additional edible oils safely (no overlap)
*/

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Sunflower Oil', 'Refined sunflower oil', '/img/sunflower_oil.png'),
             ('Palm Oil', 'Refined palm oil', '/img/palm_oil.png'),
             ('Groundnut Oil', 'Cold pressed groundnut oil', '/img/groundnut_oil.png'),
             ('Mustard Oil', 'Pure mustard oil', '/img/mustard_oil.png'),
             ('Coconut Oil', 'Pure coconut oil', '/img/coconut_oil.png'),
             ('Rice Bran Oil', 'Healthy rice bran oil', '/img/rice_bran_oil.png'),
             ('Soybean Oil', 'Refined soybean oil', '/img/soybean_oil.png'),
             ('Sesame Oil', 'Traditional gingelly oil', '/img/sesame_oil.png'),
             ('Olive Oil', 'Extra virgin olive oil', '/img/olive_oil.png')
         ) AS v(name, description)
         JOIN categories c ON c.name = 'Oils'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);
