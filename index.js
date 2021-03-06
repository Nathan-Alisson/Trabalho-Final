import http from 'http';
import express from 'express';
import rotaContaPagar from './routes/contaPagar.js';
import rotaPlanoConta from './routes/planoContas.js';

const port = 3000;
const host = "localhost";

const app = express();
app.use('/contapagar', rotaContaPagar);
app.use('/planocontas', rotaPlanoConta);

app.use(express.static('./public'));

const servidor = http.createServer(app);


servidor.listen(port, host, () => {
    console.log(`Servidor: \nhttp://${host}:${port}/contasapagar.html \nhttp://${host}:${port}/planocontas.html`);
});
