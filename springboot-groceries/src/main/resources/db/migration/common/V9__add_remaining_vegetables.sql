INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Lady Finger', 'Fresh tender lady finger'),
             ('Ridge Gourd', 'Fresh ridge gourd'),
             ('Snake Gourd', 'Fresh snake gourd'),
             ('Ivy Gourd', 'Fresh ivy gourd'),
             ('Cluster Beans', 'Fresh cluster beans'),
             ('Green Peas', 'Fresh green peas'),
             ('Sweet Corn', 'Fresh sweet corn'),
             ('Spring Onion', 'Fresh spring onion'),
             ('Mushroom', 'Fresh button mushrooms'),
             ('Lettuce', 'Fresh green lettuce'),
             ('Broccoli', 'Fresh broccoli'),
             ('Zucchini', 'Fresh zucchini'),
             ('Celery', 'Fresh celery sticks'),
             ('Radish', 'Fresh radish'),
             ('Turnip', 'Fresh turnip')
     ) AS v(name, description)
         JOIN categories c
              ON c.name = 'Vegetables'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE LOWER(p.name) = LOWER(v.name)
);
