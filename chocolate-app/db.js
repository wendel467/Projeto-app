const { Pool } = require('pg');
// configure sua conexão com PostgreSQL aqui

class Database {
    _createTable(){

        const tbpedidos = `
            CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fk_matricula_vendedor INTEGER NOT NULL,
            fk_id_cliente INTEGER NOT NULL,
            fk_id_produto INTEGER NOT NULL,
            quantidade REAL NOT NULL,
            valor_total REAL NOT NULL,
            FOREIGN KEY (fk_matricula_vendedor) REFERENCES vendedores(matricula),
            FOREIGN KEY (fk_id_cliente) REFERENCES clientes(id),
            FOREIGN KEY (fk_id_produto) REFERENCES produto(id)
            );
        `;  
         this.db.run(tbpedidos,(err) => {
            if(err) console.error("Erro ao criar tabela: ", err.message);
            else {
                console.log("Tabela 'produtos' verificada/criada.");
            }
        });            

            const tbproduto = `
                CREATE TABLE IF NOT EXISTS produto (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                marca TEXT,
                peso INTEGER NOT NULL,
                preco REAL NOT NULL,
                estoque INTEGER  NOT NULL,
                disponivel_venda INTEGER DEFAULT 1
                );
            `;
             this.db.run(tbproduto,(err) => {
                if(err) console.error("Erro ao criar tabela: ", err.message);
                else {
                    console.log("Tabela 'produtos' verificada/criada.");
                }
            });   
            const tbVendedor = `
                CREATE TABLE IF NOT EXISTS vendedores (
                matricula INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                telefone TEXT NOT NULL,
                endereço TEXT NOT NULL,
                cpf TEXT NOT NULL UNIQUE
                );
            `;
            this.db.run(tbVendedor,(err) => {
                if(err) console.error("Erro ao criar tabela: ", err.message);
                else {
                    console.log("Tabela 'vendedores' verificada/criada.");
                }
            });   
            const tbCliente = `
                CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                telefone TEXT NOT NULL,
                endereço TEXT NOT NULL,
                cpf TEXT NOT NULL UNIQUE,
                valorgasto REAL DEFAULT 0
                );
            `;
            this.db.run(tbCliente,(err) => {
                if(err) console.error("Erro ao criar tabela: ", err.message);
                else {
                    console.log("Tabela 'clientes' verificada/criada.");
                }
            });            
        }
        _seed(){                                                
        }
        _connect(){
            this.db = new Pool({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });
        
            this.db.connect()
                .then(() => {
                    console.log("Conectado ao PostgreSQL.");
                    // Você pode criar tabelas aqui se quiser, mas normalmente faz isso fora da aplicação
                    // this._createTable();
                })
                .catch(err => {
                    console.error("Erro ao conectar no PostgreSQL: ", err.message);
                });
        }

    constructor(){
        if(!Database.instance){
            this._connect();
            Database.instance = this;
        }
        return Database.instance;
    }

}

module.exports = new Database();
