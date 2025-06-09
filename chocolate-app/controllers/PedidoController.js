const PedidoDAO = require("../daos/PedidoDAO"); 
const ProdutoDAO = require("../daos/ProdutoDAO")

class PedidoController {

    index(req, res) {
        PedidoDAO.findall(req.query.clienteId, (err, pedidos) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(pedidos);
        });
    }

    show(req, res) {
        const id = req.params.id;
        PedidoDAO.findById(id, (err, pedido) => {
            if (err) return res.status(500).json({ error: err.message });
            if (pedido) {
                res.json(pedido);
            } else {
                res.status(404).json("Pedido não encontrado.");
            }
        });
    }

    create(req, res) {
        const { fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade } = req.body;

        if (fk_matricula_vendedor === undefined || fk_id_cliente === undefined || fk_id_produto === undefined || quantidade === undefined) {
            return res.status(400).json({ error: "Campos fk_matricula_vendedor, fk_id_cliente, fk_id_produtoe e quantidade são obrigatórios." });
        }
        ProdutoDAO.findById(fk_id_produto,(err,produto) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!produto) return res.status(404).json({message: "Produto não encontrado"})
            if (produto.estoque<quantidade){
                return res.status(400).json({message: "Estoque insuficiente para o pedido"})
            }

            const valor_total = produto.preco*quantidade      

            PedidoDAO.create(fk_matricula_vendedor, fk_id_cliente, fk_id_produto, quantidade, valor_total, (err, pedido) => { 
            if (err) return res.status(500).json({ error: err.message });
            ProdutoDAO.atualizarEstoque(fk_id_produto,quantidade,(errUpdateEstoque,sucessoUpdateEstoque)=> {
                if(errUpdateEstoque){
                    return res.status(201).json({message:"Pedido criado com sucesso, mas falha ao atualiazar o estoque, fazer atualização manual."})
                }if(sucessoUpdateEstoque) return  res.status(201).json({
                    message: "Pedido realizado e estoque atualizado.",
                    pedido :pedido})  
            })
            
        });
        
        })
    }

    update(req, res) {
        const { quantidade, valor_total } = req.body;
        const id = req.params.id; 

        PedidoDAO.update(id, quantidade, valor_total, (err, pedido) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!pedido) return res.status(404).json({error:err.message});
            res.json({ message: "Pedido atualizado com sucesso." });
        });
    }

    delete(req, res) {
        const id = req.params.id;
        PedidoDAO.findById(id, (err, pedido) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!pedido) {               
                res.status(404).json("Pedido não encontrado.")
                
            }

            const quantidade = -pedido.quantidade;
            const fk_id_produto = pedido.fk_id_produto;

            ProdutoDAO.findById(fk_id_produto,(err,produto) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!produto) return res.status(404).json({message: "Produto não encontrado"})
                    PedidoDAO.delete(id, (err, pedido) => { 
                        if (err) return res.status(500).json({ error: err.message });
                        if (!pedido) return res.status(404).json({ error: err.message }); 
                        ProdutoDAO.atualizarEstoque(fk_id_produto,quantidade,(errUpdateEstoque,sucessoUpdateEstoque)=> {
                            if(errUpdateEstoque){
                                return res.status(201).json({message:"Pedido criado com sucesso, mas falha ao atualiazar o estoque, fazer atualização manual."})
                            }if(sucessoUpdateEstoque) return  res.status(201).json({
                                message: "Pedido removido com sucesso e estoque atualizado.",
                                pedido :pedido})  });
                             });

                    });        
    }
)}
}
module.exports = new PedidoController();