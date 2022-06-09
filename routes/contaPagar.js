import express from 'express';
import ContaPagarDB from '../persistence/contaPagarDB.js';
import ContaPagar from '../models/contaPagar.js';


const rotaPets = express.Router();


rotaPets.use(express.json());
const petDB = new PetDB();


//----------------------------------------------------------------------------------------------
rotaPets.route('/:id?') // o ponto de interrogação define que o id não é obrigatório
.get((req, resp) => {
    if (req.params.id)
    {
        petDB.consultarPorID(req.params.id).then((pet) => {
            resp.statusCode = 200; //resposta de sucesso
            resp.setHeader("Content-Type", "application/json");   
            resp.json(pet.toJSON());
        });       
    }
    else
    {
        petDB.consultarPorNome("").then((pets) => {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json")
            resp.json(pets.map((pet) => {
                return pet.toJSON();
            }));
        });
    }
})

//-------------------------------------------------------------------------------------------------


.post((req, resp) => {
    if (req.params.id){

        resp.statusCode = 405;
        resp.setHeader("Content-Type", "application/json") 
        resp.json({
            "status": "405 - Não permitido",
            "mensagem" : "Para cadastrar um animal, não se deve informar um id na url!"
        });
    }
    else{
        const dados     = req.body;
        const rga       = dados.rga;
        const nome      = dados.nome;
        const especie   = dados.especie;
        const raca      = dados.raca;
        const datanasc  = dados.datanasc;
        if (rga && nome && especie && raca && datanasc){
           const pet = new Pets(0, rga, nome, especie, raca, datanasc);
           petDB.incluir(pet).then(() => {
               resp.statusCode = 200;
               resp.setHeader("Content-Type", "application/json");
               resp.json({
                   "status":"200 - Incluído com sucesso",
                   "id": pet.id
               })
           }); 
        }
        else {
            resp.statusCode = 405;
            resp.setHeader("Content-Type", "application/json") 
            resp.json({
                "status": "405 - Não permitido",
                "mensagem" : "Para cadastrar um animal, informe corretamente o RGA, nome, especie, raça e data de nascimento!"
            });
        }       
    }
})
//-------------------------------------------------------------------------------------------------------------------------------------   


.put((req, resp) => {
    if (req.params.id){
        const dados     = req.body;
        const rga       = dados.rga;
        const nome      = dados.nome;
        const especie   = dados.especie;
        const raca      = dados.raca;
        const datanasc  = dados.datanasc;
        if (rga && nome && especie && raca && datanasc){
           const pet = new Pets(req.params.id, rga, nome, especie, raca, datanasc);
           petDB.atualizar(pet).then((resultado)=>{
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(resultado);
           }); 
        }
        else {
            resp.statusCode = 405;
            resp.setHeader("Content-Type", "application/json") 
            resp.json({
                "status": "405 - Não permitido",
                "mensagem" : "Para atualizar um animal, informe corretamente o RGA, nome, especie, raça e data de nascimento!"
            });
        }       
    }
    else{
        resp.statusCode = 405;
        resp.setHeader("Content-Type", "application/json")
        resp.json({
            "status": "405 - Não permitido",
            "mensagem" : "Para atualizar um animal, informe o id na url de requisição!"
        });
    }    
})

//-----------------------------------------------------------------------------------------------------------------------------------

.delete((req, resp) => {
    if (req.params.id){
        const pet = new Pets(req.params.id,"", "", "", "", "");
        petDB.excluir(pet).then((resultado)=>{
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json")
            resp.json(resultado);
        });
    }

    else{
        resp.statusCode = 405;
        resp.setHeader("Content-Type", "application/json")
        resp.json({
            "status": "405 - Não permitido",
            "mensagem" : "Para excluir um animal cadastrado, informe o id na url de requisição!"
        });
    }    
});

export default rotaPets;
