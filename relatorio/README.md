
#  Sistema de Gerenciamento de Chocolateria

Sistema distribuído para gerenciamento de clientes, vendedores, produtos, pedidos e relatórios em uma chocolateria, com arquitetura baseada em microserviços, utilizando Node.js, PostgreSQL e Docker.

---

# Arquitetura do Sistema

# Microserviços

- **API Principal**: Responsável por operações CRUD (porta `3000`)
- **Serviço de Relatórios**: Geração de relatórios personalizados (porta `3001`)
- **Banco de Dados**: PostgreSQL (porta `5432`)

# Estrutura de Diretórios

```
chocolate-app/
├── controllers/        # Controladores da aplicação
├── daos/               # Camada de acesso a dados
├── models/             # Modelos de dados
├── routes/             # Rotas da API
├── relatorios/         # Microserviço de relatórios
└── docker/             # Configurações Docker
```

---

# Componentes

# Models

- `Cliente.js`
- `Produto.js`
- `Vendedor.js`
- `Pedido.js`

# Controllers

- `ClienteController.js`
- `ProdutoController.js`
- `VendedorController.js`
- `PedidoController.js`
- `RelatorioController.js`

# DAOs

- `ClienteDAO.js`
- `ProdutoDAO.js`
- `VendedorDAO.js`
- `PedidoDAO.js`

---

# APIs

# API Principal (porta 3000)

# Clientes

- `GET /clientes`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`

# Produtos

- `GET /produtos`
- `POST /produtos`
- `PUT /produtos/:id`
- `DELETE /produtos/:id`

# Vendedores

- `GET /vendedor`
- `POST /vendedor`
- `PUT /vendedor/:id`
- `DELETE /vendedor/:id`

---

# Serviço de Relatórios (porta 3001)

- `GET /relatorios/mais_vendido`  
- `GET /relatorios/cliente/total/:id`  
- `GET /relatorios/cliente/media/:id`  
- `GET /relatorios/produto_estoque_baixo`

---

# 🐳 Docker

# Containers e Portas

- API Principal: `3000`
- Relatórios: `3001`
- PostgreSQL: `5432`

# Rede

- Nome: `sd-network`
- Subnet: `172.23.0.0/24`
- Driver: `bridge`

---

# Instalação

# Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)

# Passos

```bash
# Clone o repositório
git clone https://github.com/v21sobral/EntregaA3.git

# Acesse o diretório
cd chocolate-app

# Inicie os containers
docker-compose up -d

# Verifique os containers em execução
docker ps

# Acompanhe os logs
docker-compose logs -f
```

---

# Variáveis de Ambiente

# API Principal (`.env`)

```env
NODE_ENV=development
APP_PORT=3000
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha123
DB_NAME=chocolate_db
```

# Serviço de Relatórios (`.env`)

```env
RELATORIOS_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha123
DB_NAME=chocolate_db
```

---

# Testes com Postman

# Exemplo de Requisição `POST` (criar cliente)

```
POST http://localhost:3000/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "endereço": "Rua Exemplo, 123",
  "cpf": "12345678900"
}
```

---

# Melhorias Futuras

- Autenticação via JWT
- Testes automatizados com Jest
- Interface Web (frontend React ou similar)
- Monitoramento com Prometheus ou Grafana

---

# Referências

- [Node.js Documentation](https://nodejs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Como escrever um artigo científico](https://posgraduando.com/como-escrever-um-artigo-cientifico/)
