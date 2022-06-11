import {MongoClient, ObjectId} from 'mongodb';

import ContaPagar from '../models/contaPagar.js';

const uriBancoDados = "mongodb://localhost:27017";
const baseDados = 'TrabFinal';
const colecao = "contasPagar";

export default class ContaPagarDB{

    constructor(){
        this.contaPagarMongo = new MongoClient(uriBancoDados);
    }
//------------------------------------------------------------------------------------------------------------------------------------------------
    async incluir(contaPagar){
        if (contaPagar instanceof ContaPagar){
            try{
                await this.contaPagarMongo.connect();
                const resultado = await this.contaPagarMongo.db(baseDados).collection(colecao).insertOne({"num_doc": contaPagar.num_doc, "valor": contaPagar.valor, "vencimento": contaPagar.vencimento, "multa": contaPagar.multa, "juros" : contaPagar.juros, "data_pgto": contaPagar.data_pgto, "id_conta": contaPagar.id_conta});
                contaPagar.id = resultado.insertedId.toString();
            }catch(e){
                console.error(e);
            }
            finally{
                await this.contaPagarMongo.close();
            }
        }

    }
//------------------------------------------------------------------------------------------------------------------------------------------------
    async atualizar(contaPagar){
        if (contaPagar instanceof ContaPagar){
            try{
                await this.contaPagarMongo.connect();
                const identificador = new ObjectId(contaPagar.id);
                const resultado = await this.contaPagarMongo.db(baseDados).collection(colecao).updateOne({'_id': identificador}, {"$set": contaPagar.toJSON()});
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
                await this.contaPagarMongo.close();
            }
        }

    }
//------------------------------------------------------------------------------------------------------------------------------------------------------   
    async excluir(contaPagar){
        if (contaPagar instanceof ContaPagar){
            try{
                await this.contaPagarMongo.connect();
                const identificador = new ObjectId(contaPagar.id);
                const resultado = await this.contaPagarMongo.db(baseDados).collection(colecao).deleteOne({'_id': identificador});
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
                await this.contaPagarMongo.close();
            }
        }

    }
//--------------------------------------------------------------------------------------------------------------------------------------------------
    async consultarPorID(id){
        try{
            await this.contaPagarMongo.connect();
            const identificador = new ObjectId(id);
            const resultadoBusca = await this.contaPagarMongo.db(baseDados).collection(colecao)
            .findOne({"_id": identificador});
            if (resultadoBusca){
                const contaPagarBuscado = new ContaPagar(resultadoBusca._id,
                                            resultadoBusca.num_doc,
                                            resultadoBusca.valor,
                                            resultadoBusca.vencimento,
                                            resultadoBusca.multa,
                                            resultadoBusca.juros,
                                            resultadoBusca.data_pgto,
                                            resultadoBusca.id_conta);
                return contaPagarBuscado;    
            }
        }catch(e){
            console.error(e);
        }finally{
            this.contaPagarMongo.close();
        }
    }
//--------------------------------------------------------------------------------------------------------------------------------------------------
    async consultarPorNumDoc(num_doc){
        try{
            await this.contaPagarMongo.connect();
            const cursor = await this.contaPagarMongo.db(baseDados).collection(colecao)
            .find({"num_doc":{"$regex":num_doc}});
            const resultados = await cursor.toArray();
            const listaContaPagar = [];
            if (resultados){
                resultados.forEach((resultado) => {
                    const contaPagar = new ContaPagar(resultado._id,
                                            resultado.num_doc,
                                            resultado.valor,
                                            resultado.vencimento,
                                            resultado.multa,
                                            resultado.juros,
                                            resultado.data_pgto,
                                            resultado.id_conta);
                    listaContaPagar.push(contaPagar);
                });
            }
            return listaContaPagar;

        }catch(e){
            console.error(e);
        }finally {
            this.contaPagarMongo.close();
        }
    }
}

