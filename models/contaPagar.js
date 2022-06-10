export default class ContaPagar {
    //definição dos atributos desta classe
    #id
    #num_doc
    #valor
    #vencimento
    #multa
    #juros
    #data_pgto
    #id_conta    

    constructor(id,num_doc,valor,vencimento,multa,juros,data_pgto,id_conta){
        this.#id = id;
        this.#num_doc = num_doc;
        this.#valor = valor;
        this.#vencimento = vencimento;
        this.#multa = multa;
        this.#juros = juros;
        this.#data_pgto = data_pgto;
        this.#id_conta = id_conta;
    }
    get id(){
        return this.#id;
    }
    set id(novoId){
        this.#id = novoId;
//-------------------------------------------------        
    }
    get num_doc(){
        return this.#num_doc;
    }
    set num_doc(novoNum_doc){
        this.#num_doc = novoNum_doc;
    }
//------------------------------------------------- 
    get valor(){
        return this.#valor;
    }
    set valor(novoValor){
        this.#valor = novoValor;
    }
//-------------------------------------------------     
    get vencimento(){
        return this.#vencimento;
    }
    set vencimento(novoVencimento){
        this.#vencimento = novoVencimento;
    }
//-------------------------------------------------     
    get multa(){
        return this.#multa;
    }
    set multa(novaMulta){
        this.#multa = novaMulta;
    }
//------------------------------------------------- 
    get juros(){
        return this.#juros;
    }
    set juros(novaJuros){
        this.#juros = novaJuros;
    }
//------------------------------------------------- 
    get data_pgto(){
        return this.#data_pgto;
    }
    set data_pgto(novaData_pgto){
        this.#data_pgto = novaData_pgto;
    }
//-------------------------------------------------
    get id_conta(){
        return this.#id_conta;
    }
    set id_conta(novoId_conta){
        this.#id_conta = novoId_conta;
    }


    toJSON(){
        return{
            "id"            : this.#id,
            "num_doc"       : this.#num_doc,
            "valor"         : this.#valor,
            "vencimento"    : this.#vencimento,
            "multa"         : this.#multa,
            "juros"         : this.#juros,
            "data_pgto"     : this.#data_pgto,
            "id_conta"      : this.#id_conta
        }
    }
}