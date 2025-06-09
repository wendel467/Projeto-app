class Produto {
    constructor(id,nome,marca,peso,preco ,estoque,disponivel_venda){
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.peso = peso;
        this.preco  = preco ;
        this.estoque  = estoque ;
        this.disponivel_venda  = disponivel_venda ;
    }
}
module.exports = Produto;