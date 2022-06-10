import express from 'express';
import ContaPagarDB from '../persistence/contaPagarDB.js';
import ContaPagar from '../models/contaPagar.js';


const rotaContaPagar = express.Router();


rotaContaPagar.use(express.json());
const contaPagarDB = new ContaPagarDB();


//----------------------------------------------------------------------------------------------
rotaContaPagar.route('/:id?') // o ponto de interrogação define que o id não é obrigatório
.get((req, resp) => {
    if (req.params.id)
    {
        contaPagarDB.consultarPorID(req.params.id).then((contaPagar) => {
            resp.statusCode = 200; //resposta de sucesso
            resp.setHeader("Content-Type", "application/json");   
            resp.json(contaPagar.toJSON());
        });       
    }
    else
    {
        contaPagarDB.consultarPorNumDoc("").then((contasPagar) => {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json")
            resp.json(contasPagar.map((contaPagar) => {
                return contaPagar.toJSON();
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
            "mensagem" : "Para cadastrar uma Conta, não se deve informar um id na url!"
        });
    }
    else{
        const dados         = req.body;
        const num_doc       = dados.num_doc;
        const valor         = dados.valor;
        const vencimento    = dados.vencimento;
        const multa         = dados.multa;
        const juros         = dados.juros;
        const data_pgto     = dados.data_pgto;

        if (num_doc && valor && vencimento && multa && juros && data_pgto){
           const contaPagar = new ContaPagar(0, num_doc, valor, vencimento, multa, juros, data_pgto);
           contaPagarDB.incluir(contaPagar).then(() => {
               resp.statusCode = 200;
               resp.setHeader("Content-Type", "application/json");
               resp.json({
                   "status":"200 - Incluído com sucesso",
                   "id": contaPagar.id
               })
           }); 
        }
        else {
            resp.statusCode = 405;
            resp.setHeader("Content-Type", "application/json") 
            resp.json({
                "status": "405 - Não permitido",
                "mensagem" : "Para cadastrar uma Conta, informe corretamente o Número do documento, valor, a data de vencimento, o valor da multa (se houver), os juros (se houver) e data do pagamento!"
            });
        }       
    }
})
//-------------------------------------------------------------------------------------------------------------------------------------   


.put((req, resp) => {
    if (req.params.id){
        const dados         = req.body;
        const num_doc       = dados.num_doc;
        const valor         = dados.valor;
        const vencimento    = dados.vencimento;
        const multa         = dados.multa;
        const juros         = dados.juros;
        const data_pgto     = dados.data_pgto;
        if (num_doc && valor && vencimento && multa && juros && data_pgto){
           const contaPagar = new ContaPagar(req.params.id, num_doc, valor, vencimento, multa, juros, data_pgto);
           contaPagarDB.atualizar(contaPagar).then((resultado)=>{
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
                "mensagem" : "Para atualizar uma conta, informe corretamente o Número do documento, valor, a data de vencimento, o valor da multa (se houver), os juros (se houver) e data do pagamento!"
            });
        }       
    }
    else{
        resp.statusCode = 405;
        resp.setHeader("Content-Type", "application/json")
        resp.json({
            "status": "405 - Não permitido",
            "mensagem" : "Para atualizar uma conta, informe o id na url de requisição!"
        });
    }    
})

//-----------------------------------------------------------------------------------------------------------------------------------

.delete((req, resp) => {
    if (req.params.id){
        const contaPagar = new ContaPagar(req.params.id,"", "", "", "", "", "");
        contaPagarDB.excluir(contaPagar).then((resultado)=>{
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
            "mensagem" : "Para excluir uma conta cadastrada, informe o id na url de requisição!"
        });
    }    
});

export default rotaContaPagar;
