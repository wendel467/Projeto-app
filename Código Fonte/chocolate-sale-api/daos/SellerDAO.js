// daos/SellerDAO.js
const db = require('../db_config'); // Seu módulo de conexão com o PostgreSQL

class SellerDAO {
  
  create(name, callback) {
    const sql = "INSERT INTO sellers (name) VALUES ($1) RETURNING *";
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error("Erro em SellerDAO.create:", err.message);
        return callback(err);
      }
      // Retorna o primeiro vendedor criado (PostgreSQL retorna a linha inserida com RETURNING *)
      callback(null, result.rows[0]);
    });
  }

  /**
   * Busca todos os vendedores cadastrados, ordenados pelo nome.
   * @param {function} 
   */
  findAll(callback) {
    const sql = "SELECT * FROM sellers ORDER BY name ASC";
    db.query(sql, [], (err, result) => {
      if (err) {
        console.error("Erro em SellerDAO.findAll:", err.message);
        return callback(err);
      }
      callback(null, result.rows);
    });
  }

  findById(id, callback) {
    const sql = "SELECT * FROM sellers WHERE seller_id = $1";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Erro em SellerDAO.findById:", err.message);
        return callback(err);
      }
      // Retorna o vendedor encontrado ou undefined se o ID não existir
      callback(null, result.rows[0]);
    });
  }

  
  update(id, name, callback) {
    const sql = "UPDATE sellers SET name = $1 WHERE seller_id = $2 RETURNING *";
    db.query(sql, [name, id], (err, result) => {
      if (err) {
        console.error("Erro em SellerDAO.update:", err.message);
        return callback(err);
      }
      // Retorna o vendedor atualizado ou undefined se o ID não existir para atualização
      callback(null, result.rows[0]);
    });
  }

  delete(id, callback) {
  
    const sql = "DELETE FROM sellers WHERE seller_id = $1 RETURNING *";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Erro em SellerDAO.delete:", err.message);
        // Se o erro for devido a uma restrição de chave estrangeira, ele será capturado aqui.
        return callback(err);
      }
      // Retorna o vendedor deletado ou undefined se o ID não foi encontrado
      callback(null, result.rows[0]);
    });
  }
}

// Exporta uma instância da classe DAO para ser usada em outros módulos (ex: SellerController)
module.exports = new SellerDAO();