// controllers/SellerController.js
const SellerDAO = require('../daos/SellerDAO');

class SellerController {
  create(req, res) {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "O nome do vendedor é obrigatório." });
    }
    SellerDAO.create(name.trim(), (err, seller) => {
      if (err) {
        console.error("Erro em SellerController.create:", err.message);
        return res.status(500).json({ error: "Erro interno ao criar o vendedor." });
      }
      res.status(201).json(seller);
    });
  }

  index(req, res) { // Para listar todos os vendedores
    SellerDAO.findAll((err, sellers) => {
      if (err) {
        console.error("Erro em SellerController.index:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar os vendedores." });
      }
      res.json(sellers);
    });
  }

  show(req, res) { // Para buscar um vendedor por ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID do vendedor inválido." });
    }
    SellerDAO.findById(id, (err, seller) => {
      if (err) {
        console.error("Erro em SellerController.show:", err.message);
        return res.status(500).json({ error: "Erro interno ao buscar o vendedor." });
      }
      if (!seller) {
        return res.status(404).json({ error: "Vendedor não encontrado." });
      }
      res.json(seller);
    });
  }

  update(req, res) {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID do vendedor inválido." });
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "O nome do vendedor é obrigatório para atualização." });
    }

    SellerDAO.update(id, name.trim(), (err, seller) => {
      if (err) {
        console.error("Erro em SellerController.update:", err.message);
        return res.status(500).json({ error: "Erro interno ao atualizar o vendedor." });
      }
      if (!seller) { // Se o DAO retorna undefined pois o ID não foi encontrado
        return res.status(404).json({ error: "Vendedor não encontrado para atualização." });
      }
      res.json(seller);
    });
  }

  delete(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID do vendedor inválido." });
    }
    SellerDAO.delete(id, (err, seller) => {
      if (err) {
        console.error("Erro em SellerController.delete:", err.message);
        // Verificar se o erro é de chave estrangeira (ex: vendedor com vendas)
        if (err.code === '23503') { // Código de erro do PostgreSQL para foreign_key_violation
            return res.status(409).json({ error: "Não é possível deletar o vendedor pois ele possui registros associados (vendas)." });
        }
        return res.status(500).json({ error: "Erro interno ao deletar o vendedor." });
      }
      if (!seller) {
        return res.status(404).json({ error: "Vendedor não encontrado para deleção." });
      }
      res.json({ message: "Vendedor deletado com sucesso.", seller });
    });
  }
}

module.exports = new SellerController();