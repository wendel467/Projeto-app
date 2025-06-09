const db = require("../db").db; 
const Vendedor = require("../models/Vendedor");

class VendedorDAO {

    static findall(nome, callback) {
        let query = "SELECT * FROM vendedores";
        
        if (nome) {
            query+= " WHERE nome  LIKE '%"+nome+"%'";
        }

        db.all(query, [], (err, rows) => {
            if (err) return callback(err, null);
            const vendedores = rows.map(row => new Vendedor(row.matricula, row.nome, row.email, row.telefone, row.endereço, row.cpf));
            callback(null, vendedores);
        });
    }

    static findByMatricula(matricula, callback) { 
        const query = "SELECT * FROM vendedores WHERE matricula = ?";
        db.get(query, [matricula], (err, row) => {
            if (err) return callback(err, null);
            if (!row) return callback(null, null);
            callback(null, new Vendedor(row.matricula, row.nome, row.email, row.telefone, row.endereço, row.cpf));
        });
    }

    static create(nome, email, telefone, endereço, cpf, callback) {
        const query = "INSERT INTO vendedores (nome, email, telefone, endereço, cpf) VALUES (?, ?, ?, ?, ?)";
        db.run(query, [nome, email, telefone, endereço, cpf], function(err) {
            if (err) return callback(err, null);
            callback(null, new Vendedor(this.lastID, nome, email, telefone, endereço, cpf));
        });
    }

    static update(matricula, nome, email, telefone, endereço, callback) {
        const query = "UPDATE vendedores SET nome = ?, email = ?, telefone = ?, endereço = ? WHERE matricula = ?";
        db.run(query, [nome, email, telefone, endereço, matricula], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0);
        });
    }

    static delete(matricula, callback) {
        const query = "DELETE FROM vendedores WHERE matricula = ?";
        db.run(query, [matricula], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0);
        });
    }
}

module.exports = VendedorDAO;