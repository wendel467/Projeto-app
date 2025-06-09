const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.get("/", ClienteController.index);
router.get("/:id", ClienteController.show);
router.post("/", ClienteController.create);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);

module.exports = router;