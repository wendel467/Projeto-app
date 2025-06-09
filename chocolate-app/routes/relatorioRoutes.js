const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');

router.get("/mais_vendido", RelatorioController.getMaisVendido);
router.get("/cliente/total/:id", RelatorioController.getComprasPorCliente);
router.get("/cliente/media/:id", RelatorioController.getCustoMedioPorCliente);
router.get("/produto_estoque_baixo", RelatorioController.getEstoqueBaixo);

module.exports = router;