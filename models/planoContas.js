export default class PlanoContas{
    #id 
    #descricao
    #id_fornecedor
    #id_contaPagar
//    #id_contaPagar
    constructor(id,descricao,id_fornecedor,id_contaPagar){
        this.#id = id;
        this.#descricao = descricao;
        this.#id_fornecedor = id_fornecedor;
        this.#id_contaPagar = id_contaPagar;
    }

    // **** ID ****
    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    // **** Descrição ***
    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDescricao){
        this.#descricao = novaDescricao;
    }

    // **** ID Fornecedor ****
    get id_fornecedor(){
        return this.#id_fornecedor;
    }

    set id_fornecedor(novoIdFornecedor){
        this.#id_fornecedor = novoIdFornecedor;
    }

    get id_contaPagar(){
        return this.#id_contaPagar;
    }

    set id_contaPagar(novoId_contaPagar){
        this.#id_contaPagar = novoId_contaPagar;
    }

    toJSON(){
        return {
            "id":this.#id,
            "descricao":this.#descricao,
            "id_fornecedor":this.#id_fornecedor,
            "id_contaPagar":this.#id_contaPagar.map((contaPagar) => {return contaPagar.toJSON()})            
        }
    }
    toJSON2(){
        return {
            "id":this.#id,
            "descricao":this.#descricao,
            "id_fornecedor":this.#id_fornecedor            
        }
    }
}