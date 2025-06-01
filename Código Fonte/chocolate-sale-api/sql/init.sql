-- sql/init.sql

-- Drop tables if they exist (for easy re-initialization during development)
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS sellers;

-- Create Tables
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255)
);

CREATE TABLE sellers (
    seller_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE sales_orders (
    order_id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(client_id),
    seller_id INTEGER REFERENCES sellers(seller_id),
    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled'))
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES sales_orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL -- Store price at time of sale
);

CREATE TABLE stock_movements (
    movement_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    quantity_change INTEGER NOT NULL, -- Positive for additions, negative for removals
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('initial_stock', 'sale', 'cancellation_restock', 'manual_adjustment_add', 'manual_adjustment_remove', 'restock')),
    movement_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    order_id INTEGER REFERENCES sales_orders(order_id) NULL, -- Link to sale if applicable
    notes TEXT
);

-- Initial Data Seeding

-- Sellers
INSERT INTO sellers (name) VALUES
('Vendedor Alice'),
('Vendedor Roberto');

-- Clients
INSERT INTO clients (name, contact_info) VALUES
('Cliente Carlos Silva', 'carlos.silva@email.com'),
('Cliente Ana Pereira', 'ana.p@email.com'),
('Cliente Maria Oliveira', 'maria.o@email.com'),
('Cliente João Souza', 'joao.souza@email.com'),
('Cliente Beatriz Santos', 'bia.santos@email.com');

-- Products (Initial stock will be set via stock_movements)
INSERT INTO products (name, description, price, current_stock) VALUES
('Barra Chocolate Ao Leite 100g', 'Clássica barra de chocolate ao leite', 5.00, 0),
('Barra Chocolate Amargo 70% 100g', 'Chocolate amargo com 70% cacau', 7.50, 0),
('Caixa de Bombons Sortidos 12un', 'Seleção de bombons artesanais', 25.00, 0),
('Trufa de Maracujá Unidade', 'Trufa recheada com ganache de maracujá', 3.00, 0),
('Trufa de Brigadeiro Unidade', 'Trufa recheada com brigadeiro cremoso', 3.00, 0),
('Chocolate Branco com Cookies 90g', 'Delicioso chocolate branco com pedaços de cookies', 6.50, 0),
('Ovo de Páscoa Ao Leite 250g', 'Ovo de Páscoa tradicional ao leite (sazonal)', 35.00, 0),
('Kit Degustação Mini Barras 5 Sabores', 'Mini barras para experimentar diferentes sabores', 18.00, 0),
('Chocolate Quente em Pó 200g', 'Mistura para preparo de chocolate quente cremoso', 12.00, 0),
('Dragées de Chocolate Amargo com Amêndoas 150g', 'Amêndoas cobertas com chocolate amargo', 15.00, 0);

-- Initial Stock Movements & Update products.current_stock
-- Note: This is a simplified way. A trigger or application logic would be more robust for current_stock.
-- For this setup, we'll update products.current_stock directly after inserts for simplicity of seeding.

-- Barra Chocolate Ao Leite 100g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 50, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Barra Chocolate Ao Leite 100g';
UPDATE products SET current_stock = current_stock + 50 WHERE name = 'Barra Chocolate Ao Leite 100g';

-- Barra Chocolate Amargo 70% 100g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 30, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Barra Chocolate Amargo 70% 100g';
UPDATE products SET current_stock = current_stock + 30 WHERE name = 'Barra Chocolate Amargo 70% 100g';

-- Caixa de Bombons Sortidos 12un
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 20, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Caixa de Bombons Sortidos 12un';
UPDATE products SET current_stock = current_stock + 20 WHERE name = 'Caixa de Bombons Sortidos 12un';

-- Trufa de Maracujá Unidade
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 100, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Trufa de Maracujá Unidade';
UPDATE products SET current_stock = current_stock + 100 WHERE name = 'Trufa de Maracujá Unidade';

-- Trufa de Brigadeiro Unidade
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 100, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Trufa de Brigadeiro Unidade';
UPDATE products SET current_stock = current_stock + 100 WHERE name = 'Trufa de Brigadeiro Unidade';

-- Chocolate Branco com Cookies 90g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 40, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Chocolate Branco com Cookies 90g';
UPDATE products SET current_stock = current_stock + 40 WHERE name = 'Chocolate Branco com Cookies 90g';

-- Ovo de Páscoa Ao Leite 250g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 15, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Ovo de Páscoa Ao Leite 250g';
UPDATE products SET current_stock = current_stock + 15 WHERE name = 'Ovo de Páscoa Ao Leite 250g';

-- Kit Degustação Mini Barras 5 Sabores
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 25, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Kit Degustação Mini Barras 5 Sabores';
UPDATE products SET current_stock = current_stock + 25 WHERE name = 'Kit Degustação Mini Barras 5 Sabores';

-- Chocolate Quente em Pó 200g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 30, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Chocolate Quente em Pó 200g';
UPDATE products SET current_stock = current_stock + 30 WHERE name = 'Chocolate Quente em Pó 200g';

-- Dragées de Chocolate Amargo com Amêndoas 150g
INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes)
SELECT product_id, 20, 'initial_stock', 'Carga inicial' FROM products WHERE name = 'Dragées de Chocolate Amargo com Amêndoas 150g';
UPDATE products SET current_stock = current_stock + 20 WHERE name = 'Dragées de Chocolate Amargo com Amêndoas 150g';

-- Verify
SELECT * FROM clients;
SELECT * FROM sellers;
SELECT * FROM products;
SELECT * FROM stock_movements;