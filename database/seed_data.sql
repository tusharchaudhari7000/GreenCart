-- GreenCart Sample Data Seed Script

USE greencartdb;

-- 1. Insert Security Questions
INSERT INTO security_questions (question_id, question) VALUES
(1, 'What is your favorite color?'),
(2, 'What is your pet''s name?'),
(3, 'What is your mother''s maiden name?'),
(4, 'What city were you born in?')
ON DUPLICATE KEY UPDATE question=VALUES(question);

-- 2. Insert Default Test Users (Password for all is: password123)
-- BCrypt hash for "password123": $2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.
-- UserStatus: 1 = ACTIVE, 2 = PENDING
INSERT INTO users (user_id, username, password, first_name, last_name, email, phone, role_id, status, question_id, answer, aadhaar_no, created_at) VALUES
(1, 'adminuser', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'System', 'Admin', 'admin@greencart.com', '9876543210', 1, 1, 1, 'Blue', '123456789012', NOW()),
(2, 'buyeruser', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'John', 'Buyer', 'buyer@greencart.com', '9876543211', 3, 1, 1, 'Blue', '123456789013', NOW()),
(3, 'farmeruser', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'Ramesh', 'Farmer', 'farmer@greencart.com', '9876543212', 2, 1, 1, 'Blue', '123456789014', NOW())
ON DUPLICATE KEY UPDATE username=VALUES(username), password=VALUES(password), status=VALUES(status);

-- 3. Insert Categories
INSERT INTO categories (category_id, category_name, status) VALUES
(1, 'Vegetables', 'ACTIVE'),
(2, 'Fruits', 'ACTIVE'),
(3, 'Grains', 'ACTIVE'),
(4, 'Dairy', 'ACTIVE')
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name), status=VALUES(status);

-- 4. Insert Sub-Categories
INSERT INTO sub_categories (sub_category_id, category_id, sub_category_name, status) VALUES
(1, 1, 'Tomato', 'ACTIVE'),
(2, 1, 'Potato', 'ACTIVE'),
(3, 1, 'Carrot', 'ACTIVE'),
(4, 2, 'Apple', 'ACTIVE'),
(5, 2, 'Banana', 'ACTIVE'),
(6, 4, 'Organic Milk', 'ACTIVE'),
(7, 2, 'Grapes', 'ACTIVE'),
(8, 2, 'Mango', 'ACTIVE'),
(9, 2, 'Orange', 'ACTIVE'),
(10, 2, 'Papaya', 'ACTIVE'),
(11, 2, 'Watermelon', 'ACTIVE'),
(12, 1, 'Onion', 'ACTIVE'),
(13, 1, 'Garlic', 'ACTIVE'),
(14, 1, 'Spinach', 'ACTIVE'),
(15, 1, 'Cucumber', 'ACTIVE'),
(16, 3, 'Rice', 'ACTIVE'),
(17, 3, 'Wheat', 'ACTIVE'),
(18, 4, 'Paneer', 'ACTIVE'),
(19, 4, 'Butter', 'ACTIVE')
ON DUPLICATE KEY UPDATE sub_category_name=VALUES(sub_category_name), status=VALUES(status);

-- 5. Insert Products
INSERT INTO products (pid, pname, description, sub_category_id) VALUES
(1, 'Fresh Red Tomatoes', 'Organic farm fresh red juicy tomatoes, harvested daily.', 1),
(2, 'Organic Potatoes', 'Naturally grown farm potatoes, ideal for cooking and baking.', 2),
(3, 'Crunchy Carrots', 'Rich in vitamin A, fresh and crunchy red carrots.', 3),
(4, 'Himachali Royal Apples', 'Crisp and sweet fresh apples sourced directly from Himachal orchards.', 4),
(5, 'Pure Farm Cow Milk', 'Fresh unadulterated cow milk delivered straight from dairy farmers.', 6)
ON DUPLICATE KEY UPDATE pname=VALUES(pname), description=VALUES(description);

-- 6. Insert Products Stock with Image URLs
INSERT INTO products_stock (stock_id, product_id, seller_id, price, quantity, image_path, created_at) VALUES
(1, 1, 3, 40.0, 100, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80', NOW()),
(2, 2, 3, 30.0, 150, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', NOW()),
(3, 3, 3, 50.0, 80, 'https://images.unsplash.com/photo-1598170845058-12f6a67367c3?w=500&q=80', NOW()),
(4, 4, 3, 120.0, 60, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80', NOW()),
(5, 5, 3, 65.0, 40, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', NOW())
ON DUPLICATE KEY UPDATE price=VALUES(price), quantity=VALUES(quantity), image_path=VALUES(image_path);
