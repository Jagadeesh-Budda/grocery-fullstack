/*
 V11__add_more_pulses_and_grains.sql
 Adds additional pulses and grains safely
*/

-- =========================
-- PULSES
-- =========================
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Masoor Dal', 'Red lentils', '/img/masoor_dal.png'),
             ('Moong Dal', 'Yellow moong dal', '/img/moong_dal.png'),
             ('Urad Dal', 'Black gram dal', '/img/urad_dal.png'),
             ('Toor Dal', 'Pigeon peas dal', '/img/toor_dal.png'),
             ('Rajma', 'Kidney beans', '/img/rajma.png'),
             ('Kabuli Chana', 'White chickpeas', '/img/kabuli_chana.png'),
             ('Green Gram', 'Whole green gram', '/img/green_gram.png'),
             ('Black Chana', 'Black chickpeas', '/img/black_chana.png'),
             ('Horse Gram', 'Horse gram pulses', '/img/horse_gram.png'),
             ('Lobia', 'Black-eyed peas', '/img/lobia.png'),
             ('Chana Dal', 'Split chickpeas dal', '/img/chana_dal.png'),
             ('Pigeon Peas', 'Whole pigeon peas', '/img/pigeon_peas.png')
     ) AS v(name, description)
         JOIN categories c ON c.name = 'Pulses'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);

-- =========================
-- GRAINS
-- =========================
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT v.name,
       v.description,
       '/img/placeholder.png',
       true,
       c.id
FROM (
         VALUES
             ('Basmati Rice', 'Premium basmati rice', '/img/basmati_rice.png'),
             ('Brown Rice', 'Healthy brown rice', '/img/brown_rice.png'),
             ('Raw Rice', 'Unpolished raw rice', '/img/raw_rice.png'),
             ('White Rice', 'Regular white rice', '/img/white_rice.png'),
             ('Wheat Flour', 'Whole wheat flour', '/img/wheat_flour.png'),
             ('Semolina', 'Fine semolina', '/img/semolina.png'),
             ('Oats', 'Rolled oats', '/img/oats.png'),
             ('Ragi', 'Finger millet', '/img/ragi.png'),
             ('Jowar', 'Sorghum grain', '/img/jowar.png'),
             ('Bajra', 'Pearl millet', '/img/bajra.png'),
             ('Maize', 'Whole maize grain', '/img/maize.png'),
             ('Barley', 'Whole barley grain', '/img/barley.png')
     ) AS v(name, description)
         JOIN categories c ON c.name = 'Grains'
WHERE NOT EXISTS (
    SELECT 1
    FROM product_masters p
    WHERE p.name = v.name
);
