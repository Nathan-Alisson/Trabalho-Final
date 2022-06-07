import {MongoClient, ObjectId} from 'mongodb';

import Client from '../models/client.js';

const uriDatabase = "mongodb://localhost:27017";
const baseDados = 'bsclient';
const table = "clients";

export default class clientDB{
    constructor(){
        this.clientMongo = new MongoClient(uriDatabase);
    }

    async include(client){
        if (client instanceof Client){
            try{
                await this.clientMongo.connect();
                const result = await this.clientMongo.db(baseDados).collection(table)
                .insertOne({"name"  : client.name,
                            "rg"    : client.rg, 
                            "cpf"   : client.cpf, 
                            "date"  : client.date,
                            "tel"   : client.tel,
                            "email" : client.email,
                            "city"  : client.city,
                            "uf"    : client.uf
                        });
                client.code = result.insertedId.toString();

            }catch(e){
                console.error(e);
            }
            finally{
                await this.clientMongo.close();
            }
        }
    }

    async update(client){
        if (client instanceof Client){
            try{
                await this.clientMongo.connect();
            const identifier = new ObjectId(client.code);
                const result = await this.clientMongo.db(baseDados).collection(table)
                .updateOne({'_id':identifier},{"$set":{   "name"  : client.name,
                                                          "rg"    : client.rg, 
                                                          "cpf"   : client.cpf, 
                                                          "date"  : client.date,
                                                          "tel"   : client.tel,
                                                          "email" : client.email,
                                                          "city"  : client.city,
                                                          "uf"    : client.uf
                                                        }});
                if (result.modifiedCount > 0){
                    return {
                        "resultado": "Cliente atualizado"
                    }
                }
                else{
                    return {
                        "resultado": "Cliente não atualizado"
                    }
                }
            }catch(e){
                console.error(e);
            }finally{
                await this.clientMongo.close();
            }

        }
    }

    async delete(client){
        if (client instanceof Client){
            try{
                await this.clientMongo.connect();
                const identifier = new ObjectId(client.code);
                const result = await this.clientMongo.db(baseDados).collection(table)
                .deleteOne({'_id':identifier});
                if (result.deletedCount > 0){
                    return {
                        "resultado":true
                    }
                }
                else{
                    return {
                        "resultado":false
                    }
                }
            }catch(e){
                console.error(e);
            }finally{
                await this.clientMongo.close();
            }

        }

    }

    async consultCode(id){
        try{
            await this.clientMongo.connect();
            const identifier = new ObjectId(id);
            const result = await this.clientMongo.db(baseDados).collection(table).findOne({"_id":identifier});
            
            if (result){
                const client = new Client(result.code,
                                          result.name,
                                          result.rg,
                                          result.cpf,
                                          result.date,
                                          result.tel,
                                          result.email,
                                          result.city,
                                          result.uf
                                          );
                return client;
            } 
        }catch(e){
            console.error(e);
        }finally{
            await this.clientMongo.close();
        }

    }

    async consultName(name){
        try{
            await this.clientMongo.connect();
            const cursor = this.clientMongo.db(baseDados).collection(table).find({"name":{"$regex":name}});
            const itens = await cursor.toArray();

            let itensList = [];
            if (itens){
                itens.forEach((client) => {
                    const item = new Client(client._id,
                                            client.name,
                                            client.rg,
                                            client.cpf,
                                            client.date,
                                            client.tel,
                                            client.email,
                                            client.city,
                                            client.uf,
                                            );
                    itensList.push(item);
                });
            }
            return itensList;

        }catch(e){
            console.error(e);
        }finally{
            await this.clientMongo.close();
        }
    }
}


