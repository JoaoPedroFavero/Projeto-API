# API Acadêmica para Cadastro de Cupons Fiscais

API construida no decorrer das aulas de Programação de Aplicativos do Técnico de ADS do SENAI com intuito acadêmico. O objetivo é simples: cadastrar clientes, restaurantes e cupons fiscais.

## Estrutura da API

### 📌 index.js

O `index.js` é o arquivo de entrada da aplicação, onde tudo vai iniciar.

### 📌 app.js

O `app.js` é onde se configura a API, e faz a verificação da conexão com o Banco de Dados.

### 📌 server.js

Aqui é iniciado o servidor e onde são criadas as rotas. 
(PS. No caso dessa API as rotas foram passadas para a pasta `/routes` para maior organização).

## Principais Rotas

- **GET**
- **POST**
- **PUT**
- **DELETE**

### GET

- **GET** `/clientes` - Lista todos os clientes
- **GET** `/restaurantes` - Lista todos os restaurantes
- **GET** `/cupons` - Lista todos os cupons

### POST

- **POST** `/clientes` - Cadastra um novo cliente, usando validação de Nome e CPF
- ```javascript
    //Objeto requerido pelo body na rota POST
    const {cpf, nome} = req.body
    ```

    ```bash
    # exemplo no Postman
    { 
        "cpf": "12345678910",
        "nome": "Teste da Silva"
    }
    ```

    ```bash
    # exemplo de Saida Positiva
    {
        "message": "Cliente cadastrado com Sucesso!",
        "cliente": {
            "cpf": "12345678910",
            "nome": "Teste da Silva"
        }
    }
    ```

    ```bash
    # exemplo de Saida Negativa
    {
        "error": "CPF inválido!",
        "message": "Favor inserir o CPF corretamente (11 digitos numéricos, apenas!)"
    }      
    ```


- **POST** `/restaurantes` - Cadastra um novo restaurante, usando validação de Nome Fantasia e CNPJ
- ```javascript
    //Objeto requerido pelo body na rota POST
    const {cnpj, nomeFantasia} = req.body;
    ```

    ```bash
    # exemplo no Postman
    { 
        "cnpj" : "12345678000120",
        "nomeFantasia": "Restaurante Português Tio Teste"
    }
    ```

    ```bash
    # exemplo de Saida Positiva
    {
        "message": "Restaurante cadastrado com Sucesso!",
        "restaurante": {
            "cnpj": "12345678000120",
            "nomeFantasia": "Restaurante Português Tia Nilce"
        }
    }
    ```

    ```bash
    # exemplo de Saida Negativa
    {
        "error": "CNPJ inválido!",
        "message": "Favor inserir o CNPJ corretamente (14 digitos numéricos, apenas!)"
    }      
    ```

- **POST** `/cupons` - Cadastra um novo Cupom Fiscal completo.
- ```javascript
    //Objeto requerido pelo body na rota POST
    const {
        id, 
        valor, 
        data, 
        clienteCPF, 
        clienteNOME, 
        restCNPJ, 
        restNOME} = req.body;
    ```

    ```bash
    # exemplo no Postman
    {
        "valor": 100,
        "data": "2026-02-13",
        "cpfCliente": "20017394007",
        "nomeCliente": "Aragorn",
        "cnpjRestaurante": "42743863000107",
        "nomeFantasia": "Siri Cascudo Lanches e Hamburgueria"
    }
    
    ```

    ```bash
    # exemplo de Saida Positiva
    
    {
        "message": "Cupom Fiscal cadastrado com Sucesso!",
        "cupom": {
            "valor": 100,
            "data": "2026-02-13T00:00:00.000Z",
            "nomeCliente": "Aragorn",
            "cpfCliente": "20017394007",
            "nomeFantasia": "Siri Cascudo Lanches e Hamburgueria",
            "cnpjRestaurante": "42743863000107"
        }
    }   

    ```

    ```bash
    # exemplo de Saida Negativa
    # nesse caso se o CPF/CNPJ estiver incorreto
    {
        "error": "Dados inválidos!",
        "message": "CNPJ/CPF inválido ou Nome Fantasia fora do padrão."
    }     
    ```

