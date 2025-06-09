const db = require("../db").db; 
const Pedido = require("../models/Pedido"); 

class PedidoDAO {

    static findall(fk_id_cliente, callback) {
        let query = "SELECT * FROM pedidos";


        if (fk_id_cliente) {
            query += " WHERE fk_id_cliente LIKE '%"+fk_id_cliente+"%'";
        }

        db.all(query,[], (err, rows) => {
            if (err) return callback(err, null);
            const pedido = rows.map(row => new Pedido(row.id,row.fk_matricula_vendedor,row.fk_id_cliente,row.fk_id_produto,row.quantidade, row.valor_total));
            callback(null, pedido);
        });
    }

    static findById(id, callback) {
        const query = "SELECT * FROM pedidos WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) return callback(err, null);
            if (!row) return callback(null, null);
            callback(null, new Pedido(row.id,row.fk_matricula_vendedor,row.fk_id_cliente,row.fk_id_produto,row.quantidade,row.valor_total));
        });
    }

    static create(fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total, callback) {
        const query = "INSERT INTO pedidos (fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total) VALUES (?, ?, ?, ?, ?)";
        db.run(query, [fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total], function(err) {
            if (err) return callback(err, null);
            callback(null, new Pedido(this.lastID,fk_matricula_vendedor,fk_id_cliente,fk_id_produto,quantidade,valor_total));
        });
    }


    static update(id, quantidade, valor_total, callback) {
        const query = "UPDATE pedidos SET quantidade = ?, valor_total = ? WHERE id = ?";
        db.run(query, [quantidade, valor_total, id], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0);
        });
    }

    static delete(id, callback) {
        const query = "DELETE FROM pedidos WHERE id = ?";
        db.run(query, [id], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0);
        });
    }
}

module.exports = PedidoDAO;