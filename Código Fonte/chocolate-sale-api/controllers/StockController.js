// controllers/StockController.js
const StockDAO = require('../daos/StockDAO');
const ProductDAO = require('../daos/ProductDAO'); // Para verificar se o produto existe

class StockController {
  getProductStock(req, res) {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    StockDAO.getProductStock(productId, (err, productStock) => {
      if (err) {
        console.error("Erro em StockController.getProductStock:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar o estoque do produto." });
      }
      if (!productStock) {
        return res.status(404).json({ error: "Produto não encontrado ou sem informação de estoque." });
      }
      res.json(productStock);
    });
  }

  getAllProductStock(req, res) {
    StockDAO.getAllProductStock((err, allStock) => {
      if (err) {
        console.error("Erro em StockController.getAllProductStock:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar o estoque de todos os produtos." });
      }
      res.json(allStock);
    });
  }

  /**
   * Ajusta o estoque de um produto manualmente e registra o movimento.
   * Espera no body: { productId, quantityChange, movementType, notes (opcional) }
   * movementType pode ser 'restock', 'manual_adjustment_add', 'manual_adjustment_remove'
   */
  adjustStock(req, res) {
    const { productId, quantityChange, movementType, notes } = req.body;

    if (typeof productId !== 'number' || typeof quantityChange !== 'number' || !movementType) {
      return res.status(400).json({ error: "Dados inválidos para ajuste de estoque. Verifique productId, quantityChange e movementType." });
    }

    const validMovementTypes = ['restock', 'manual_adjustment_add', 'manual_adjustment_remove'];
    if (!validMovementTypes.includes(movementType)) {
        return res.status(400).json({ error: `movementType inválido. Use um dos seguintes: ${validMovementTypes.join(', ')}` });
    }

    if (movementType === 'manual_adjustment_remove' && quantityChange > 0) {
        return res.status(400).json({ error: "Para 'manual_adjustment_remove', quantityChange deve ser negativo ou zero." });
    }
    if ((movementType === 'manual_adjustment_add' || movementType === 'restock') && quantityChange < 0) {
        return res.status(400).json({ error: `Para '${movementType}', quantityChange deve ser positivo ou zero.` });
    }


    // Verificar se o produto existe antes de tentar ajustar o estoque
    // Usar o client do db para a transação, mas ProductDAO.findById não é transacional por padrão
    // Uma solução simples é verificar antes, mas idealmente isso seria uma transação completa.
    // Para este exemplo, faremos uma verificação prévia simples.

    ProductDAO.findById(productId, (errP, product) => {
        if (errP) {
            console.error("Erro ao verificar produto em adjustStock:", errP.message);
            return res.status(500).json({ error: "Erro interno ao verificar o produto." });
        }
        if (!product) {
            return res.status(404).json({ error: `Produto com ID ${productId} não encontrado.`});
        }

        // Se o produto existe, prosseguir com o ajuste de estoque
        // O StockDAO.updateStockAndLogMovement precisa de um client para transação
        // Para um ajuste manual simples que não está dentro de uma venda,
        // podemos criar uma transação aqui ou adaptar o DAO para lidar com isso.
        // Para simplificar, vamos assumir que o DAO pode lidar com uma query única ou adaptar.
        // A versão anterior de StockDAO.updateStockAndLogMovement esperava um 'client'.
        // Vamos criar uma transação aqui para usar esse método corretamente.

        const db = require('../db_config');
        db.getClient((errClient, client, release) => {
            if (errClient) {
                console.error('Erro ao obter cliente do pool para adjustStock:', errClient);
                return res.status(500).json({ error: "Erro interno ao iniciar ajuste de estoque." });
            }

            client.query('BEGIN', (errBegin) => {
                if (errBegin) {
                    release();
                    console.error('Erro ao iniciar BEGIN em adjustStock:', errBegin);
                    return res.status(500).json({ error: "Erro interno ao iniciar transação." });
                }

                StockDAO.updateStockAndLogMovement(client, productId, quantityChange, movementType, null, notes, (errAdjust, stockMovement) => {
                    if (errAdjust) {
                        console.error("Erro em StockController.adjustStock dentro do DAO:", errAdjust.message);
                        return client.query('ROLLBACK', () => {
                            release();
                            if (errAdjust.message.includes("Estoque insuficiente")) {
                                return res.status(400).json({ error: errAdjust.message });
                            }
                            return res.status(500).json({ error: "Erro interno ao ajustar o estoque." });
                        });
                    }

                    client.query('COMMIT', (errCommit) => {
                        release();
                        if (errCommit) {
                            console.error('Erro ao COMMITAR em adjustStock:', errCommit);
                            return res.status(500).json({ error: "Erro interno ao finalizar ajuste de estoque."});
                        }
                        res.status(200).json({ message: "Estoque ajustado com sucesso.", movement: stockMovement });
                    });
                });
            });
        });
    });
  }
}

module.exports = new StockController();