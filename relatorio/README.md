# Sistema de Gerenciamento de Chocolateria

Sistema distribuído para gerenciamento de clientes, vendedores, produtos, pedidos e relatórios em uma chocolateria, utilizando Node.js, PostgreSQL e Docker.

## Arquitetura do Sistema

### Microserviços
- **API Principal**: Operações CRUD (porta 3000)
- **Serviço de Relatórios**: Geração de relatórios (porta 3001)
- **Banco de Dados**: PostgreSQL (porta 5432)

### Estrutura de Diretórios
```
chocolate-app/
├── controllers/        # Controladores da aplicação
├── daos/              # Camada de acesso a dados
├── models/            # Modelos de dados
├── routes/            # Rotas da API
├── relatorios/        # Microserviço de relatórios
└── seeders/           # Scripts de população do banco
```

## Dados Iniciais do Sistema

### Vendedores Cadastrados
1. Maria Silva
   - Email: maria@chocolateria.com
   - Telefone: 71999887766

2. João Santos
   - Email: joao@chocolateria.com
   - Telefone: 71999887755

### Clientes Cadastrados
1. Ana Costa
2. Bruno Medeiros
3. Carla Souza
4. Daniel Lima
5. Elena Santos

### Produtos Disponíveis
1. Trufa de Chocolate Belga (R$ 8,90)
2. Barra de Chocolate 70% Cacau (R$ 15,90)
3. Bombom Recheado Cereja (R$ 3,50)
4. Chocolate ao Leite Premium (R$ 12,90)
5. Chocolate Branco com Nuts (R$ 11,90)
6. Chocolate Amargo Zero Açúcar (R$ 18,90)
7. Kit Bombons Sortidos (R$ 29,90)
8. Barra Chocolate com Morango (R$ 13,90)
9. Chocolate em Pó 50% Cacau (R$ 19,90)
10. Chocolate Crocante (R$ 10,90)

## APIs Disponíveis

### API Principal (porta 3000)

#### Clientes
- `GET /clientes`: Lista todos os clientes
- `GET /clientes/:id`: Busca cliente específico
- `POST /clientes`: Cria novo cliente
- `PUT /clientes/:id`: Atualiza cliente
- `DELETE /clientes/:id`: Remove cliente

#### Produtos
- `GET /produtos`: Lista todos os produtos
- `GET /produtos/:id`: Busca produto específico
- `POST /produtos`: Cadastra novo produto
- `PUT /produtos/:id`: Atualiza produto
- `DELETE /produtos/:id`: Remove produto

#### Vendedores
- `GET /vendedor`: Lista todos os vendedores
- `GET /vendedor/:matricula`: Busca vendedor específico
- `POST /vendedor`: Cadastra novo vendedor
- `PUT /vendedor/:matricula`: Atualiza vendedor
- `DELETE /vendedor/:matricula`: Remove vendedor

### Serviço de Relatórios (porta 3001)
- `GET /relatorios/mais_vendido`: Top 5 produtos mais vendidos
- `GET /relatorios/cliente/total/:id`: Total de compras por cliente
- `GET /relatorios/cliente/media/:id`: Média de gastos por cliente
- `GET /relatorios/produto_estoque_baixo`: Produtos com estoque baixo

## Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js
- PostgreSQL

### Comandos
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta
cd chocolate-app

# Inicie os containers
docker-compose up -d

# Execute o seed do banco
docker cp seed.sql postgres-db:/docker-entrypoint-initdb.d/seed.sql
docker exec postgres-db psql -U postgres chocolate_db -f /docker-entrypoint-initdb.d/seed.sql
```

## Configuração do Banco

### Conexão
```
Host: localhost
Port: 5432
Database: chocolate_db
User: postgres
Password: senha123
```

## Testes via Postman

### Exemplo de Criação de Cliente
```http
POST http://localhost:3000/clientes
Content-Type: application/json

{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "endereco": "Rua Exemplo, 123",
    "cpf": "12345678900"
}
```

## Variáveis de Ambiente
Arquivo `.env` necessário na raiz do projeto:
```env
NODE_ENV=development
APP_PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=chocolate_db
DB_USER=postgres
DB_PASSWORD=senha123
```