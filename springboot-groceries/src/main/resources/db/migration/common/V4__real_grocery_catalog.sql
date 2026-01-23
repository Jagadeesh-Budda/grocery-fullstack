INSERT INTO categories (name, image_url, active)
SELECT c.name, c.image_url, true
FROM (VALUES
          ('Vegetables', '/images/categories/vegetables.png'),
          ('Fruits', '/images/categories/fruits.png'),
          ('Pulses', '/images/categories/pulses.png'),
          ('Grains', '/images/categories/grains.png'),
          ('Dairy', '/images/categories/dairy.png'),
          ('Oils', '/images/categories/oils.png'),
          ('Spices', '/images/categories/spices.png')
     ) AS c(name, image_url)
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = c.name
);
/* ================================
   VEGETABLES
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Tomato','Fresh tomatoes','/img/tomato.png','Vegetables'),
        ('Potato','Fresh potatoes','/img/potato.png','Vegetables'),
        ('Onion','Red onions','/img/onion.png','Vegetables'),
        ('Carrot','Fresh carrots','/img/carrot.png','Vegetables'),
        ('Cabbage','Green cabbage','/img/cabbage.png','Vegetables'),
        ('Cauliflower','Fresh cauliflower','/img/cauliflower.png','Vegetables'),
        ('Beans','Green beans','/img/beans.png','Vegetables'),
        ('Brinjal','Purple brinjal','/img/brinjal.png','Vegetables'),
        ('Capsicum','Green capsicum','/img/capsicum.png','Vegetables'),
        ('Cucumber','Fresh cucumber','/img/cucumber.png','Vegetables'),
        ('Pumpkin','Farm pumpkin','/img/pumpkin.png','Vegetables'),
        ('Bottle Gourd','Fresh bottle gourd','/img/bottlegourd.png','Vegetables'),
        ('Drumstick','Fresh drumstick','/img/drumstick.png','Vegetables'),
        ('Spinach','Green spinach','/img/spinach.png','Vegetables'),
        ('Beetroot','Fresh beetroot','/img/beetroot.png','Vegetables')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);


/* ================================
   FRUITS
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Apple','Fresh apples','/img/apple.png','Fruits'),
        ('Banana','Ripe bananas','/img/banana.png','Fruits'),
        ('Orange','Juicy oranges','/img/orange.png','Fruits'),
        ('Mango','Sweet mangoes','/img/mango.png','Fruits'),
        ('Grapes','Green grapes','/img/grapes.png','Fruits'),
        ('Papaya','Fresh papaya','/img/papaya.png','Fruits'),
        ('Pineapple','Tropical pineapple','/img/pineapple.png','Fruits'),
        ('Watermelon','Fresh watermelon','/img/watermelon.png','Fruits'),
        ('Guava','Fresh guava','/img/guava.png','Fruits'),
        ('Pomegranate','Juicy pomegranate','/img/pomegranate.png','Fruits')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);


/* ================================
   DAIRY
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Milk','Fresh cow milk','/img/milk.png','Dairy'),
        ('Curd','Homemade curd','/img/curd.png','Dairy'),
        ('Butter','Creamy butter','/img/butter.png','Dairy'),
        ('Cheese','Cheddar cheese','/img/cheese.png','Dairy'),
        ('Paneer','Fresh paneer','/img/paneer.png','Dairy'),
        ('Ghee','Pure cow ghee','/img/ghee.png','Dairy')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);


/* ================================
   STAPLES
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Rice','Premium rice','/img/rice.png','Staples'),
        ('Wheat Flour','Whole wheat flour','/img/wheatflour.png','Staples'),
        ('Sugar','Refined sugar','/img/sugar.png','Staples'),
        ('Salt','Iodized salt','/img/salt.png','Staples'),
        ('Toor Dal','Toor dal','/img/toordal.png','Staples'),
        ('Moong Dal','Moong dal','/img/moongdal.png','Staples')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);


/* ================================
   SNACKS
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Potato Chips','Crispy potato chips','/img/chips.png','Snacks'),
        ('Biscuits','Tea biscuits','/img/biscuits.png','Snacks'),
        ('Namkeen','Spicy namkeen','/img/namkeen.png','Snacks'),
        ('Popcorn','Butter popcorn','/img/popcorn.png','Snacks')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);


/* ================================
   BEVERAGES
   ================================ */
INSERT INTO product_masters (name, description, image_url, active, category_id)
SELECT p.name, p.description, p.img, true, c.id
FROM categories c
         JOIN (
    VALUES
        ('Tea','Assam tea','/img/tea.png','Beverages'),
        ('Coffee','Instant coffee','/img/coffee.png','Beverages'),
        ('Soft Drink','Cold soft drink','/img/softdrink.png','Beverages'),
        ('Fruit Juice','Mixed fruit juice','/img/juice.png','Beverages')
) AS p(name, description, img, cat)
              ON c.name = p.cat
WHERE NOT EXISTS (SELECT 1 FROM product_masters pm WHERE pm.name = p.name);

INSERT INTO product_variants
(name,mrp,discount_percent,unit,image_url,stock,product_master_id)
SELECT
    pm.name||' '||v.unit,
    v.price,
    v.discount,
    v.unit,
    '/img/variants/'||lower(replace(pm.name,' ','_'))||'_'||v.unit||'.png',
    v.stock,
    pm.id
FROM product_masters pm
         JOIN (VALUES
                   ('1kg',120,5,150),
                   ('500g',65,0,200)
) v(unit,price,discount,stock)
              ON pm.name NOT IN ('Banana','Milk')
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE name = pm.name||' '||v.unit
);
INSERT INTO product_variants
(name,mrp,discount_percent,unit,image_url,stock,product_master_id)
SELECT
    v.name,v.price,0,'pcs','/img/variants/banana.png',v.stock,pm.id
FROM product_masters pm
         JOIN (VALUES
                   ('Banana 6 pcs',40,200),
                   ('Banana 12 pcs',75,150)
) v(name,price,stock)
              ON pm.name='Banana'
WHERE NOT EXISTS (SELECT 1 FROM product_variants WHERE name=v.name);
INSERT INTO product_variants
(name,mrp,discount_percent,unit,image_url,stock,product_master_id)
SELECT
    pm.name||' '||v.unit,
    v.price,
    5,
    v.unit,
    '/img/variants/pulse.png',
    v.stock,
    pm.id
FROM product_masters pm
         JOIN (VALUES
                   ('1kg',160,120),
                   ('500g',85,180)
) v(unit,price,stock)
              ON pm.category_id=(SELECT id FROM categories WHERE name='Pulses')
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE name=pm.name||' '||v.unit
);
INSERT INTO product_variants
(name,mrp,discount_percent,unit,image_url,stock,product_master_id)
SELECT
    v.name,v.price,0,v.unit,'/img/variants/milk.png',v.stock,pm.id
FROM product_masters pm
         JOIN (VALUES
                   ('Milk 1L',52,'litre',120),
                   ('Milk 500ml',28,'ml',180)
) v(name,price,unit,stock)
              ON pm.name='Milk'
WHERE NOT EXISTS (SELECT 1 FROM product_variants WHERE name=v.name);
