const mysql = require(`mysql2/promise`); //importa mysql2 do package.json na variavel mysql
require(`dotenv`).config(); // importa e configura dotenv para ler o que está no arquivo .env

//pool de conexões (conecta cmo banco de dados) usando o .env
//pool: conjunto de conexoes que podem ser utilizadas

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function testConnection() {
    try{
        const connection = await pool.getConnection();
        await connection.ping(); //testa conexao se está ativa
        connection.release(); //libera conexao de volta para o pool
        return { sucess: true, message: `Conexão com banco bem sucedida!`};
    } catch (error){
        return {sucess: false, message: `Falha na Conexão: ${error.message}`};
    }
}

module.exports = {pool, testConnection};