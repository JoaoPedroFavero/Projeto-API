const express = require(`express`);
// Importa o framework Express para criar o servidor e gerenciar rotas.

const { pool } = require(`../config/db`);
// Importa o objeto "pool" do arquivo config/db.js, que gerencia a conexão com o banco de dados MySQL.

const { validator } = require('cpf-cnpj-validator');
// Importa o validador de CPF/CNPJ.

const Joi = require('@hapi/joi').extend(validator);
// Importa o Joi (biblioteca de validação) e o estende com o validador de CPF/CNPJ.

// Definição do Schema (Valida Nome e a regra matemática do CPF)
const clienteSchema = Joi.object({
    nome: Joi.string().trim().max(50).required(),
    // Valida que o nome é uma string, sem espaços extras, máximo 50 caracteres e obrigatório.

    // Forçamos o uso do validador de CPF da extensão
    cpf: Joi.document().cpf().required().messages({
        'document.cpf': 'O CPF informado é inválido.'
        // Valida que o CPF é obrigatório e segue a regra matemática correta, não aceitando qualquer numero aleatorio.
    })
});
const router = express.Router();
// Cria um roteador do Express para organizar as rotas de "clientes".

//==== GET ====

// Rota para listar todos os clientes
router.get(`/`, async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes`);
        // Executa consulta SQL para buscar todos os clientes.
        if (rows.length === 0) {
            return res.status(404).json({ error: `Não há clientes cadastrados!` });
        }
        res.json(rows);
        // Retorna todos os clientes encontrados.
    } catch (error) {
        console.error(`Erro ao consultar clientes: `, error);
        res.status(500).json({ error: `Erro ao consultar clientes`, details: error.message });
    }
});

// Rota para buscar cliente pelo CPF
router.get(`/cpf/:cpf`, async (req, res) => {
    const cpf = req.params.cpf;
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);
        if (rows.length === 0) {
            return res.status(404).json({ error: `Esse cliente não tem cadastrado!` });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(`Erro ao consultar clientes: `, error);
        res.status(500).json({ error: `Erro ao consultar clientes`, details: error.message });
    }
});

//==== DELETES ====

// Excluir cliente pelo CPF
router.delete(`/excluir-clientes-cpf/:cpf/permanente`, async (req, res) => {
    const cpf = req.params.cpf;
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);
        if (rows.length === 0) {
            return res.status(404).json({ error: `Cliente não foi encontrado!` });
        }
        await pool.execute(`DELETE FROM clientes WHERE cpf = ?`, [cpf]);
        res.json({ message: `Cliente excluido com sucesso!`, cpf: cpf });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir cliente" });
    }
});

// Excluir cliente pelo nome
router.delete(`/excluir-cliente-nome/:nomeCliente/permanente`, async (req, res) => {
    const nome = req.params.nomeCliente;
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE nome = ?`, [nome]);
        if (rows.length === 0) {
            return res.status(404).json({ error: `Cliente não foi encontrado!` });
        }
        await pool.execute(`DELETE FROM clientes WHERE nome = ?`, [nome]);
        res.json({ message: `Cliente excluido com sucesso!`, nome: nome });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir cliente" });
    }
});

//==== POST ====

// Criar novo cliente
router.post(`/`, async (req, res) => {
    // Garante que o CPF é uma string de apenas números
    let cpfLimpo = String(req.body.cpf || '').replace(/\D/g, '');
    req.body.cpf = cpfLimpo;
    const nomeCliente = req.body.nome;

    // Valida os dados com o schema
    const { error, value } = clienteSchema.validate(req.body);

    if (error) {
        // Log para você ver no terminal o que o Joi está reclamando exatamente
        console.log("Erro de validação:", error.details); 
        if(nomeCliente.length > 50){
            return res.status(400).json({
            error: `Dados inválidos!`,
            message: `O nome do cliente deve ter no máximo 50 caracteres!`
            });
            
        } else {
        return res.status(400).json({
            error: `Dados inválidos!`,
            message: error.details[0].message // Pegar a mensagem específica do erro
            });
        }
    }

    const { cpf, nome } = value;

    try {
        // Verifica se o CPF já existe
        const [cpfExistente] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
        if (cpfExistente.length > 0) {
            return res.status(409).json({
                error: `CPF já existe!`,
                message: `Já existe um cliente com esse cpf: ${cpf}`
            });
        }

        if(nome.trim() === "" || nome.length > 50){
            return res.status(400).json({
                error: `Nome inválido!`,
                message: `Forneça um nome válido (não vazio e até 50 caracteres)!`
            });
        }

        // Insere o novo Cliente
        await pool.execute('INSERT INTO clientes (cpf, nome) VALUES (?, ?)', [cpf, nome]);

        // Busca o cliente recém criado para retornar
        const [novoCliente] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);

        res.status(201).json({
            message: `Cliente cadastrado com Sucesso!`,
            cliente: novoCliente[0]
        });

    } catch (error) {
        console.error(`Erro ao criar Cliente:`, error);
        res.status(500).json({ error: `Erro ao criar cliente`, details: error.message });
    }
});

