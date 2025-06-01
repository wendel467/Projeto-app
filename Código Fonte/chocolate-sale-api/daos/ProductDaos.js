// daos/ProductDAO.js
const db = require('../db_config'); // Seu módulo de conexão com o PostgreSQL

class ProductDAO {
  /**
   * Cria um novo produto no banco de dados.
   * @param {string} name - Nome do produto.
   * @param {string} description - Descrição do produto.
   * @param {number} price - Preço do produto.
   * @param {number} initialStock - Estoque inicial do produto. (Opcional, default 0)
   * @param {function} callback - Função de callback (err, newProduct).
   */
  create(name, description, price, initialStock = 0, callback) {
    // Nota: A criação de um produto com estoque inicial também deve gerar um
    // registro em 'stock_movements' com type 'initial_stock'.
    // Idealmente, essa lógica de movimento de estoque seria gerenciada pelo StockDAO
    // ou por uma camada de serviço que coordena ProductDAO e StockDAO.
    // Para simplificar este DAO, apenas inserimos o produto com o current_stock.
    // Uma abordagem mais completa envolveria uma transação se a criação do produto
    // e o registro do movimento de estoque inicial precisassem ser atômicos.

    const sql = `
      INSERT INTO products (name, description, price, current_stock) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const params = [name, description, price, initialStock];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Erro em ProductDAO.create:", err.message);
        return callback(err);
      }
      // Se também for necessário registrar o movimento de estoque inicial aqui:
      // const newProduct = result.rows[0];
      // const StockDAO = require('./StockDAO'); // Cuidado com dependências circulares se usar getClient
      // StockDAO.addStockMovement(newProduct.product_id, newProduct.current_stock, 'initial_stock', null, 'Carga inicial via ProductDAO.create', (stockErr, movement) => {
      // if (stockErr) return callback(stockErr); // Idealmente, isso seria transacional
      // callback(null, newProduct);
      // });
      callback(null, result.rows[0]);
    });
  }

  /**
   * Busca todos os produtos cadastrados, ordenados pelo nome.
   * @param {function} callback - Função de callback (err, productsArray).
   */
  findAll(callback) {
    const sql = "SELECT * FROM products ORDER BY name ASC";
    db.query(sql, [], (err, result) => {
      if (err) {
        console.error("Erro em ProductDAO.findAll:", err.message);
        return callback(err);
      }
      callback(null, result.rows);
    });
  }

  /**
   * Busca um produto específico pelo seu ID.
   * @param {number} id - ID do produto.
   * @param {function} callback - Função de callback (err, product).
   */
  findById(id, callback) {
    const sql = "SELECT * FROM products WHERE product_id = $1";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Erro em ProductDAO.findById:", err.message);
        return callback(err);
      }
      callback(null, result.rows[0]); // Retorna o produto ou undefined se não encontrar
    });
  }

  /**
   * Atualiza os dados de um produto existente (exceto o estoque).
   * O estoque deve ser atualizado via StockDAO para manter a integridade dos movimentos.
   * @param {number} id - ID do produto a ser atualizado.
   * @param {object} productData - Objeto contendo os dados a serem atualizados.
   * Ex: { name, description, price }
   * @param {function} callback - Função de callback (err, updatedProduct).
   */
  update(id, productData, callback) {
    const { name, description, price } = productData;

   
    if (name === undefined && description === undefined && price === undefined) {
      return callback(new Error("Nenhum dado fornecido para atualização do produto."));
    }

 
    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fieldsToUpdate.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      fieldsToUpdate.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      fieldsToUpdate.push(`price = $${paramIndex++}`);
      values.push(price);
    }

    values.push(id); // Adiciona o ID como último parâmetro para WHERE

    const sql = `
      UPDATE products 
      SET ${fieldsToUpdate.join(", ")} 
      WHERE product_id = $${paramIndex} 
      RETURNING *;
    `;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro em ProductDAO.update:", err.message);
        return callback(err);
      }
      callback(null, result.rows[0]); // Retorna o produto atualizado ou undefined
    });
  }

  /**
   * Deleta um produto do banco de dados.
   * @param {number} id - ID do produto a ser deletado.
   * @param {function} callback - Função de callback (err, deletedProduct).
   */
  delete(id, callback) {
   

    const sql = "DELETE FROM products WHERE product_id = $1 RETURNING *";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Erro em ProductDAO.delete:", err.message);
        // Um erro comum aqui seria de violação de chave estrangeira.
        return callback(err);
      }
      callback(null, result.rows[0]); // Retorna o produto deletado ou undefined
    });
  }
}

// Exporta uma instância da classe DAO
module.exports = new ProductDAO();