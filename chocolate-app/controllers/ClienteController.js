const ClienteDAO = require("../daos/ClienteDAO");

class ClienteController {
    index(req,res){
        ClienteDAO.findall(req.query.nome,(err,clientes) =>{
        if (err) return res.status(500).json({error:err.message});
        res.json(clientes);
    });
    }
    show(req,res) {
    const id = req.params.id;
    ClienteDAO.findById(id, (err,cliente) =>{
        if(err) return res.status(500).json({error: err.message});
        if (cliente) {
            res.json(cliente);
        }else{
            res.status(404).json("cliente não encontrado.");
        }
    });    
    }
    create(req,res) {
    const { nome, email, telefone,endereco,cpf } = req.body;
    if (!nome || !email ||!telefone ||!endereco ||!cpf){
        return res.status(400).json({error:"Campos nome,email, telefone, endereco e cpf são obrigatorios"});
    }
    ClienteDAO.create(nome,email,telefone,endereco,cpf,(err,cliente)=>{
        if (err) return res.status(500).json({error: err.message});
        res.status(201).json(cliente);
    });        
    }
    update(req,res) {
    const {nome, email, telefone,endereco} = req.body;
    const id = req.params.id;

    ClienteDAO.update(id,nome,email,telefone,endereco,(err,cliente)=>{
        if (err) return res.status(500).json({error:err.message});
        if (!cliente) return res.status(404).json({error:err.message});
        res.json({ message: "Cliente atualizado com sucesso." });        
    });
    }
    delete(req,res) {
        
    const id = req.params.id;

    ClienteDAO.delete(id,(err,cliente)=>{
        if(err) return res.status(500).json({error: err.message});
        if(!cliente) return res.status(404).json({error:err.message});
        res.json({message:" cliente removido com sucesso"});
    });
    }
}
    

module.exports = new ClienteController;