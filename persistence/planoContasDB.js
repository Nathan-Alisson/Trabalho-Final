import {MongoClient, ObjectId} from 'mongodb';
import ContaPagar from '../models/contaPagar.js';
import PlanoContas from '../models/planoContas.js';

const uriDatabase = "mongodb://localhost:27017";
const baseDados = 'TrabFinal';
const colecao = "planoConta";

export default class planoContasDB{
    constructor(){
        this.planoContaMongo = new MongoClient(uriDatabase);
    }

    async incluir(planoContas){
        if (planoContas instanceof PlanoContas){
            try{
                await this.planoContaMongo.connect();
                const resultado = await this.planoContaMongo.db(baseDados).collection(colecao).insertOne({"descricao" : planoContas.descricao,"id_fornecedor" : planoContas.id_fornecedor});
                planoContas.id = resultado.insertedId.toString();

            }catch(e){
                console.error(e);
            }
            finally{
                await this.planoContaMongo.close();
            }
        }
    }

    async atualizar(planoContas){
        if (planoContas instanceof PlanoContas){
            try{
                await this.planoContaMongo.connect();
                const identificador = new ObjectId(planoContas.id);
                const resultado = await this.planoContaMongo.db(baseDados).collection(colecao).updateOne({'_id':identificador},{"$set": planoContas.toJSON()});
                
                if (resultado.modifiedCount > 0){
                    return {
                        "resultado": true
                    }
                }
                else{
                    return {
                        "resultado": false
                    }
                }
            }catch(e){
                console.error(e);
            }finally{
                await this.planoContaMongo.close();
            }

        }
    }

    async excluir(planoContas){
        if (planoContas instanceof PlanoContas){
            try{
                await this.planoContaMongo.connect();
                const identificador = new ObjectId(planoContas.id);
                const resultado = await this.planoContaMongo.db(baseDados).collection(colecao).deleteOne({'_id': identificador});
                if (resultado.deletedCount > 0){
                    return {
                        "resultado": true
                    }
                }
                else{
                    return {
                        "resultado": false
                    }
                }
            }catch(e){
                console.error(e);
            }finally{
                await this.planoContaMongo.close();
            }

        }

    }

    async consultarID(id){
        try{
            await this.planoContaMongo.connect();
            const identificador = new ObjectId(id);
            const itens = await this.planoContaMongo.db(baseDados).collection(colecao).findOne({"_id":identificador});
           

            let itensList = [];
            if (itens){
                           
                const buscaContaPagar = await this.planoContaMongo.db(baseDados).collection("contasPagar").find({"id_conta":{"$regex":id}}).toArray();
                let listaContaPagar = buscaContaPagar.map((docContaPagar) => {
                     return new ContaPagar(docContaPagar._id.toString(), docContaPagar.num_doc, docContaPagar.valor,docContaPagar.vencimento,docContaPagar.multa,docContaPagar.juros,docContaPagar.data_pgto);
                });
                const it = new PlanoContas( itens._id, 
                                            itens.descricao, 
                                            itens.id_fornecedor, 
                                            listaContaPagar);
                itensList.push(it);
            }
            return itensList;
        }catch(e){
            console.error(e);
        }finally{
            await this.planoContaMongo.close();
        }

    }

    async consultarDescricao(descricao){
        try{
            await this.planoContaMongo.connect();
            const cursor = this.planoContaMongo.db(baseDados).collection(colecao).find({"descricao":{"$regex":descricao}});
            const itens = await cursor.toArray();

            let itensList = [];
            if (itens){
            //    itens.forEach((planoContas) => {
                for (const planoContas of itens){
                    const buscaContaPagar = await this.planoContaMongo.db(baseDados).collection("contasPagar").find({"id_conta":planoContas._id.toString()}).toArray();
                    let listaContaPagar = buscaContaPagar.map((docContaPagar) => {
                        return new ContaPagar(docContaPagar._id.toString(), docContaPagar.num_doc, docContaPagar.valor,docContaPagar.vencimento,docContaPagar.multa,docContaPagar.juros,docContaPagar.data_pgto);
                    });
                    const item = new PlanoContas(planoContas._id,
                                            planoContas.descricao,
                                            planoContas.id_fornecedor,
                                            listaContaPagar);
                    itensList.push(item);
                }
            }
            return itensList;

        }catch(e){
            console.error(e);
        }finally{
            await this.planoContaMongo.close();
        }
    }
}
