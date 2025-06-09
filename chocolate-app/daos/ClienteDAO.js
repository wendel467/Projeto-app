const db = require("../db").db
const Cliente = require("../models/Cliente")

class ClienteDAO {

    static findall(nome,callback){
        let query = "SELECT * FROM clientes";

        if(nome){
            query+= " WHERE nome  LIKE '%"+nome+"%'";
        }

        db.all(query,[],(err,rows)=>{
            if (err) return callback(err,null);
            const cliente= rows.map(row=> new Cliente(row.id, row.nome, row.email, row.telefone, row.endereço,row.cpf));
            callback(null,cliente);
        });

    }

    static findById(id,callback){
        const query = "SELECT * FROM clientes WHERE id = ?";
        db.get(query,[id],(err,row) =>{
            if(err) return callback(err,null);
            if(!row) return callback(null,null);
            callback(null,new Cliente(row.id, row.nome, row.email, row.telefone, row.endereço,row.cpf));
        });
    }

    static create(nome,email,telefone,endereço,cpf,callback) {
        const query = "INSERT INTO clientes (nome, email, telefone, endereço, cpf) VALUES (?, ?, ?, ?, ?)";
        db.run(query,[nome,email,telefone,endereço,cpf],function(err){
            if(err) return callback(err,null);
            callback(null,new Cliente(this.lastID,nome,email,telefone,endereço,cpf));
        });
    }

    static update(id,nome,email,telefone,endereço,callback) {
        const query = "UPDATE clientes set nome = ?, email = ?, telefone = ?, endereço = ? WHERE id = ?";
        db.run(query,[nome,email,telefone,endereço,id],function(err){
            if (err) return callback(err);
            callback(null,this.changes>0);
        });
        
    }
    static delete(id,callback){
        const query = "DELETE FROM clientes WHERE id = ?";
        db.run(query,[id],function(err){
            if(err) return callback(err);
            callback(null,this.changes > 0);
        });
    }

}

module.exports = ClienteDAO;