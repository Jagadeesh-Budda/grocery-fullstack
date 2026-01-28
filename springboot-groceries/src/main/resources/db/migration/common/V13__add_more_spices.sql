/*
 V13__add_more_spices.sql
 Adds additional spices without duplication
*/

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Turmeric Powder', 'Pure turmeric powder', '/img/turmeric_powder.png'),
             ('Red Chilli Powder', 'Spicy red chilli powder', '/img/red_chilli_powder.png'),
             ('Coriander Powder', 'Aromatic coriander powder', '/img/coriander_powder.png'),
             ('Garam Masala', 'Traditional garam masala', '/img/garam_masala.png'),
             ('Cumin Powder', 'Ground cumin powder', '/img/cumin_powder.png'),
             ('Pepper Powder', 'Ground black pepper', '/img/pepper_powder.png'),
             ('Chaat Masala', 'Tangy chaat masala', '/img/chaat_masala.png'),
             ('Sambar Powder', 'Flavorful sambar powder', '/img/sambar_powder.png'),
             ('Curry Leaves', 'Fresh curry leaves', '/img/curry_leaves.png'),
             ('Ginger Powder', 'Dried ginger powder', '/img/ginger_powder.png'),
             ('Garlic Powder', 'Dried garlic powder', '/img/garlic_powder.png'),
             ('Nutmeg', 'Whole nutmeg seeds', '/img/nutmeg.png'),
             ('Mace', 'Aromatic mace spice', '/img/mace.png'),
             ('Mustard Seeds', 'Whole mustard seeds', '/img/mustard_seeds.png'),
             ('Cumin Seeds', 'Whole cumin seeds', '/img/cumin_seeds.png'),
             ('Fennel Seeds', 'Whole fennel seeds', '/img/fennel_seeds.png'),
             ('Fenugreek Seeds', 'Whole fenugreek seeds', '/img/fenugreek_seeds.png'),
             ('Cloves', 'Whole cloves', '/img/cloves.png'),
             ('Cardamom', 'Green cardamom', '/img/cardamom.png'),
             ('Cinnamon', 'Whole cinnamon sticks', '/img/cinnamon.png'),
             ('Star Anise', 'Whole star anise', '/img/star_anise.png'),
             ('Bay Leaf', 'Aromatic bay leaves', '/img/bay_leaf.png'),
             ('Asafoetida', 'Pure asafoetida', '/img/asafoetida.png')
         ) AS v(name, description)
         JOIN categories c ON c.name = 'Spices'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);
