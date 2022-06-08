import http from 'http';
import express from 'express';
import rtClient from './routes/planoContas.js';

const port = 3000;
const host = "localhost";

const app = express();
app.use('/clients', rtClient);
app.use(express.static('./public'));

const servidor = http.createServer(app);
//Editado

servidor.listen(port, host, () => {
    console.log(`Servidor: \nhttp://${host}:${port}/contasapagar \nhttp://${host}:${port}/planodecontas`);
});




//teste italo