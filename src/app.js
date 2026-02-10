// aqui ficam as configurações da aplicação, como rotas e middlewares

const express = require('express');
const app = express();
const {testConnection} = require(`./config/db`);
const serverRoutes = require(`./server`);

try{
    app.use(express.json());
    
    app.get(`/`, (req, res) => //rota principal: (https://localhost/3001:{rota})
        res.send(
            {status: `ok`, message: `Funcionando`}
        )  
    );
    
    app.use(`/`, serverRoutes);
    
    async function verificarDB() {
        const resultado = await testConnection();
        console.log(resultado.message);
    }
    
    verificarDB();
    
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).json({error: err.message || `Erro Interno`});
    });
} catch(error){
    console.error(`Problema no App.js, erro:`, error);
}

module.exports = app;

/*
===============================================
============== ROTAS DA AULA ==================

app.get(`/`, (req, res) => //rota principal: (https://localhost/3001:{rota})
    res.send(
        {status: `ok`, message: `Funcionando`}
    )  
);

app.get(`/professores`, (req, res) =>
    res.send(
        {
            nome: `Lucas Sasse`,
            disciplines: [`Logica de Programação`, `Modelagem de Sistemas`]
        }
    )
);

app.get(`/alunos/programacao-de-aplicativos`, (req, res) =>
    res.send(
        {alunos: [`João`, `Daniel`, `Luan`, `Lucas`]}
    )
);

app.get(`/alunos/programacao-de-aplicativos/notas`, (req, res) => 
    res.send(
        {
            alunos: [
                {nome: `Joao`, nota: 7.5},
                {nome: `Daniel`, nota: 9.0},
                {nome: `Lucas`, nota: 8.5},
                {nome: `Luan`, nota: 9.0}                
            ]
        }
    )
);

*/