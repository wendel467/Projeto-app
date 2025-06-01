// daos/StockDAO.js
// const db = require('../db_config'); // Será importado onde necessário ou passado

class StockDAO {

  
  updateStockAndLogMovement(client, productId, quantityChange, movementType, orderId, notes, callback) {
    // 1. Registrar o movimento de estoque
    const movementSql = `
      INSERT INTO stock_movements (product_id, quantity_change, movement_type, order_id, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const movementParams = [productId, quantityChange, movementType, orderId, notes];

    client.query(movementSql, movementParams, (err, movementResult) => {
      if (err) {
        console.error("Erro ao registrar movimento de estoque:", err);
        return callback(err);
      }
      const stockMovement = movementResult.rows[0];

      // 2. Atualizar o estoque atual na tabela de produtos
      const updateStockSql = `
        UPDATE products
        SET current_stock = current_stock + $1
        WHERE product_id = $2
        RETURNING current_stock;
      `;
      const updateStockParams = [quantityChange, productId];

      client.query(updateStockSql, updateStockParams, (errUpdate, stockUpdateResult) => {
        if (errUpdate) {
          console.error("Erro ao atualizar estoque do produto:", errUpdate);
          return callback(errUpdate);
        }

        if (stockUpdateResult.rows.length === 0) {
          const productNotFoundError = new Error(`Produto com ID ${productId} não encontrado para atualização de estoque.`);
          console.error(productNotFoundError.message);
          return callback(productNotFoundError);
        }
        if (stockUpdateResult.rows[0].current_stock < 0) {
          const insufficientStockError = new Error(`Estoque insuficiente para o produto ID ${productId} após a tentativa de atualização. Estoque atual: ${stockUpdateResult.rows[0].current_stock}.`);
          console.error(insufficientStockError.message);

          return callback(insufficientStockError);
        }

        callback(null, stockMovement); // Sucesso
      });
    });
  }

  getProductStock(productId, callback) {
    const sql = "SELECT product_id, name, current_stock FROM products WHERE product_id = $1";
    const db = require('../db_config');
    db.query(sql, [productId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]);
    });
  }

  getAllProductStock(callback) {
    const sql = "SELECT product_id, name, current_stock FROM products ORDER BY name ASC";
    const db = require('../db_config');
    db.query(sql, [], (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows);
    });
  }

  getLowStockProducts(threshold, callback) {
    const sql = "SELECT product_id, name, current_stock FROM products WHERE current_stock < $1 ORDER BY current_stock ASC, name ASC";
    const db = require('../db_config');
    db.query(sql, [threshold], (err, result) => {
        if (err) return callback(err);
        callback(null, result.rows);
    });
  }
}

module.exports = new StockDAO();