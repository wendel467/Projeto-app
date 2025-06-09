const fs = require("fs");
const path = require("path");
const RelatorioDAO = require("../daos/RelatorioDAO");
const { error } = require("console");

const caminho_relatorios_estaticos = path.join(__dirname,"..", "relatorios");
const nome_relatorio_top5_vendas = "Relatorio_5_produtos_mais_vendidos.json";
const caminho_completo_arquivo_top5 = path.join(caminho_relatorios_estaticos,nome_relatorio_top5_vendas);

const nome_relatorio_cliente = "Relatorio_de_compras_do_cliente.json";
const caminho_completo_arquivo_cliente = path.join(caminho_relatorios_estaticos,nome_relatorio_cliente);

const nome_relatorio_gasto_medio_do_cliente = "Relaotio_de_gasto_medio_do_cliente.json";
const caminho_comleto_arquivo_gasto_medio_do_cliente = path.join(caminho_relatorios_estaticos,nome_relatorio_gasto_medio_do_cliente);

const nome_relatorio_estoque_baixo = "Relatorio_de_estoque_baixo.json";
const caminho_completo_arquivo_estoque_baixo = path.join(caminho_relatorios_estaticos,nome_relatorio_estoque_baixo);

class RelatorioController {

    getMaisVendido(req,res){
        const limite = 5
        RelatorioDAO.getMaisVendido(limite,(err,produtos) =>{
        if (err) return res.status(500).json({error:err.message});
        if (!produtos || produtos.length === 0) return res.status(404).json({message:"Nenhum produto vendido encontrado."})
        const relatorio_conteudo = {
            relatorio: "Top 5 mais vendidos",
            data_gerada: new Date().toISOString(),
            dados: produtos }
        const jsonData = JSON.stringify(relatorio_conteudo,null,2);

        try{
            fs.writeFileSync(caminho_completo_arquivo_top5,jsonData,"utf-8");
            console.log(`Relatorio mais vendidos gerado em: ${caminho_completo_arquivo_top5}`);
            res.status(200).json({message:"Relatorio criado"});
        }catch(saveErr){
            console.error("Erro ao salvar relatorio",saveErr.message);
            res.status(500).json({error:"Falha ao salvar o relatorio:"+ saveErr.message})
        }
    });
    }

    getComprasPorCliente(req,res){
        const clientId =req.params.id
        RelatorioDAO.getComprasPorCliente(clientId,(err,cliente)=>{
            if(err) return res.status(500).json({error:err.message});
            if(!cliente || cliente.length === 0 ) return res.status(404).json("Não há compras para o clinete ou cliente não encontrado");
            const relatorio_conteudo_cliente = {
                relatorio: "Todas as compras do cliente",
                data_gerada: new Date().toISOString(),
                dados: cliente
            }

            const jsonData = JSON.stringify(relatorio_conteudo_cliente,null,2)
            
            try{
                fs.writeFileSync(caminho_completo_arquivo_cliente,jsonData,"utf-8");
                console.log(`Relatorio total de compras do cliente gerado em: ${caminho_completo_arquivo_cliente}`);
                res.status(200).json({message: "Relatorio criado"})
            }catch(saveErr){
            console.error("Erro ao salvar relatorio",saveErr.message);
            res.status(500).json({error:"Falha ao salvar o relatorio:"+ saveErr.message})
        }
        })
    }

    getCustoMedioPorCliente(req,res){
        const clienteId = req.params.id
        RelatorioDAO.getCustoMedioPorCliente(clienteId,(err,cliente)=>{
            if (err) return res.status(500).json({error:err.message});
            if(!cliente || cliente.length === 0) return res.status(404).json("Não há compras para o clinete ou cliente não encontrado")
        
            const relatorio_gasto_medio_cliente = {
                relatorio: "Media de gasto do cliente",
                data_gerada: new Date().toISOString(),
                dados: cliente
            }
            const jsonData = JSON.stringify(relatorio_gasto_medio_cliente,null,2)

            try{
                fs.writeFileSync(caminho_comleto_arquivo_gasto_medio_do_cliente,jsonData,"utf-8");
                console.log(`Relatorio gasto medio do cliente gerado em ${caminho_comleto_arquivo_gasto_medio_do_cliente}.`);
                res.status(200).json({message: "Relatorio criado"});
            }catch(saveErr){
                console.error("Erro ao salvar relatorio",saveErr.message);
                res.status(500).json({error:"Falha ao salvar o relatorio:"+ saveErr.message})
        }})
    }
    getEstoqueBaixo(req,res){
        const estoqueMinimo = 10
        RelatorioDAO.getEstoqueBaixo(estoqueMinimo,(err,produtos)=>{
            if(err) return res.status(500).json({error:err.message});
            if(!produtos || produtos.length === 0) return res.status(404).json(`Não há produtos com estoque abaixo de ${estoqueMinimo}`)
            
            const relatorio_estoque_minimo = {
                relatorio : "Produtos com estoque baixo",
                data_gerada: new Date().toISOString(),
                dados: produtos
            }
            const jsonData = JSON.stringify(relatorio_estoque_minimo,null,2)

            try{
                fs.writeFileSync(caminho_completo_arquivo_estoque_baixo,jsonData,"utf-8");
                console.log(`Relatorio de estoque baixo gerado em ${caminho_completo_arquivo_estoque_baixo}.`);
                res.status(200).json({message: "Relatorio criado"})
            }catch(saveErr){
                console.error("Erro ao salvar relatorio",saveErr.message);
                res.status(500).json({error:"Falha ao salvar o relatorio:"+ saveErr.message})
        }
        })
    }
}
    
module.exports = new RelatorioController;