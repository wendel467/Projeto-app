class Pedido {
    constructor(id,fk_matricula_vendedor,fk_id_cliente,fk_id_produto,quantidade ,valor_total){
        this.id = id;
        this.fk_matricula_vendedor = fk_matricula_vendedor;
        this.fk_id_cliente = fk_id_cliente;
        this.fk_id_produto = fk_id_produto;
        this.quantidade  = quantidade ;
        this.valor_total  = valor_total ;
    }
}
module.exports = Pedido;