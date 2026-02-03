// arquivo de entrada principal e aplicação

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});