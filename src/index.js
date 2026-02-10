// arquivo de entrada principal e aplicação

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3001;

try{
    app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
    });
    
}catch(error){
    console.error(`Erro ao inicar o Server:`, error);
}
