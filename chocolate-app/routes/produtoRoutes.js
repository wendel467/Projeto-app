const express = require('express');
const router = express.Router();
const ProdutoDAO = require('../controllers/ProdutoController');


router.get("/", ProdutoDAO.index);
router.get("/:id", ProdutoDAO.show);
router.post("/", ProdutoDAO.create);
router.put("/:id", ProdutoDAO.update);
router.delete("/:id", ProdutoDAO.delete);

module.exports = router;