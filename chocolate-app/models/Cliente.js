class Cliente {
    constructor(id,nome,email,telefone,endereço,cpf,valorGasto){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereço = endereço;
        this.cpf = cpf;
        this.valorGasto = valorGasto;
    }
}

module.exports = Cliente;