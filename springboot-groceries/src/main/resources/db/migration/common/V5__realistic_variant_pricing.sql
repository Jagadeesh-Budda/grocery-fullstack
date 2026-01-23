/* =========================================================
   REALISTIC PRODUCT VARIANTS WITH PRICING
   ========================================================= */

INSERT INTO product_variants
(
    name,
    mrp,
    discount_percent,
    unit,
    image_url,
    stock,
    product_master_id
)
SELECT
    pm.name || ' ' || u.unit                                  AS name,
    ROUND(v.base_price * u.multiplier, 2)                     AS mrp,
    u.discount                                                AS discount_percent,
    u.unit,
    '/img/variants/' ||
    lower(replace(pm.name, ' ', '-')) || '-' || u.unit || '.png'
                                                              AS image_url,
    u.stock,
    pm.id                                                     AS product_master_id
FROM product_masters pm

/* ---------- Base prices per product ---------- */
         JOIN (
    VALUES
        ('Tomato', 32),
        ('Potato', 28),
        ('Onion', 30),
        ('Carrot', 40),
        ('Capsicum', 70),
        ('Cabbage', 26),
        ('Cauliflower', 35),
        ('Beans', 55),
        ('Brinjal', 45),
        ('Apple', 120),
        ('Banana', 45),
        ('Orange', 60),
        ('Mango', 140),
        ('Milk', 28),
        ('Curd', 35),
        ('Butter', 240),
        ('Paneer', 380),
        ('Rice', 55),
        ('Wheat Flour', 48),
        ('Sugar', 42),
        ('Salt', 22),
        ('Tea', 220),
        ('Coffee', 310),
        ('Biscuits', 30),
        ('Potato Chips', 20),
        ('Soft Drink', 40),
        ('Fruit Juice', 60)
) AS v(name, base_price)
              ON pm.name = v.name

/* ---------- Variant units & pricing rules ---------- */
         JOIN (
    VALUES
        ('250g', 0.25, 3, 200),
        ('500g', 0.50, 5, 150),
        ('1kg',  1.00, 8, 100),
        ('2kg',  2.00, 10, 60)
) AS u(unit, multiplier, discount, stock)
              ON TRUE

/* ---------- Prevent duplicate variants ---------- */
WHERE NOT EXISTS (
    SELECT 1
    FROM product_variants pv
    WHERE pv.product_master_id = pm.id
      AND pv.unit = u.unit
);