// === PUTs ====

// Atualizar cliente existente
router.put(`/atualizar-cliente/:cpfAtual`, async (req, res) => {
    const cpfCliente = req.params.cpfAtual;
    const { cpf, nome } = req.body;

    try {
        // Verifica se cliente existe
        const [cpfExiste] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpfCliente]);
        if (cpfExiste.length === 0) return res.status(404).json({ error: "Cliente não encontrado!" });

        const campos = [];
        const valores = [];

        // Validação e limpeza do novo CPF (se enviado)
        if (cpf !== undefined) {
            const cpfLimpo = String(cpf).replace(/\D/g, '');
            const { error } = Joi.document().cpf().validate(cpfLimpo);
            if (error) return res.status(400).json({ error: "Novo CPF informado é inválido!" });
            
            campos.push('cpf = ?');
            valores.push(cpfLimpo);
        }

        // Validação do nomeFantasia (se enviado)
        if (nome !== undefined) {
            if (nome.trim() === "" || nome.length > 50) {
                return res.status(400).json({ error: "Nome inválido!" });
            }
            campos.push('nome = ?');
            valores.push(nome.trim());
        }

        if (campos.length === 0) {
            return res.status(400).json({ error: "Nenhum campo para atualizar informado." });
        }

        valores.push(cpfCliente); // Para o WHERE
        const sql = `UPDATE clientes SET ${campos.join(', ')} WHERE cpf = ?`;
        
        await pool.execute(sql, valores);
        res.json({ message: "Cliente atualizado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Erro ao atualizar.`, details: error.message });
    }
});


module.exports = router;
// Exporta o roteador para ser usado no app principal.


/*
===========================================================
==========Alterações do codigom para validdar CPF==========
🚀1. Correção da Lógica do if (O Erro Principal)
Como era: Você usava if(!cpf || validateCpf.validate(cpf)).
No Joi, o método .validate() sempre retorna um objeto, e qualquer objeto em JavaScript é considerado "verdadeiro".
Por isso, o código sempre entrava no erro, mesmo com o CPF correto.
Como ficou: Agora usamos a desestruturação const { error } = clienteSchema.validate(req.body).
O código só entra no if(error) se a propriedade error existir (ou seja, se algo estiver errado).
Se estiver tudo certo, error é undefined e o código segue.

🚀2. Limpeza Automática (Sanitização)
O que mudou: Adicionamos a linha req.body.cpf.replace(/\D/g, '').
O benefício: Agora o seu código é "à prova de erros de digitação".
Se o usuário enviar o CPF com pontos, traços ou espaços no Postman, o sistema remove tudo isso e
valida apenas os 11 números puros antes de testar a regra matemática e salvar no banco.

🚀3. Validação Centralizada (Schema)
Como era: tinha vários if espalhados para validar o tamanho do nome, se o nome existia, etc.
Como ficou: Criamos o clienteSchema. Ele centraliza todas as regras em um único lugar: o nome deve ser string,
ter no máximo 50 caracteres e ser obrigatório; o CPF deve seguir a regra matemática oficial.
Isso deixou o corpo da função POST muito mais limpo e profissional.

🚀4. Tratamento de Erros nos Deletes
O que mudou: No seu código original, o bloco catch (que captura erros do banco) 
estava vazio ou incompleto (res.status();).
Como ficou: Adicionamos res.status(500).json({ error: "Erro ao excluir" }).
Isso impede que o seu servidor "trave" ou fique sem dar resposta caso ocorra algum problema na conexão
com o banco de dados durante uma exclusão.
Dica: Com essas mudanças, o objeto value retornado pelo Joi já contém os dados "limpos" e prontos para serem usados
na sua consulta SQL, garantindo mais segurança contra invasões (SQL Injection) básicas.

===============Schema===========
Um schema é a estrutura lógica, regras e organização de dados, servindo como um "projeto" 
que define tipos de campos, relacionamentos e restrições. Em bancos de dados, organiza tabelas e objetos.
👀🤔 Porque usar:

🚀Segurança: evita que dados incorretos ou maliciosos entrem no sistema.

🚀Consistência: garante que todos os registros sigam o mesmo padrão.

🚀Facilidade de manutenção: centraliza as regras de validação em um só lugar.

👉Em resumo: o Schema é como um “contrato” que os dados precisam cumprir antes de serem aceitos pelo sistema.

👉Em resumo: @hapi/joi é a biblioteca que você está usando para criar schemas de validação no seu código.



*/

