# Sistema de Gerenciamento de Chocolataria 🍫

## 📝 Descrição
Sistema distribuído para gerenciamento de uma loja de chocolates, desenvolvido com Node.js, PostgreSQL e Docker. O sistema oferece funcionalidades completas para gestão de clientes, produtos, pedidos e relatórios.

## 📁 Estrutura do Projeto
```
chocolate-app/
├── controllers/                 # Controladores da aplicação
│   ├── ClienteController.js    # Gerencia operações de clientes
│   ├── PedidoController.js     # Gerencia operações de pedidos
│   ├── ProdutoController.js    # Gerencia operações de produtos
│   ├── RelatorioController.js  # Gerencia geração de relatórios
│   └── VendedorController.js   # Gerencia operações de vendedores
│
├── daos/                       # Camada de acesso a dados
│   ├── ClienteDAO.js          # Acesso aos dados de clientes
│   ├── PedidoDAO.js           # Acesso aos dados de pedidos
│   ├── ProdutoDAO.js          # Acesso aos dados de produtos
│   ├── RelatorioDAO.js        # Acesso aos dados de relatórios
│   └── VendedorDAO.js         # Acesso aos dados de vendedores
│
├── models/                     # Modelos de dados
│   ├── Cliente.js             # Modelo de cliente
│   ├── Pedido.js             # Modelo de pedido
│   ├── Produto.js            # Modelo de produto
│   └── Vendedor.js           # Modelo de vendedor
│
├── routes/                    # Rotas da API
│   ├── clienteRoutes.js      # Rotas para clientes
│   ├── pedidoRoutes.js       # Rotas para pedidos
│   ├── produtoRoutes.js      # Rotas para produtos
│   ├── relatorioRoutes.js    # Rotas para relatórios
│   └── vendedorRoutes.js     # Rotas para vendedores
│
├── relatorios/               # Microsserviço de relatórios
│   ├── controllers/         
│   ├── routes/             
│   ├── index.js            
│   ├── db.js              
│   ├── Dockerfile          
│   └── package.json        
│
├── seeders/                 # Scripts de população do banco
│   └── seed.sql            # Dados iniciais do banco
│
├── .env                     # Variáveis de ambiente
├── db.js                   # Configuração do banco de dados
├── Dockerfile              # Configuração do container principal
├── docker-compose.yml      # Configuração dos serviços Docker
├── Index.js               # Ponto de entrada da aplicação
└── package.json           # Dependências do projeto
```

## 🚀 Funcionalidades

### 👥 Gerenciamento de Clientes
- CRUD completo de clientes
- Histórico de compras
- Cálculo de valor gasto

### 🍫 Gerenciamento de Produtos
- CRUD completo de produtos
- Controle de estoque
- Status de disponibilidade

### 📦 Gerenciamento de Pedidos
- Criação e acompanhamento de pedidos
- Atualização automática de estoque
- Cálculo de valores

### 📊 Relatórios
- Top 5 produtos mais vendidos
- Histórico de compras por cliente
- Média de gastos por cliente
- Alertas de estoque baixo

## 🛠️ Tecnologias Utilizadas

- Node.js
- PostgreSQL
- Docker
- Express.js

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- Docker Desktop
- Node.js
- PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositório]
cd chocolate-app
```

2. Configure o arquivo `.env`:
```env
NODE_ENV=development
APP_PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=chocolate_db
DB_USER=postgres
DB_PASSWORD=senha123
```

3. Inicie os containers:
```bash
docker-compose up -d
```

## 📡 Endpoints da API

### Clientes
```
GET    /clientes
GET    /clientes/:id
POST   /clientes
PUT    /clientes/:id
DELETE /clientes/:id
```

### Produtos
```
GET    /produtos
GET    /produtos/:id
POST   /produtos
PUT    /produtos/:id
DELETE /produtos/:id
```

### Pedidos
```
GET    /pedidos
GET    /pedidos/:id
POST   /pedidos
PUT    /pedidos/:id
DELETE /pedidos/:id
```

### Relatórios
```
GET /relatorios/mais_vendido
GET /relatorios/cliente/total/:id
GET /relatorios/cliente/media/:id
GET /relatorios/produto_estoque_baixo
```

## 🐳 Serviços Docker

### Configuração
- **API Principal**: Porta 3000
- **Banco de Dados**: Porta 5432
- **Serviço de Relatórios**: Porta 3001

### Rede
- Subnet: 172.23.0.0/24
- Driver: bridge

## 📝 Licença

ISC

## 👥 Autores

[André Vinícius Souza, Nayara Lorena, Victor Sobral, Wendel Alves]

