-- Criando tabelas
CREATE TABLE IF NOT EXISTS vendedores (
    matricula SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    peso INTEGER NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER NOT NULL,
    disponivel_venda BOOLEAN DEFAULT TRUE
);

-- Inserindo Vendedores
INSERT INTO vendedores (nome, email, telefone, endereco, cpf) VALUES
('Maria Silva', 'maria@chocolateria.com', '71999887766', 'Rua das Flores, 123', '12345678901'),
('Joao Santos', 'joao@chocolateria.com', '71999887755', 'Av das Palmeiras, 456', '98765432101');

-- Inserindo Clientes
INSERT INTO clientes (nome, email, telefone, endereco, cpf) VALUES
('Ana Costa', 'ana@email.com', '71988776655', 'Rua A, 100', '11122233344'),
('Bruno Medeiros', 'bruno@email.com', '71988776644', 'Rua B, 200', '22233344455'),
('Carla Souza', 'carla@email.com', '71988776633', 'Rua C, 300', '33344455566'),
('Daniel Lima', 'daniel@email.com', '71988776622', 'Rua D, 400', '44455566677'),
('Elena Santos', 'elena@email.com', '71988776611', 'Rua E, 500', '55566677788');

-- Inserindo Produtos
INSERT INTO produto (nome, marca, peso, preco, estoque, disponivel_venda) VALUES
('Trufa de Chocolate Belga', 'Chocolateria Fina', 30, 8.90, 100, true),
('Barra de Chocolate 70% Cacau', 'Cacau Select', 100, 15.90, 80, true),
('Bombom Recheado Cereja', 'Sweet Dreams', 20, 3.50, 150, true),
('Chocolate ao Leite Premium', 'Gold Chocolate', 90, 12.90, 120, true),
('Chocolate Branco com Nuts', 'Choco Paradise', 85, 11.90, 90, true),
('Chocolate Amargo Zero Acucar', 'Healthy Choco', 80, 18.90, 60, true),
('Kit Bombons Sortidos', 'Delicia Chocolate', 200, 29.90, 40, true),
('Barra Chocolate com Morango', 'Fruit & Choco', 100, 13.90, 70, true),
('Chocolate em Po 50% Cacau', 'Cacau Master', 200, 19.90, 100, true),
('Chocolate Crocante', 'Crunchy Love', 90, 10.90, 110, true);