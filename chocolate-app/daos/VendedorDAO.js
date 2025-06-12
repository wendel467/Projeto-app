const db = require("../db").db;
const Vendedor = require("../models/Vendedor");

class VendedorDAO {
    static findall(nome, callback) {
        let query = "SELECT * FROM vendedores";

        if (nome) {
            query += " WHERE nome LIKE '%" + nome + "%'";
        }
        
        db.query(query)
            .then(result => {
                const vendedores = result.rows.map(row => new Vendedor(row.matricula, row.nome, row.email, row.telefone, row.endereco, row.cpf));
                callback(null, vendedores);
            })
            .catch(err => {
                console.error("Erro em findall de vendedores:", err);
                callback(err, null);
            });
    }


    static findByMatricula(matricula, callback) {
        const query = "SELECT * FROM vendedores WHERE matricula = $1";

        db.query(query, [matricula])
            .then(result => {
                if (result.rows.length === 0) {
                    return callback(null, null);
                }
                const row = result.rows[0];
                const vendedor = new Vendedor(row.matricula, row.nome, row.email, row.telefone, row.endereco, row.cpf);
                callback(null, vendedor);
            })
            .catch(err => {
                console.error("Erro em findByMatricula de vendedor:", err);
                callback(err, null);
            });
    }

    static create(nome, email, telefone, endereco, cpf, callback) {
        const query = "INSERT INTO vendedores (nome, email, telefone, endereco, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING matricula";
        const params = [nome, email, telefone, endereco, cpf];

        db.query(query, params)
            .then(result => {
                const newMatricula = result.rows[0].matricula;
                const novoVendedor = new Vendedor(newMatricula, nome, email, telefone, endereco, cpf);
                callback(null, novoVendedor);
            })
            .catch(err => {
                console.error("Erro ao criar vendedor:", err);
                callback(err, null);
            });
    }

    static update(matricula, nome, email, telefone, endereco, callback) {
        const query = "UPDATE vendedores SET nome = $1, email = $2, telefone = $3, endereco = $4 WHERE matricula = $5";
        const params = [nome, email, telefone, endereco, matricula];

        db.query(query, params)
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao atualizar vendedor:", err);
                callback(err, null);
            });
    }

    static delete(matricula, callback) {
        const query = "DELETE FROM vendedores WHERE matricula = $1";

        db.query(query, [matricula])
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao deletar vendedor:", err);
                callback(err, null);
            });
    }
}

module.exports = VendedorDAO;