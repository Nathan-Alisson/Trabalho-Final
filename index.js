import http from 'http';
import express from 'express';
import rotaContaPagar from './routes/contaPagar.js';

const port = 3000;
const host = "localhost";

const app = express();
app.use('/contapagar', rotaContaPagar);


const servidor = http.createServer(app);


servidor.listen(port, host, () => {
    console.log(`Servidor: \nhttp://${host}:${port}/contapagar \nhttp://${host}:${port}/planodecontas`);
});
