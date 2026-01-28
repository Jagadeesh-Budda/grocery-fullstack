/*
 V10__add_more_fruits.sql
 Adds additional fruits without duplicating existing catalog
*/

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES

             ('Guava', 'Fresh guava', '/img/guava.png'),
             ('Papaya', 'Fresh papaya', '/img/papaya.png'),
             ('Pineapple', 'Fresh pineapple', '/img/pineapple.png'),
             ('Mango', 'Fresh mango', '/img/mango.png'),
             ('Banana', 'Fresh banana', '/img/banana.png'),
             ('Orange', 'Fresh orange', '/img/orange.png'),
             ('Pomegranate', 'Fresh pomegranate', '/img/pomegranate.png'),
             ('Watermelon', 'Fresh watermelon', '/img/watermelon.png'),
             ('Muskmelon', 'Fresh muskmelon', '/img/muskmelon.png'),
             ('Kiwi', 'Fresh kiwi', '/img/kiwi.png'),
             ('Strawberry', 'Fresh strawberry', '/img/strawberry.png'),
             ('Grapes', 'Fresh grapes', '/img/grapes.png'),
             ('Litchi', 'Fresh litchi', '/img/litchi.png'),
             ('Custard Apple', 'Fresh custard apple', '/img/custard_apple.png'),
             ('Mosambi', 'Fresh sweet lime', '/img/mosambi.png'),
             ('Dragon Fruit', 'Fresh dragon fruit', '/img/dragon_fruit.png'),
             ('Jackfruit', 'Fresh jackfruit', '/img/jackfruit.png'),
             ('Pear', 'Fresh pear', '/img/pear.png'),
             ('Plum', 'Fresh plum', '/img/plum.png'),
             ('Peach', 'Fresh peach', '/img/peach.png'),
             ('Blueberries', 'Fresh blueberries', '/img/blueberries.png'),
             ('Cherries', 'Fresh cherries', '/img/cherries.png'),
             ('Avocado', 'Fresh avocado', '/img/avocado.png')

     ) AS v(name, description)
         JOIN categories c ON c.name = 'Fruits'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);
