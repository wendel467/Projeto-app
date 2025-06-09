const ProdutoDAO = require("../daos/ProdutoDAO");

class ProdutoController {

    index(req, res) {
        ProdutoDAO.findall(req.query.nome, (err, produtos) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(produtos);
        });
    }

    show(req, res) {
        const id = req.params.id;
        ProdutoDAO.findById(id, (err, produto) => {
            if (err) return res.status(500).json({ error: err.message });
            if (produto) {
                res.json(produto);
            } else {
                res.status(404).json({ message: "Produto não encontrado." }); 
            }
        });
    }

    create(req, res) {
        const { nome, marca, peso, preco, estoque, disponivel_venda } = req.body;

        if (!nome || !peso || !preco || !estoque) {
            return res.status(400).json({ error: "Campos nome, peso, preco e estoque são obrigatórios." });
        }

        const parsedPeso = parseFloat(peso);
        const parsedPreco = parseFloat(preco);
        const parsedEstoque = parseInt(estoque, 10);
        const parsedDisponivelVenda = disponivel_venda !== undefined ? parseInt(disponivel_venda, 10) : 1;


    if (isNaN(parsedPeso) || isNaN(parsedPreco) || isNaN(parsedEstoque) || isNaN(parsedDisponivelVenda)) {
            return res.status(400).json({ error: "Campos peso, preco e estoque devem ser numéricos."});
        }

        ProdutoDAO.create(nome, marca, parsedPeso, parsedPreco, parsedEstoque,parsedDisponivelVenda, (err, produto) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(produto);
        });
    }

    update(req, res) {
        const { preco, estoque, disponivel_venda } = req.body;
        const id = req.params.id;

        ProdutoDAO.update(id, parseFloat(preco), parseInt(estoque, 10), parseInt(disponivel_venda, 10), (err, produto) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado ou nenhuma alteração realizada." });
            }
            res.json({ message: "Produto atualizado com sucesso." });
        });
    }

    delete(req, res) {
        const id = req.params.id;

        ProdutoDAO.delete(id, (err, produto) => { 
            if (err) return res.status(500).json({ error: err.message });
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }
            res.json({ message: "Produto removido com sucesso." });
        });
    }
}

module.exports = new ProdutoController(); 