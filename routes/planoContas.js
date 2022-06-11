import express from 'express';
import PlanoContas from '../models/planoContas.js';
import planoContasDB from '../persistence/planoContasDB.js';

const planoDeContas = express.Router();

planoDeContas.use(express.json());

const PlanoContasDB = new planoContasDB;

planoDeContas.route('/:id?')
.get((req,resp) => {
    if (req.params.id)
    {
        PlanoContasDB.consultarID(req.params.id).then((planoConta) => {
            resp.statusCode=200;  //sucesso  
            resp.setHeader("Content-Type","application/json");
            resp.json(planoConta.map((planoContas) => {
                return planoContas.toJSON();
            })); 
        });
    }
    else
    {
        PlanoContasDB.consultarDescricao("").then((planoConta) => {
            resp.statusCode=200;
            resp.setHeader("Content-Type","application/json");
            resp.json(planoConta.map((planoContas) => {
                return planoContas.toJSON();
            }));          
        })
    }

})

.post((req, resp) => {
     if (req.params.id)
     {
        resp.statusCode=405;
        resp.setHeader("Content-Type","application/json");
        resp.json({
            "status":"405 - Não Permitido!",
            "mensagem":"Para cadastrar, não se deve informar o id na url"
        }); 
    }
    else
    {
        const dados = req.body;
        const descricao = dados.descricao;
        const id_fornecedor = dados.id_fornecedor;
        const id_contaPagar = dados.id_contaPagar;
        if (descricao && id_fornecedor && id_contaPagar){
            const planoContas = new PlanoContas(0,descricao,id_fornecedor, id_contaPagar);
            PlanoContasDB.incluir(planoContas).then(() => {
                resp.statusCode=200;
                resp.setHeader("Content-Type","application/json");
                resp.json({
                    "status":"200 - Incluido com Sucesso",
                    "id": planoContas.id
                })
            });
        }
        else{
            resp.statusCode=405;
            resp.setHeader("Content-Type","application/json");
            resp.json({
                "status":"405 - Não Permitido!",
                "mensagem":"Para cadastrar, informe corretamento a descrição e o id do fornecedor"
            });
        }
    }               
})

.put((req,resp) => {
    if(req.params.id){
        const dados = req.body;
        const descricao = dados.descricao;
        const id_fornecedor = dados.id_fornecedor;
        const id_contaPagar = dados.id_contaPagar;
        if(descricao && id_fornecedor && id_contaPagar){
            const planoContas = new PlanoContas(req.params.id,descricao,id_fornecedor, id_contaPagar);
            PlanoContasDB.atualizar(planoContas).then((resposta) => {
                resp.statusCode=200;
                resp.setHeader("Content-Type","application/json");
                resp.json(resposta);
            });
        }
        else
        {
            resp.statusCode=405;
            resp.setHeader("Content-Type","application/json");
             resp.json({
                "status":"405 - Não Permitido!",
                "mensagem":"Para atualizar, informe corretamento a descrição e o id do fornecedor"
            });
        }
    }
    else{
        resp.statusCode = 405;
        resp.setHeader("Content-Type", "application/json")
        resp.json({
            "status": "405 - Não permitido",
            "mensagem" : "Para atualizar um plano de conta, informe o id na url de requisição!"
        });
    }    
})

.delete((req,resp) => { 
    if(req.params.id){
        const planoContas = new PlanoContas(req.params.id,"","","");
        PlanoContasDB.excluir(planoContas).then((resultado) => {
            resp.statusCode=200;
            resp.setHeader("Content-Type","text/html");
            resp.json(resultado);    
        })
    }
    else
    {
        resp.statusCode=200;
        resp.setHeader("Content-Type","text/html");
        resp.json({
            "status":"405 - Não Permitido!",
            "mensagem":"Para excluir, informe o id na url de requisição"
        });
    }
});

// **** Chave estrangeira ****

/*function insert (id_fornecedor){
        $sql = "INSERT INTO Fornecedor (id_fornecedor, id_conta)";
}*/

export default planoDeContas;