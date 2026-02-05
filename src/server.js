const express = require(`express`);
const {pool} = require(`./config/db`);
const app = express();

app.get(`/cuponsFiscais`, async (req, res) => 
    {
    const [rows] = await pool.execute(`SELECT * FROM cuponsFiscais`);
    if(rows == 0){
        return res.status(404).json({error: `Não há cupons cadastrados!`});
    }
    }
)

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