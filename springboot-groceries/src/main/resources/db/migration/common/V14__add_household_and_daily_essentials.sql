/*
 V14__add_household_and_daily_essentials.sql
 Adds household and daily essential products without duplication
*/

INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Bath Soap', 'Bathing soap', '/img/bath_soap.png'),
             ('Body Wash', 'Liquid body wash', '/img/body_wash.png'),
             ('Face Wash', 'Facial cleansing wash', '/img/face_wash.png'),
             ('Moisturizer', 'Skin moisturizing lotion', '/img/moisturizer.png'),
             ('Sunscreen', 'Skin protection sunscreen', '/img/sunscreen.png'),
             ('Hand Sanitizer', 'Alcohol-based hand sanitizer', '/img/hand_sanitizer.png'),
             ('Hand Wash', 'Liquid hand wash', '/img/hand_wash.png'),
             ('Shampoo', 'Hair cleansing shampoo', '/img/shampoo.png'),
             ('Conditioner', 'Hair conditioning treatment', '/img/conditioner.png'),
             ('Hair Oil', 'Nourishing hair oil', '/img/hair_oil.png'),
             ('Toothpaste', 'Dental care toothpaste', '/img/toothpaste.png'),
             ('Toothbrush', 'Dental care toothbrush', '/img/toothbrush.png'),
             ('Dish Wash Liquid', 'Dishwashing liquid', '/img/dish_wash_liquid.png'),
             ('Dish Wash Bar', 'Dishwashing bar', '/img/dish_wash_bar.png'),
             ('Detergent Powder', 'Laundry detergent powder', '/img/detergent_powder.png'),
             ('Detergent Liquid', 'Liquid laundry detergent', '/img/detergent_liquid.png'),
             ('Fabric Conditioner', 'Fabric softener', '/img/fabric_conditioner.png'),
             ('Floor Cleaner', 'House floor cleaner', '/img/floor_cleaner.png'),
             ('Toilet Cleaner', 'Toilet bowl cleaner', '/img/toilet_cleaner.png'),
             ('Phenyl', 'Disinfectant floor cleaner', '/img/phenyl.png'),
             ('Garbage Bags', 'Disposable garbage bags', '/img/garbage_bags.png'),
             ('Paper Towels', 'Absorbent paper towels', '/img/paper_towels.png')

     ) AS v(name, description)
         JOIN categories c ON c.name = 'Household'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);
