export default class Client{
    #code;  #name;  #rg;    #cpf; #date
    #tel;   #email; #city;  #uf

    constructor(code, name, rg, cpf, date, tel, email, city, uf){
        this.#code      = code;
        this.#name      = name;
        this.#rg        = rg;
        this.#cpf       = cpf;
        this.#date      = date;
        this.#tel       = tel;
        this.#email     = email;
        this.#city      = city;
        this.#uf        = uf;
    }

    // ===============================# Código
    get code() {return this.#code;}
    set code(value){
        this.#code = value;
    }

    // ===============================# Nome
    get name(){return this.#name;}
    set name(value){
        this.#name = value;
    }

    // ===============================# RG
    get rg(){return this.#rg;}
    set rg(value){
        this.#rg = value;
    }

    // ===============================# CPF
    get cpf(){return this.#cpf;}
    set cpf(value){
        this.cpf = value;
    }

    // ===============================# Data de Nascimento
    get date(){return this.#date;}
    set date(value){
        this.date = value;
    }

    // ===============================# Telefone
    get tel(){return this.#tel;}
    set tel(value){
        this.tel = value;
    }

    // ===============================# E-mail
    get email(){return this.#email;}
    set email(value){
        this.email = value;
    }

    // ===============================# Cidade
    get city(){return this.#city;}
    set city(value){
        this.#city = value;
    }

    // ===============================# UF
    get uf(){return this.#uf;}
    set uf(value){
        this.#uf = value;
    }

    toJSON(){
        return {
            "code":     this.#code,
            "name":     this.#name,
            "rg":       this.#rg,
            "cpf":      this.#cpf,
            "date":     this.#date,
            "tel":      this.#tel,
            "email":    this.#email,
            "city":     this.#city,        
            "uf":       this.#uf            
        }
    }
}