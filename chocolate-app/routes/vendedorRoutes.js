const express = require('express');
const router = express.Router();
const VendedorController = require('../controllers/VendedorController');

router.get("/", VendedorController.index);
router.get("/:matricula", VendedorController.show);
router.post("/", VendedorController.create);
router.put("/:matricula", VendedorController.update);
router.delete("/:matricula", VendedorController.delete);

module.exports = router;