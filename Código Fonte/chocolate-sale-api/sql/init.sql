-- sql/init.sql

-- Drop tables if they exist (for easy re-initialization during development)
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS sales_orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;

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

DO $$
DECLARE
    p_id INT;
    initial_qty INT;
BEGIN
    -- Barra Chocolate Ao Leite 100g
    SELECT product_id INTO p_id FROM products WHERE name = 'Barra Chocolate Ao Leite 100g';
    initial_qty := 50;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Barra Chocolate Amargo 70% 100g
    SELECT product_id INTO p_id FROM products WHERE name = 'Barra Chocolate Amargo 70% 100g';
    initial_qty := 30;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Caixa de Bombons Sortidos 12un
    SELECT product_id INTO p_id FROM products WHERE name = 'Caixa de Bombons Sortidos 12un';
    initial_qty := 20;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Trufa de Maracujá Unidade
    SELECT product_id INTO p_id FROM products WHERE name = 'Trufa de Maracujá Unidade';
    initial_qty := 100;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Trufa de Brigadeiro Unidade
    SELECT product_id INTO p_id FROM products WHERE name = 'Trufa de Brigadeiro Unidade';
    initial_qty := 100;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Chocolate Branco com Cookies 90g
    SELECT product_id INTO p_id FROM products WHERE name = 'Chocolate Branco com Cookies 90g';
    initial_qty := 40;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Ovo de Páscoa Ao Leite 250g
    SELECT product_id INTO p_id FROM products WHERE name = 'Ovo de Páscoa Ao Leite 250g';
    initial_qty := 15;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Kit Degustação Mini Barras 5 Sabores
    SELECT product_id INTO p_id FROM products WHERE name = 'Kit Degustação Mini Barras 5 Sabores';
    initial_qty := 25;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Chocolate Quente em Pó 200g
    SELECT product_id INTO p_id FROM products WHERE name = 'Chocolate Quente em Pó 200g';
    initial_qty := 30;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;

    -- Dragées de Chocolate Amargo com Amêndoas 150g
    SELECT product_id INTO p_id FROM products WHERE name = 'Dragées de Chocolate Amargo com Amêndoas 150g';
    initial_qty := 20;
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, notes) VALUES (p_id, initial_qty, 'initial_stock', 'Carga inicial');
    UPDATE products SET current_stock = current_stock + initial_qty WHERE product_id = p_id;
END $$;

-- Verify
SELECT * FROM clients;
SELECT * FROM sellers;
SELECT * FROM products;
SELECT * FROM stock_movements;