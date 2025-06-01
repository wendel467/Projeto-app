// routes/SaleRoutes.js
const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController'); // Você precisará criar este controller

/**
 * @route   POST /api/sales/orders
 * @desc    Criar um novo pedido de venda
 * @access  Public (ou Protegido, dependendo da sua lógica de autenticação)
 * @body    { clientId: number, sellerId: number, items: [{ productId: number, quantity: number }] }
 */
router.post('/orders', SaleController.createOrder);

/**
 * @route   GET /api/sales/orders
 * @desc    Listar todos os pedidos de venda
 * @access  Public (ou Protegido)
 */
router.get('/orders', SaleController.getAllOrders);

/**
 * @route   GET /api/sales/orders/:orderId
 * @desc    Buscar um pedido de venda específico pelo ID
 * @access  Public (ou Protegido)
 */
router.get('/orders/:orderId', SaleController.getOrderById);

/**
 * @route   PUT /api/sales/orders/:orderId/cancel
 * @desc    Cancelar um pedido de venda
 * @access  Public (ou Protegido)
 * @note    Usamos PUT para indicar uma alteração de estado do recurso "pedido".
 * Alternativamente, POST também poderia ser usado para esta ação.
 */
router.put('/orders/:orderId/cancel', SaleController.cancelOrder);





module.exports = router;