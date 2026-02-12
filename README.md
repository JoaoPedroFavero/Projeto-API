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
    }
    ```

    ```bash
    # exemplo de Saida Positiva
    {
    }
    ```

    ```bash
    # exemplo de Saida Negativa
    {
    }      
    ```

### PUT

- **PUT** `/clientes` - Atualiza um cliente, ou parcialmente ou totalmente
- ```javascript
    //Objeto requerido pelo body na rota POST
    const {cpf, nome} = req.body
    ```

    ```bash
    # exemplo no Postman
    ```

    ```bash
    # exemplo de Saida Positiva
    ```

    ```bash
    # exemplo de Saida Negativa    
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

    const Joi = require('@hapi/joi').extend(validator);
    const validateCnpj = Joi.document().cpf();

    if(validateCnpj.validate(cpf)){
        console.log(`CPF válido`);
    }
```
```javascript
    //Para usar no código para Validar o CNPJ
    const { validator } = require('cpf-cnpj-validator');

    const Joi = require('@hapi/joi').extend(validator);
    const validateCnpj = Joi.document().cnpj();

    if(validateCnpj.validate(cnpj)){
        console.log(`CNPJ válido`);
    }
```
 
