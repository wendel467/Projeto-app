const db = require("../db").db;
const Produto = require("../models/Produto");

class ProdutoDAO {

    static findall(nome, callback) {
        let query = "SELECT * FROM produto";

        if (nome) {
            query += " WHERE nome ILIKE '%" + nome + "%'";
        }

        db.query(query)
            .then(result => {
                const produtos = result.rows.map(row => new Produto(row.id, row.nome, row.marca, row.peso, row.preco, row.estoque, row.disponivel_venda));
                callback(null, produtos);
            })
            .catch(err => {
                console.error("Erro em findall de produtos:", err);
                callback(err, null);
            });
    }

    static findById(id, callback) {
        const query = "SELECT * FROM produto WHERE id = $1";
        
        db.query(query, [id])
            .then(result => {
                if (result.rows.length === 0) {
                    return callback(null, null);
                }
                const row = result.rows[0];
                const produto = new Produto(row.id, row.nome, row.marca, row.peso, row.preco, row.estoque, row.disponivel_venda);
                callback(null, produto);
            })
            .catch(err => {
                console.error("Erro em findById de produto:", err);
                callback(err, null);
            });
    }

    static create(nome, marca, peso, preco, estoque, disponivel_venda, callback) {
        const query = "INSERT INTO produto (nome, marca, peso, preco, estoque, disponivel_venda) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const params = [nome, marca, peso, preco, estoque, disponivel_venda];
        
        db.query(query, params)
            .then(result => {
                const newId = result.rows[0].id;
                const novoProduto = new Produto(newId, nome, marca, peso, preco, estoque, disponivel_venda);
                callback(null, novoProduto);
            })
            .catch(err => {
                console.error("Erro ao criar produto:", err);
                callback(err, null);
            });
    }

    static update(id, preco, estoque, disponivel_venda, callback) {
        const query = "UPDATE produto SET preco = $1, estoque = $2, disponivel_venda = $3 WHERE id = $4";
        const params = [preco, estoque, disponivel_venda, id];

        db.query(query, params)
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao atualizar produto:", err);
                callback(err, null);
            });
    }

    // Esta função já utiliza os outros métodos corrigidos, então deve funcionar sem alterações.
    static atualizarEstoque(produtoid, quantidadeVendida, callback) {
        this.findById(produtoid, (err, produto) => {
            if (err) {
                return callback(err);
            }
            if (!produto) {
                return callback(new Error("Produto não encontrado."));
            }
            
            const novoEstoque = produto.estoque - quantidadeVendida;
            
            // Reutiliza o método 'update' que já foi corrigido
            this.update(produtoid, produto.preco, novoEstoque, produto.disponivel_venda, (errUpdate, sucesso) => {
                if (errUpdate) {
                    return callback(errUpdate);
                }
                if (!sucesso) {
                    return callback(new Error("Nenhuma alteração de estoque realizada"));
                }
                callback(null, true);
            });
        });
    }

    static delete(id, callback) {
        const query = "DELETE FROM produto WHERE id = $1";
        
        db.query(query, [id])
            .then(result => {
                const success = result.rowCount > 0;
                callback(null, success);
            })
            .catch(err => {
                console.error("Erro ao deletar produto:", err);
                callback(err, null);
            });
    }
}

module.exports = ProdutoDAO;