### PUT

- **PUT** `/clientes` - Atualiza um cliente, ou parcialmente ou totalmente
- ```javascript
    //Objeto requerido pelo body na rota POST
    const {cpf, nome} = req.body;
    ```

    ```bash
    # exemplo no Postman
    {
        "cpf": "20017394007",
        "nome": "Aragorn Passolargo "
    }
    ```

    ```bash
    # exemplo de Saida Positiva
    {
        "message": "Cliente atualizado com sucesso!"
    }
    ```

    ```bash
    # exemplo de Saida Negativa
    # Nesse caso passando um CPF inválido   
    {
        "error": "Novo CPF informado é inválido!"
    }
    ```


- **PUT** `/restaurantes` - Atualiza um Restaurante, ou parcialmente ou totalmente
- ```javascript
    //Objeto requerido pelo body na rota POST
    const { cnpj, nomeFantasia } = req.body;
    ```

    ```bash
    # exemplo no Postman
    { 
        "cnpj": "12776105000116", 
        "nomeFantasia" : "Restaurante HD"
    }
    ```

    ```bash
    # exemplo de Saida Positiva
    {
        "message": "Restaurante atualizado com sucesso!"
    }
    ```

    ```bash
    # exemplo de Saida Negativa
    # Nesse caso passando um CNPJ inválido   
    {
        "error": "Novo CNPJ informado é inválido!"
    }
    ```

### DELETE

#### DELETES PRINCIPAIS

- **DELETE** `/clientes//excluir-clientes-cpf/:cpf/permanente` - Exclui clientes com o CPF
- **DELETE** `/restaurantes/excluir-restaurantes-cnpj/:cnpj/permanente` - Exclui restaurantes com o CNPJ
- **DELETE** `/cupons//excluir-cupom-id/:idCupom/permanente` - Exclui cupons com o id


## Bibliotecas Node especiais usadas
### cpf-cnpj-validator 

Validador do CPF/CNPJ. Usado nas rotas **POST** dos arquivos `restaurante.js` e `clientes.js`

```javascript
    //para instalar o Validador do CNPJ no terminal
    npm i cpf-cnpj-validator -S
```

```javascript
    //Para usar no código para Validar o CPF

    const { validator } = require('cpf-cnpj-validator');
    // Importa o validador de CPF/CNPJ.

    const Joi = require('@hapi/joi').extend(validator);
    // Importa o Joi (biblioteca de validação) e o estende com o validador de CPF/CNPJ.

    // Definição do Schema (Valida Nome e a regra matemática do CPF)
    const clienteSchema = Joi.object({

        // Forçamos o uso do validador de CPF da extensão
        cpf: Joi.document().cpf().required().messages({
            'document.cpf': 'O CPF informado é inválido.'
            // Valida que o CPF é obrigatório e segue a regra matemática correta, não aceitando qualquer numero aleatorio.
        })
    });

    const { error } = Joi.document().cpf().validate(cpf); //valida o CPF
    if (error) return res.status(400).json({ error: "Novo CPF informado é inválido!" });//Caso CPF inválido ele retorna erro
```

```javascript
    //Para usar no código para Validar o CNPJ
    const { validator } = require('cpf-cnpj-validator');
    // Importa o validador de CPF/CNPJ.

    const Joi = require('@hapi/joi').extend(validator);
    // Importa o Joi (biblioteca de validação) e o estende com o validador de CPF/CNPJ.

    // Definição do Schema para Restaurante
    const restauranteSchema = Joi.object({
        cnpj: Joi.document().cnpj().required()
        // Valida que o CNPJ seja válido matematicamente e obrigatório.
    });

    const { error } = Joi.document().cnpj().validate(cnpj); //valida o CNPJ
    if (error) return res.status(400).json({ error: "Novo CPJ informado é inválido!" });//Caso CNPJ inválido ele retorna erro
```
 
