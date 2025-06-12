const db = require("../db").db;
const Pedido = require("../models/Pedido");

class PedidoDAO {

    static findall(fk_id_cliente, callback) {
        let query = "SELECT * FROM pedidos";

        if (fk_id_cliente) {
            query += " WHERE CAST(fk_id_cliente AS TEXT) LIKE '%" + fk_id_cliente + "%'";
        }

        db.query(query)
            .then(result => {
                const pedidos = result.rows.map(row => new Pedido(row.id, row.fk_matricula_vendedor, row.fk_id_cliente, row.fk_id_produto, row.quantidade, row.valor_total));
                callback(null, pedidos);
            })
            .catch(err => {
                console.error("Erro em findall de pedidos:", err);
                callback(err, null);
            });
    }

    static findById(id, callback) {
        const query = "SELECT * FROM pedidos WHERE id = $1";

        db.query(query, [id])
            .then(result => {
                if (result.rows.length === 0) {
                    return callback(null, null);
                }
                const row = result.rows[0];
                const pedido = new Pedido(row.id, row.fk_matricula_vendedor, row.fk_id_cliente, row.fk_id_produto, row.quantidade, row.valor_total);
                callback(null, pedido);
            })
            .catch(err => {
                console.error("Erro em findById de pedido:", err);
                callback(err, null);
            });
    }

    static create(fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total, callback) {
        const query = "INSERT INTO pedidos (fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        const params = [fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total];

        db.query(query, params)
            .then(result => {
                const newId = result.rows[0].id;
                const novoPedido = new Pedido(newId, fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total);
                callback(null, novoPedido);
            })
            .catch(err => {
                console.error("Erro ao criar pedido:", err);
                callback(err, null);
            });
    }

    static update(id, quantidade, valor_total, callback) {
        const query = "UPDATE pedidos SET quantidade = $1, valor_total = $2 WHERE id = $3";
        const params = [quantidade, valor_total, id];

        db.query(query, params)
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao atualizar pedido:", err);
                callback(err, null);
            });
    }

    static delete(id, callback) {
        const query = "DELETE FROM pedidos WHERE id = $1";

        db.query(query, [id])
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao deletar pedido:", err);
                callback(err, null);
            });
    }
}

module.exports = PedidoDAO