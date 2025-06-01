// controllers/SaleController.js
const SaleDAO = require('../daos/SaleDAO');

class SaleController {
  createOrder(req, res) {
    const { clientId, sellerId, items } = req.body;

    // Validação básica (em produção, use algo mais robusto como Joi ou express-validator)
    if (typeof clientId !== 'number' || typeof sellerId !== 'number' || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Dados inválidos para criar pedido. Verifique clientId (número), sellerId (número) e a lista de items (array não vazio)." });
    }
    for (const item of items) {
        if (typeof item.productId !== 'number' || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).json({ error: "Cada item deve ter productId (número) e quantity (número > 0)." });
        }
    }

    SaleDAO.createSaleOrder(clientId, sellerId, items, (err, newOrder) => {
      if (err) {
        console.error("Erro em SaleController.createOrder:", err.message);
        // O SaleDAO já pode ter feito rollback em caso de erro transacional
        if (err.message.includes("Estoque insuficiente") || err.message.includes("não encontrado")) {
            return res.status(400).json({ error: err.message }); // Erro de negócio, bad request
        }
        return res.status(500).json({ error: "Erro interno ao processar o pedido." });
      }
      res.status(201).json(newOrder);
    });
  }

  getAllOrders(req, res) {
    SaleDAO.findAllOrders((err, orders) => {
      if (err) {
        console.error("Erro em SaleController.getAllOrders:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar todos os pedidos." });
      }
      res.json(orders);
    });
  }

  getOrderById(req, res) {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) {
        return res.status(400).json({ error: "ID do pedido inválido." });
    }

    SaleDAO.findOrderById(orderId, (err, order) => {
      if (err) {
        console.error("Erro em SaleController.getOrderById:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar o pedido." });
      }
      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }
      res.json(order);
    });
  }

  cancelOrder(req, res) {
    const orderId = parseInt(req.params.orderId);
     if (isNaN(orderId)) {
        return res.status(400).json({ error: "ID do pedido inválido." });
    }

    SaleDAO.cancelSaleOrder(orderId, (err, cancelledOrder) => {
      if (err) {
        console.error("Erro em SaleController.cancelOrder:", err.message);
        // O SaleDAO já pode ter feito rollback
        if (err.message.includes("não encontrado") || err.message.includes("já está cancelado") || err.message.includes("não pode ser cancelado")) {
            return res.status(400).json({ error: err.message }); // Erro de negócio
        }
        return res.status(500).json({ error: "Erro interno ao cancelar o pedido." });
      }
      // O DAO.cancelSaleOrder em caso de sucesso retorna o pedido cancelado.
      // Se ele retornasse null/undefined mesmo com sucesso (improvável para esta lógica), um 404 seria aqui.
      // Mas como ele retorna o objeto, o sucesso já é implícito.
      res.json({ message: "Pedido cancelado com sucesso.", order: cancelledOrder });
    });
  }
}

module.exports = new SaleController();