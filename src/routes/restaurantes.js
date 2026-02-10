const express = require(`express`);
const {pool} = require(`../config/db`);
const router = express.Router();

//==== GET ====

router.get(`/`, async (req, res) => {
    try{
        const [rows] = await pool.execute(`SELECT * FROM restaurantes`);
        res.json(rows);
        if(rows == 0){
            return res.status(404).json({error: `Não há restaurantes cadastrados!`});
        }
    }catch(error){
        console.error(`Erro ao consultar restaurantes: `, error);
        res.status(500).json({error: `Erro ao restaurantes`, details: error.message});
    }
}
)


//==== DELETES ====

router.delete(`/excluir-restaurantes-cnpj/:cnpj/permanente`, async (req, res) => {
    const cnpj = req.params.cnpj;
    try{
        const [rows] = await pool.execute(`SELECT * FROM restaurantes WHERE cnpj = ?`, [cnpj]);
        if(rows.length === 0){
            return res.status(404).json({error: `Restaurante não foi encontrado!`});
        }
        await pool.execute(`DELETE FROM restaurantes WHERE cnpj = ?`, [cnpj]);
        res.json({message: `Restaurante excluido com sucesso!`, id: cnpj});
    }catch(error){
        res.status();
    }
})

router.delete(`/excluir-restaurantes-nome-fantasia/:nomeFantasia/permanente`, async (req, res) => {
    const nomeFantasia = req.params.nomeFantasia;
    try{
        const [rows] = await pool.execute(`SELECT * FROM restaurantes WHERE nomeFantasia = ?`, [nomeFantasia]);
        if(rows.length === 0){
            return res.status(404).json({error: `Restaurante não foi encontrado!`});
        }
        await pool.execute(`DELETE FROM restaurantes WHERE cnpj = ?`, [nomeFantasia]);
        res.json({message: `Restaurante excluido com sucesso!`, id: nomeFantasia});
    }catch(error){
        res.status();
    }
})

module.exports = router;