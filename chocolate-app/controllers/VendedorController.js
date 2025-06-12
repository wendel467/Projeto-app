const VendedorDAO = require("../daos/VendedorDAO"); 

class VendedorController {

    index(req, res) {
        VendedorDAO.findall(req.query.nome, (err, vendedores) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(vendedores);
        });
    }

    show(req, res) {
        const matricula = req.params.matricula; 
        VendedorDAO.findByMatricula(matricula, (err, vendedor) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (vendedor) {
                res.json(vendedor);
            } else {
                res.status(404).json({ message: "Vendedor não encontrado." });
            }
        });
    }

    create(req, res) {
        const { nome, email, telefone, endereco, cpf } = req.body;
        if (!nome || !email || !telefone || !endereco || !cpf) {
            return res.status(400).json({ error: "Campos nome, email, telefone, endereco e cpf são obrigatórios" });
        }
        VendedorDAO.create(nome, email, telefone, endereco, cpf, (err, vendedor) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(vendedor);
        });
    }

    update(req, res) {
        const { nome, email, telefone, endereco } = req.body;
        const matricula = req.params.matricula;

        if (!nome && !email && !telefone && !endereco) {
            return res.status(400).json({ error: "Pelo menos um campo (nome, email, telefone, endereco) deve ser fornecido para atualização." });
        }

        VendedorDAO.update(matricula, nome, email, telefone, endereco, (err, sucesso) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!sucesso) {
                return res.status(404).json({ message: "Vendedor não encontrado ou nenhum dado alterado." }); 
            }
            res.json({ message: "Vendedor atualizado com sucesso." });
        });
    }

    delete(req, res) {
        const matricula = req.params.matricula; 

        VendedorDAO.delete(matricula, (err, sucesso) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (!sucesso) {
                return res.status(404).json({ message: "Vendedor não encontrado." });
            }
            res.json({ message: "Vendedor removido com sucesso." });
        });
    }
}

module.exports = new VendedorController();