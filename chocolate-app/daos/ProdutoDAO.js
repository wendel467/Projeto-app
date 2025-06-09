const db = require("../db").db;
const Produto = require("../models/Produto");

class ProdutoDAO {

    static findall(nome, callback) {
        let query = "SELECT * FROM produto";

        if (nome) {
            query += " WHERE nome LIKE ?'%" + nome + "%'";
        }

        db.all(query, [], (err, rows) => {
            if (err) return callback(err, null);
            const produtos = rows.map(row => new Produto(row.id,row.nome,row.marca,row.peso,row.preco,row.estoque,row.disponivel_venda));
            callback(null, produtos);
        });
    }

    static findById(id, callback) {
        const query = "SELECT * FROM produto WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) return callback(err, null);
            if (!row) return callback(null, null);
            callback(null, new Produto(row.id,row.nome,row.marca,row.peso,row.preco,row.estoque,row.disponivel_venda));
        });
    }

    static create(nome, marca, peso, preco, estoque, disponivel_venda, callback) {
        const query = "INSERT INTO produto (nome, marca, peso, preco, estoque, disponivel_venda) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(query, [nome, marca, peso, preco, estoque, disponivel_venda], function(err) {
            if (err) return callback(err, null);
            callback(null, new Produto(this.lastID,nome,marca,peso,preco,estoque,disponivel_venda));
        });
    }

    static update(id,  preco, estoque, disponivel_venda, callback) {
        const query = "UPDATE produto SET preco = ?, estoque = ?, disponivel_venda = ? WHERE id = ?";
        db.run(query, [preco, estoque, disponivel_venda, id], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0); 
        });
    }
    static atualizarEstoque(produtoid,quantidadeVendida, callback){
        this.findById(produtoid,(err,produto)=>{
            if(err){
                return callback(err);
            }if(!produto){
                return callback(new Error("Produto não encontrado."));
            }
            const novoEstoque = produto.estoque - quantidadeVendida;
            this.update(produtoid,produto.preco,novoEstoque,produto.disponivel_venda,(errUpdate,sucesso)=>{
            if(errUpdate){
                return callback(errUpdate);
            }if (!sucesso){ 
                return callback(new Error("Nenhuma alteração de estoque realizada"))
            }callback(null,true);
            });
        }
        )}
        

    

    static delete(id, callback) {
        const query = "DELETE FROM produto WHERE id = ?";
        db.run(query, [id], function(err) {
            if (err) return callback(err);
            callback(null, this.changes > 0); 
        });
    }


}

module.exports = ProdutoDAO;