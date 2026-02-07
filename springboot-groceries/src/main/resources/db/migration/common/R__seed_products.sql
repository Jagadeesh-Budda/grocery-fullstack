
INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Banana', 'banana', 'Fresh ripe bananas rich in potassium', '/images/products/banana.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Apple', 'apple', 'Crisp and juicy Shimla apples', '/images/products/apple.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tomato', 'tomato', 'Fresh vine-ripened tomatoes', '/images/products/tomato.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Potato', 'potato', 'Fresh farm potatoes', '/images/products/potato.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Onion', 'onion', 'Fresh red onions', '/images/products/onion.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Carrot', 'carrot', 'Fresh organic carrots', '/images/products/carrot.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Spinach', 'spinach', 'Fresh leafy spinach (Palak)', '/images/products/spinach.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Capsicum', 'capsicum', 'Fresh green bell pepper', '/images/products/capsicum.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Cucumber', 'cucumber', 'Fresh green cucumbers', '/images/products/cucumber.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Mango', 'mango', 'Sweet Alphonso mangoes', '/images/products/mango.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Orange', 'orange', 'Juicy Nagpur oranges', '/images/products/orange.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Grapes', 'grapes', 'Fresh seedless grapes', '/images/products/grapes.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pomegranate', 'pomegranate', 'Fresh ruby pomegranates', '/images/products/pomegranate.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Cauliflower', 'cauliflower', 'Fresh white cauliflower', '/images/products/cauliflower.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Cabbage', 'cabbage', 'Fresh green cabbage', '/images/products/cabbage.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Brinjal', 'brinjal', 'Fresh purple brinjal (Baingan)', '/images/products/brinjal.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lady Finger', 'lady-finger', 'Fresh okra (Bhindi)', '/images/products/ladyfinger.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Green Chilli', 'green-chilli', 'Fresh spicy green chillies', '/images/products/greenchilli.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Ginger', 'ginger', 'Fresh aromatic ginger', '/images/products/ginger.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Garlic', 'garlic', 'Fresh garlic bulbs', '/images/products/garlic.png', c.id, true
FROM categories c WHERE c.slug = 'fruits-vegetables' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Toned Milk', 'amul-toned-milk', 'Fresh toned milk 3% fat', '/images/products/amul-toned-milk.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Full Cream Milk', 'amul-full-cream-milk', 'Rich full cream milk 6% fat', '/images/products/amul-fullcream.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Butter', 'amul-butter', 'Fresh salted butter', '/images/products/amul-butter.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Cheese Slices', 'amul-cheese-slices', 'Processed cheese slices', '/images/products/amul-cheese.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Paneer', 'amul-paneer', 'Fresh cottage cheese', '/images/products/amul-paneer.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Curd', 'amul-curd', 'Fresh probiotic curd (Dahi)', '/images/products/amul-curd.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Ghee', 'amul-ghee', 'Pure cow ghee', '/images/products/amul-ghee.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Mother Dairy Milk', 'mother-dairy-milk', 'Fresh pasteurized milk', '/images/products/motherdairy-milk.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Nestle Fresh Cream', 'nestle-fresh-cream', 'Fresh dairy cream', '/images/products/nestle-cream.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Cheese Cubes', 'britannia-cheese-cubes', 'Processed cheese cubes', '/images/products/britannia-cheese.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Lassi', 'amul-lassi', 'Sweet mango lassi', '/images/products/amul-lassi.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Buttermilk', 'amul-buttermilk', 'Spiced buttermilk (Chaas)', '/images/products/amul-buttermilk.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Shrikhand', 'amul-shrikhand', 'Sweet Kesar shrikhand', '/images/products/amul-shrikhand.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Milky Mist Paneer', 'milky-mist-paneer', 'Premium fresh paneer', '/images/products/milkymist-paneer.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Go Cheese Spread', 'go-cheese-spread', 'Creamy cheese spread', '/images/products/go-cheesespread.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Amul Mozzarella', 'amul-mozzarella', 'Shredded mozzarella cheese', '/images/products/amul-mozzarella.png', c.id, true
FROM categories c WHERE c.slug = 'dairy-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia White Bread', 'britannia-white-bread', 'Soft white sandwich bread', '/images/products/britannia-whitebread.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Brown Bread', 'britannia-brown-bread', 'Healthy whole wheat bread', '/images/products/britannia-brownbread.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Harvest Gold Bread', 'harvest-gold-bread', 'Premium multigrain bread', '/images/products/harvestgold-bread.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Burger Buns', 'britannia-burger-buns', 'Soft burger buns pack', '/images/products/britannia-burgerbuns.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Bonn Pav', 'bonn-pav', 'Fresh pav for vada pav', '/images/products/bonn-pav.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Fruit Cake', 'britannia-fruit-cake', 'Rich fruit cake', '/images/products/britannia-fruitcake.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Rusk', 'britannia-rusk', 'Crunchy toasted rusk', '/images/products/britannia-rusk.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Parle Milk Rusk', 'parle-milk-rusk', 'Milk-flavored rusk', '/images/products/parle-rusk.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Muffins', 'britannia-muffins', 'Chocolate chip muffins', '/images/products/britannia-muffins.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'English Oven Croissant', 'english-oven-croissant', 'Butter croissants', '/images/products/englishoven-croissant.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Cake', 'britannia-cake', 'Vanilla sponge cake', '/images/products/britannia-cake.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Modern Bread', 'modern-bread', 'Classic white bread', '/images/products/modern-bread.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Pizza Base', 'britannia-pizza-base', 'Ready-to-use pizza base', '/images/products/britannia-pizzabase.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Sandwich Bread', 'britannia-sandwich-bread', 'Extra soft sandwich bread', '/images/products/britannia-sandwich.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Harvest Gold Garlic Bread', 'harvest-gold-garlic-bread', 'Garlic butter bread', '/images/products/harvestgold-garlic.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Hotdog Rolls', 'britannia-hotdog-rolls', 'Soft hotdog rolls', '/images/products/britannia-hotdog.png', c.id, true
FROM categories c WHERE c.slug = 'bakery' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicken Breast', 'chicken-breast', 'Boneless skinless chicken breast', '/images/products/chicken-breast.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicken Curry Cut', 'chicken-curry-cut', 'Fresh curry cut chicken pieces', '/images/products/chicken-currycut.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicken Drumsticks', 'chicken-drumsticks', 'Fresh chicken drumsticks', '/images/products/chicken-drumsticks.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicken Wings', 'chicken-wings', 'Fresh chicken wings', '/images/products/chicken-wings.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Mutton Curry Cut', 'mutton-curry-cut', 'Fresh goat meat curry cut', '/images/products/mutton-currycut.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Mutton Keema', 'mutton-keema', 'Fresh minced mutton', '/images/products/mutton-keema.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Rohu Fish', 'rohu-fish', 'Fresh Rohu fish steaks', '/images/products/rohu-fish.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pomfret', 'pomfret', 'Fresh silver pomfret', '/images/products/pomfret.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Prawns', 'prawns', 'Fresh medium prawns cleaned', '/images/products/prawns.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Surmai Fish', 'surmai-fish', 'Fresh King fish (Surmai)', '/images/products/surmai.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicken Mince', 'chicken-mince', 'Fresh minced chicken', '/images/products/chicken-mince.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lamb Chops', 'lamb-chops', 'Premium lamb chops', '/images/products/lamb-chops.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Catla Fish', 'catla-fish', 'Fresh Catla fish steaks', '/images/products/catla-fish.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Hilsa Fish', 'hilsa-fish', 'Fresh Hilsa fish', '/images/products/hilsa-fish.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Eggs', 'eggs', 'Farm fresh brown eggs', '/images/products/eggs.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Crab', 'crab', 'Fresh live crabs', '/images/products/crab.png', c.id, true
FROM categories c WHERE c.slug = 'meat-seafood' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'India Gate Basmati Rice', 'india-gate-basmati-rice', 'Premium aged basmati rice', '/images/products/indiagate-basmati.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Toor Dal', 'tata-sampann-toor-dal', 'Unpolished toor dal', '/images/products/tata-toordal.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Fortune Sunflower Oil', 'fortune-sunflower-oil', 'Refined sunflower oil', '/images/products/fortune-sunflower.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Aashirvaad Atta', 'aashirvaad-atta', 'Whole wheat flour', '/images/products/aashirvaad-atta.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Salt', 'tata-salt', 'Iodized table salt', '/images/products/tata-salt.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Chana Dal', 'tata-sampann-chana-dal', 'Premium chana dal', '/images/products/tata-chanadal.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Moong Dal', 'tata-sampann-moong-dal', 'Yellow moong dal', '/images/products/tata-moongdal.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Saffola Gold Oil', 'saffola-gold-oil', 'Blended edible oil', '/images/products/saffola-gold.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Masoor Dal', 'tata-sampann-masoor-dal', 'Red masoor dal', '/images/products/tata-masoordal.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'MDH Turmeric Powder', 'mdh-turmeric-powder', 'Pure haldi powder', '/images/products/mdh-turmeric.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'MDH Red Chilli Powder', 'mdh-red-chilli-powder', 'Kashmiri red chilli powder', '/images/products/mdh-redchilli.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'MDH Garam Masala', 'mdh-garam-masala', 'Aromatic garam masala', '/images/products/mdh-garammasala.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'MDH Coriander Powder', 'mdh-coriander-powder', 'Pure dhaniya powder', '/images/products/mdh-coriander.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Daawat Basmati Rice', 'daawat-basmati-rice', 'Long grain basmati rice', '/images/products/daawat-basmati.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Catch Cumin Seeds', 'catch-cumin-seeds', 'Whole jeera seeds', '/images/products/catch-cumin.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Catch Mustard Seeds', 'catch-mustard-seeds', 'Black mustard seeds', '/images/products/catch-mustard.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Rajdhani Besan', 'rajdhani-besan', 'Premium gram flour', '/images/products/rajdhani-besan.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Urad Dal', 'tata-sampann-urad-dal', 'Black urad dal', '/images/products/tata-uraddal.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Fortune Mustard Oil', 'fortune-mustard-oil', 'Kachi ghani mustard oil', '/images/products/fortune-mustard.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Sampann Rajma', 'tata-sampann-rajma', 'Kashmiri red kidney beans', '/images/products/tata-rajma.png', c.id, true
FROM categories c WHERE c.slug = 'pantry-staples' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Parle-G Biscuits', 'parle-g-biscuits', 'Classic glucose biscuits', '/images/products/parleg.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Good Day', 'britannia-good-day', 'Butter cookies', '/images/products/britannia-goodday.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Marie Gold', 'britannia-marie-gold', 'Light tea biscuits', '/images/products/britannia-mariegold.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lays Classic Salted', 'lays-classic-salted', 'Crispy potato chips', '/images/products/lays-classic.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Kurkure Masala Munch', 'kurkure-masala-munch', 'Crunchy masala snack', '/images/products/kurkure-masala.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Haldiram Bhujia', 'haldiram-bhujia', 'Classic besan sev', '/images/products/haldiram-bhujia.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Haldiram Aloo Bhujia', 'haldiram-aloo-bhujia', 'Potato sev snack', '/images/products/haldiram-aloobhujia.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Maggi 2-Minute Noodles', 'maggi-2-minute-noodles', 'Instant masala noodles', '/images/products/maggi-noodles.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia Bourbon', 'britannia-bourbon', 'Chocolate cream biscuits', '/images/products/britannia-bourbon.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Oreo Biscuits', 'oreo-biscuits', 'Chocolate sandwich cookies', '/images/products/oreo.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Haldiram Namkeen Mix', 'haldiram-namkeen-mix', 'Mixed Indian snacks', '/images/products/haldiram-namkeen.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Bingo Mad Angles', 'bingo-mad-angles', 'Tangy tomato chips', '/images/products/bingo-madangles.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Sunfeast Dark Fantasy', 'sunfeast-dark-fantasy', 'Chocolate filled cookies', '/images/products/sunfeast-darkfantasy.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Parle Monaco', 'parle-monaco', 'Salted crackers', '/images/products/parle-monaco.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Britannia 50-50', 'britannia-50-50', 'Sweet and salty crackers', '/images/products/britannia-5050.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Haldiram Moong Dal', 'haldiram-moong-dal', 'Crispy moong dal snack', '/images/products/haldiram-moongdal.png', c.id, true
FROM categories c WHERE c.slug = 'snacks-biscuits' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'McCain French Fries', 'mccain-french-fries', 'Crispy frozen french fries', '/images/products/mccain-fries.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Safal Frozen Peas', 'safal-frozen-peas', 'Green peas IQF', '/images/products/safal-peas.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Safal Mixed Vegetables', 'safal-mixed-vegetables', 'Frozen mixed vegetables', '/images/products/safal-mixveg.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Godrej Chicken Nuggets', 'godrej-chicken-nuggets', 'Crispy chicken nuggets', '/images/products/godrej-nuggets.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'ITC Master Chef Parathas', 'itc-master-chef-parathas', 'Ready to cook parathas', '/images/products/itc-parathas.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Safal Frozen Corn', 'safal-frozen-corn', 'Sweet corn kernels', '/images/products/safal-corn.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'McCain Smiles', 'mccain-smiles', 'Fun shaped potato snacks', '/images/products/mccain-smiles.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Godrej Chicken Seekh Kebab', 'godrej-chicken-seekh-kebab', 'Frozen seekh kebabs', '/images/products/godrej-seekh.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'ITC Aloo Tikki', 'itc-aloo-tikki', 'Frozen potato tikkis', '/images/products/itc-alootikki.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Safal Frozen Paneer', 'safal-frozen-paneer', 'Premium frozen paneer cubes', '/images/products/safal-paneer.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Godrej Chicken Sausages', 'godrej-chicken-sausages', 'Chicken breakfast sausages', '/images/products/godrej-sausages.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'ITC Veg Samosa', 'itc-veg-samosa', 'Frozen vegetable samosas', '/images/products/itc-samosa.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'McCain Veggie Fingers', 'mccain-veggie-fingers', 'Vegetable fingers', '/images/products/mccain-veggies.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Safal Frozen Spinach', 'safal-frozen-spinach', 'Chopped frozen spinach', '/images/products/safal-spinach.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'ITC Chicken Momos', 'itc-chicken-momos', 'Frozen chicken momos', '/images/products/itc-momos.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Godrej Fish Fingers', 'godrej-fish-fingers', 'Crispy fish fingers', '/images/products/godrej-fishfingers.png', c.id, true
FROM categories c WHERE c.slug = 'frozen-foods' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Dove Soap', 'dove-soap', 'Moisturizing beauty bar', '/images/products/dove-soap.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Colgate MaxFresh', 'colgate-maxfresh', 'Cooling mint toothpaste', '/images/products/colgate-maxfresh.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Head & Shoulders Shampoo', 'head-and-shoulders-shampoo', 'Anti-dandruff shampoo', '/images/products/headshoulders.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Dettol Handwash', 'dettol-handwash', 'Antibacterial liquid handwash', '/images/products/dettol-handwash.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Nivea Body Lotion', 'nivea-body-lotion', 'Deep moisture body lotion', '/images/products/nivea-lotion.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Gillette Mach3 Razor', 'gillette-mach3-razor', 'Triple blade razor', '/images/products/gillette-mach3.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pantene Shampoo', 'pantene-shampoo', 'Hair fall control shampoo', '/images/products/pantene-shampoo.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lifebuoy Soap', 'lifebuoy-soap', 'Germ protection soap', '/images/products/lifebuoy-soap.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pepsodent Toothpaste', 'pepsodent-toothpaste', 'Germicheck toothpaste', '/images/products/pepsodent.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Himalaya Face Wash', 'himalaya-face-wash', 'Purifying neem face wash', '/images/products/himalaya-facewash.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Vaseline Body Lotion', 'vaseline-body-lotion', 'Intensive care lotion', '/images/products/vaseline-lotion.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lux Soap', 'lux-soap', 'Fragrant beauty soap', '/images/products/lux-soap.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Park Avenue Deo', 'park-avenue-deo', 'Men deodorant spray', '/images/products/parkavenue-deo.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Whisper Pads', 'whisper-pads', 'Ultra clean sanitary pads', '/images/products/whisper-pads.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Parachute Coconut Oil', 'parachute-coconut-oil', 'Pure coconut hair oil', '/images/products/parachute-oil.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Oral-B Toothbrush', 'oral-b-toothbrush', 'Soft bristle toothbrush', '/images/products/oralb-brush.png', c.id, true
FROM categories c WHERE c.slug = 'personal-care' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Surf Excel Detergent', 'surf-excel-detergent', 'Stain remover powder', '/images/products/surfexcel.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Vim Dishwash Gel', 'vim-dishwash-gel', 'Lemon fresh dishwash gel', '/images/products/vim-gel.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Harpic Toilet Cleaner', 'harpic-toilet-cleaner', 'Power plus toilet cleaner', '/images/products/harpic.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lizol Floor Cleaner', 'lizol-floor-cleaner', 'Disinfectant surface cleaner', '/images/products/lizol.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Colin Glass Cleaner', 'colin-glass-cleaner', 'Streak-free glass cleaner', '/images/products/colin.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Ariel Detergent', 'ariel-detergent', 'Matic washing powder', '/images/products/ariel.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Scotch-Brite Scrub', 'scotch-brite-scrub', 'Heavy duty scrub pad', '/images/products/scotchbrite.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Good Knight Liquid', 'good-knight-liquid', 'Mosquito repellent refill', '/images/products/goodknight.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Odonil Air Freshener', 'odonil-air-freshener', 'Room freshener blocks', '/images/products/odonil.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pril Dishwash Liquid', 'pril-dishwash-liquid', 'Lime dishwash liquid', '/images/products/pril.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Comfort Fabric Softener', 'comfort-fabric-softener', 'After wash fabric conditioner', '/images/products/comfort.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Hit Cockroach Spray', 'hit-cockroach-spray', 'Instant pest killer', '/images/products/hit-spray.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Domex Toilet Cleaner', 'domex-toilet-cleaner', 'Thick toilet cleaner', '/images/products/domex.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Exo Dishwash Bar', 'exo-dishwash-bar', 'Anti-bacterial dish bar', '/images/products/exo-bar.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Rin Detergent Bar', 'rin-detergent-bar', 'Brightening detergent bar', '/images/products/rin-bar.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Mortein Coil', 'mortein-coil', 'Mosquito repellent coils', '/images/products/mortein-coil.png', c.id, true
FROM categories c WHERE c.slug = 'household-items' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pampers Diapers', 'pampers-diapers', 'Active baby dry diapers', '/images/products/pampers.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Johnson Baby Powder', 'johnson-baby-powder', 'Gentle baby talcum powder', '/images/products/johnson-powder.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Johnson Baby Shampoo', 'johnson-baby-shampoo', 'No more tears shampoo', '/images/products/johnson-shampoo.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Huggies Diapers', 'huggies-diapers', 'Wonder pants diapers', '/images/products/huggies.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Cerelac Baby Food', 'cerelac-baby-food', 'Wheat apple cerelac', '/images/products/cerelac.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Johnson Baby Oil', 'johnson-baby-oil', 'Moisturizing baby oil', '/images/products/johnson-oil.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Himalaya Baby Lotion', 'himalaya-baby-lotion', 'Gentle baby body lotion', '/images/products/himalaya-babylotion.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'MamyPoko Pants', 'mamypoko-pants', 'Extra absorb diapers', '/images/products/mamypoko.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Himalaya Baby Cream', 'himalaya-baby-cream', 'Nourishing baby cream', '/images/products/himalaya-babycream.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Johnson Baby Soap', 'johnson-baby-soap', 'Gentle baby soap bar', '/images/products/johnson-soap.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pigeon Feeding Bottle', 'pigeon-feeding-bottle', 'Anti-colic feeding bottle', '/images/products/pigeon-bottle.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Himalaya Baby Wipes', 'himalaya-baby-wipes', 'Gentle cleaning wipes', '/images/products/himalaya-wipes.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Johnson Baby Bath', 'johnson-baby-bath', 'Gentle baby body wash', '/images/products/johnson-bath.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Sebamed Baby Wash', 'sebamed-baby-wash', 'Extra mild baby wash', '/images/products/sebamed-wash.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Chicco Pacifier', 'chicco-pacifier', 'Orthodontic baby pacifier', '/images/products/chicco-pacifier.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Lactogen Baby Formula', 'lactogen-baby-formula', 'Infant milk formula', '/images/products/lactogen.png', c.id, true
FROM categories c WHERE c.slug = 'baby-products' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Revital Multivitamin', 'revital-multivitamin', 'Daily multivitamin capsules', '/images/products/revital.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Dabur Chyawanprash', 'dabur-chyawanprash', 'Immunity boosting chyawanprash', '/images/products/dabur-chyawanprash.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Horlicks Health Drink', 'horlicks-health-drink', 'Classic malt health drink', '/images/products/horlicks.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Bournvita Health Drink', 'bournvita-health-drink', 'Chocolate health drink', '/images/products/bournvita.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Dabur Honey', 'dabur-honey', 'Pure natural honey', '/images/products/dabur-honey.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Complan Health Drink', 'complan-health-drink', 'Complete planned food', '/images/products/complan.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Ensure Health Drink', 'ensure-health-drink', 'Complete balanced nutrition', '/images/products/ensure.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Protinex Health Drink', 'protinex-health-drink', 'High protein supplement', '/images/products/protinex.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Crocin Pain Relief', 'crocin-pain-relief', 'Pain and fever tablets', '/images/products/crocin.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Hajmola Digestive', 'hajmola-digestive', 'Digestive tablets', '/images/products/hajmola.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Eno Antacid', 'eno-antacid', 'Fast relief antacid powder', '/images/products/eno.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Vicks Vaporub', 'vicks-vaporub', 'Cold relief ointment', '/images/products/vicks.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Dabur Glucose', 'dabur-glucose', 'Instant energy glucose powder', '/images/products/dabur-glucose.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Zandu Balm', 'zandu-balm', 'Pain relief balm', '/images/products/zandu-balm.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Celin Vitamin C', 'celin-vitamin-c', 'Chewable vitamin C tablets', '/images/products/celin.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Supradyn Multivitamin', 'supradyn-multivitamin', 'Daily energy vitamins', '/images/products/supradyn.png', c.id, true
FROM categories c WHERE c.slug = 'health-wellness' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Coca-Cola', 'coca-cola', 'Classic cola soft drink', '/images/products/cocacola.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Pepsi', 'pepsi', 'Refreshing cola drink', '/images/products/pepsi.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Sprite', 'sprite', 'Lemon-lime sparkling drink', '/images/products/sprite.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Thums Up', 'thums-up', 'Strong cola drink', '/images/products/thumsup.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Limca', 'limca', 'Lime and lemon drink', '/images/products/limca.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Fanta Orange', 'fanta-orange', 'Orange flavored drink', '/images/products/fanta.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Real Fruit Juice', 'real-fruit-juice', 'Mixed fruit juice', '/images/products/real-juice.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tropicana Orange Juice', 'tropicana-orange-juice', '100% orange juice', '/images/products/tropicana.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Tata Tea Premium', 'tata-tea-premium', 'Premium tea leaves', '/images/products/tata-tea.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Nescafe Classic Coffee', 'nescafe-classic-coffee', 'Instant coffee powder', '/images/products/nescafe.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Bru Instant Coffee', 'bru-instant-coffee', 'Premium instant coffee', '/images/products/bru.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Red Bull Energy Drink', 'red-bull-energy-drink', 'Energy boosting drink', '/images/products/redbull.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Maaza Mango Drink', 'maaza-mango-drink', 'Mango fruit drink', '/images/products/maaza.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Paper Boat Aam Panna', 'paper-boat-aam-panna', 'Traditional aam panna drink', '/images/products/paperboat-aampanna.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Frooti Mango Drink', 'frooti-mango-drink', 'Fresh mango juice', '/images/products/frooti.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, image_url, category_id, is_active)
SELECT 'Kinley Mineral Water', 'kinley-mineral-water', 'Purified drinking water', '/images/products/kinley.png', c.id, true
FROM categories c WHERE c.slug = 'beverages' ON CONFLICT (slug) DO NOTHING;
