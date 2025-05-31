// controllers/ClientController.js
const ClientDAO = require('../daos/ClientDAO');

class ClientController {
  create(req, res) {
    const { name, contact_info } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    ClientDAO.create(name, contact_info, (err, client) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(client);
    });
  }

  index(req, res) {
    ClientDAO.findAll((err, clients) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(clients);
    });
  }

  show(req, res) {
    const id = parseInt(req.params.id);
    ClientDAO.findById(id, (err, client) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    });
  }

  update(req, res) {
    const id = parseInt(req.params.id);
    const { name, contact_info } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required for update" });
    }
    ClientDAO.update(id, name, contact_info, (err, client) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!client) return res.status(404).json({ error: "Client not found to update" });
      res.json(client);
    });
  }

  delete(req, res) {
    const id = parseInt(req.params.id);
    ClientDAO.delete(id, (err, client) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!client) return res.status(404).json({ error: "Client not found to delete" });
      res.json({ message: "Client deleted successfully", client });
    });
  }
}

module.exports = new ClientController();