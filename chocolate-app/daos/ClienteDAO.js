const db = require("../db").db
const { Result } = require("pg");
const Cliente = require("../models/Cliente")

class ClienteDAO {

    static findall(nome,callback){
        let query = "SELECT * FROM clientes";

        if(nome){
            query+= " WHERE nome  LIKE '%"+nome+"%'";
        }

        db.query(query)
            .then(result =>{

            const cliente= result.rows.map(row=> new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco,row.cpf));
            callback(null,cliente);
        })
            .catch(err => { 
            console.error("Erro ao buscar clientes no banco de dados:");
            return callback(err,null);

        })

    }

    static findById(id, callback) {
        const query = "SELECT * FROM clientes WHERE id = $1";

        db.query(query, [id])
            .then(result => {
                if (result.rows.length === 0) {
                    return callback(null, null);
                }
                const row = result.rows[0];
                const cliente = new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco, row.cpf);
                callback(null, cliente);
            })
            .catch(err => {
                console.error("Erro em findById de cliente:", err);
                callback(err, null);
            });
    }

    static create(nome, email, telefone, endereco, cpf, callback) {
        const query = "INSERT INTO clientes (nome, email, telefone, endereco, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        const params = [nome, email, telefone, endereco, cpf];

        db.query(query, params)
            .then(result => {

                const newId = result.rows[0].id;
                const novoCliente = new Cliente(newId, nome, email, telefone, endereco, cpf);
                callback(null, novoCliente);
            })
            .catch(err => {
                console.error("Erro ao criar cliente:", err);
                callback(err, null);
            });
    }
    static update(id, nome, email, telefone, endereco, callback) {
        const query = "UPDATE clientes SET nome = $1, email = $2, telefone = $3, endereco = $4 WHERE id = $5";
        const params = [nome, email, telefone, endereco, id];

        db.query(query, params)
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao atualizar cliente:", err);
                callback(err, null);
            });
    }
    static delete(id, callback) {
        const query = "DELETE FROM clientes WHERE id = $1";

        db.query(query, [id])
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao deletar cliente:", err);
                callback(err, null);
            });
    }

}

module.exports = ClienteDAO;