/*const express = require(`express`);
const {pool} = require(`../config/db`);

const { validator } = require('cpf-cnpj-validator');
const Joi = require('@hapi/joi').extend(validator);
const validateCpf = Joi.document().cpf();

const router = express.Router();

//==== GET ====

router.get(`/`, async (req, res) => {
    try{
        const [rows] = await pool.execute(`SELECT * FROM clientes`);
        res.json(rows);
        if(rows == 0){
            return res.status(404).json({error: `Não há clientes cadastrados!`});
        }
    }catch(error){
        console.error(`Erro ao consultar clientes: `, error);
        res.status(500).json({error: `Erro ao consultar clientes`, details: error.message});
    }
}
)

router.get(`/cpf/:cpf`, async (req, res) => {
    const cpf = req.params.cpf;
    try{
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);
        res.json(rows);
        if(rows == 0){
            return res.status(404).json({error: `Esse cliente não tem cadastrado!`});
        }
    }catch(error){
        console.error(`Erro ao consultar clientes: `, error);
        res.status(500).json({error: `Erro ao consultar clientes`, details: error.message});
    }
}
)

//==== DELETES ====

router.delete(`/excluir-clientes-cpf/:cpf/permanente`, async (req, res) => {
    const cpf = req.params.cpf;
    try{
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);
        if(rows.length === 0){
            return res.status(404).json({error: `Cliente não foi encontrado!`});
        }
        await pool.execute(`DELETE FROM clientes WHERE cpf = ?`, [cpf]);
        res.json({message: `Cliente excluido com sucesso!`, cpf: cpf});
    }catch(error){
        res.status();
    }
})

router.delete(`/excluir-cliente-nome/:nomeCliente/permanente`, async (req, res) => {
    const nome = req.params.nomeCliente;
    try{
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE nome = ?`, [nome]);
        if(rows.length === 0){
            return res.status(404).json({error: `Cliente não foi encontrado!`});
        }
        await pool.execute(`DELETE FROM clientes WHERE nome = ?`, [nome]);
        res.json({message: `Cliente excluido com sucesso!`, id: nome});
    }catch(error){
        res.status();
    }
})

//==== POSTs ====

router.post(`/`, async (req, res) => {
    const {cpf, nome} = req.body;

    //validacao de dados
    if(!nome || nome.trim() === ``){ //Validacao do nome
        return res.status(400).json({
            error: `Nome do Cliente é Obrigatório!`,
            message: `Forneça um nome válido!`
        });
    }

    if(nome.length > 50){
        return res.status(400).json({
            error: `Nome muito comprido Dom Pedro I`,
            message: `Se você não for Dom Pedro I, favor colocar nome de gente!`
        });
    }
    
    //Validacao do CPF
    if(!cpf || validateCpf.validate(cpf)){
        return res.status(400).json({
            error: `CPF inválido!`,
            message: `Favor inserir o CPF corretamente (11 digitos numéricos, apenas!)`
        });
    }
     
    //Verifica se o CPF já existe
    try{
        const[cpfExistente] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
        if(cpfExistente.length > 0){
            return res.status(409).json({
                error: `CPF já existe!`,
                message: `Já existe um cliente com esse cpf: ${cpf}`
            });
        }

        //se não haver um CPF já cadastrado: insere o novo Cliente
        await pool.execute('INSERT INTO clientes (cpf, nome) VALUES (?, ?)', [cpf, nome]);

        const [novoCliente] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);

        res.status(201).json({
            message: `Cliente cadastrado com Sucesso!`,
            cliente: novoCliente[0]
        });

    }catch(error){
        console.error(`Erro ao criar Cliente:`, error);
        res.status(500).json({error: `Erro ao criar cliente`, details: error.message});
    }
})

module.exports = router;*/

