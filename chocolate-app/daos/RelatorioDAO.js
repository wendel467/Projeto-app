const db = require("../db").db;

class RelatorioDAO {
    static getMaisVendido(limite, callback) {
        const query = `
            SELECT
                p.id AS id_do_produto,
                p.nome AS nome_do_produto,
                p.marca AS marca_do_produto,
                SUM(ped.quantidade) AS quantidade_total_vendida
            FROM
                pedidos ped
            JOIN
                produto p ON ped.fk_id_produto = p.id
            GROUP BY
                p.id, p.nome, p.marca
            ORDER BY
                quantidade_total_vendida DESC
            LIMIT $1;
        `;

        db.query(query, [limite])
            .then(result => {
                callback(null, result.rows);
            })
            .catch(err => {
                console.error("Erro no DAO ao buscar produto mais vendido:", err.message);
                callback(err, null);
            });
    }

    static getComprasPorCliente(clientId, callback) {
        const query = `
            SELECT
                ped.id AS id_item_pedido,
                p.nome AS nome_produto,
                p.marca AS marca_produto,
                ped.quantidade AS quantidade_comprada,
                p.preco AS preco_unitario_do_produto,
                ped.valor_total AS valor_pago_no_item,
                c.nome AS nome_cliente
            FROM
                pedidos ped
            JOIN
                clientes c ON ped.fk_id_cliente = c.id
            JOIN
                produto p ON ped.fk_id_produto = p.id
            WHERE
                c.id = $1
            ORDER BY
                ped.id DESC;
        `;

        db.query(query, [clientId])
            .then(result => {
                callback(null, result.rows);
            })
            .catch(err => {
                console.error("Erro no DAO ao buscar compras por cliente:", err.message);
                callback(err, null);
            });
    }

    static getCustoMedioPorCliente(clientId, callback) {
        const query = `
            SELECT
                c.id AS cliente_id,
                c.nome AS nome_cliente,
                COALESCE(AVG(ped.valor_total), 0) AS custo_medio_por_compra
            FROM
                clientes c
            LEFT JOIN
                pedidos ped ON c.id = ped.fk_id_cliente
            WHERE
                c.id = $1
            GROUP BY
                c.id, c.nome
        `;

        db.query(query, [clientId])
            .then(result => {
                callback(null, result.rows[0] || null);
            })
            .catch(err => {
                console.error("Erro no DAO ao buscar custo médio por cliente:", err.message);
                callback(err, null);
            });
    }

    static getEstoqueBaixo(estoqueMinimo, callback) {

        const query = `
            SELECT
                id,
                nome,
                marca,
                estoque,
                preco
            FROM
                produto
            WHERE
                estoque < $1
            ORDER BY
                estoque ASC,
                nome ASC;
        `;
        
        db.query(query, [estoqueMinimo])
            .then(result => {
                callback(null, result.rows);
            })
            .catch(err => {
                console.error("Erro no DAO ao buscar produtos com pouco estoque:", err.message);
                callback(err, null);
            });
    }
}

module.exports = RelatorioDAO;
