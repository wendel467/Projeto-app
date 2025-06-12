class Cliente {
    constructor(id,nome,email,telefone,endereco,cpf,valorGasto){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
        this.cpf = cpf;
        this.valorGasto = valorGasto;
    }
}

module.exports = Cliente;