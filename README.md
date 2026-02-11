# API Acadêmica para Cadastro de Cupons Fiscais

API construida no decorrer das aulas de Programação de Aplicativos do Técnico de ADS do SENAI com intuito acadêmico. O objetivo é simples: cadastrar clientes, restaurantes e cupons fiscais.

## Estrutura da API

### 📌 index.js

O `index.js` é o arquivo de entrada da aplicação, onde tudo vai iniciar. É onde inicia o processo.

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

## Bibliotecas Node especiais usadas

- **validar-cpf**: usado para fazer a validação do CPF na rota **POST** no arquivo `clientes.js`
```javascript
    //para instalar o Validador do CPF no terminal
    npm install --save validar-cpf

    //Para usar no código
    const validateCpf = require('validar-cpf');

    if(validateCpf(`123.456.789-10`)){
        console.log(`O CPF é válido`);
    }

```

- **cpf-cnpj-validator**: Igual o validador do CPF... mas com CNPJ. Usado na rota **POST** no arquivo `restaurante.js`
```javascript
    //para instalar o Validador do CNPJ no terminal
    npm i cpf-cnpj-validator -S

    //Para usar no código
    const { validator } = require('cpf-cnpj-validator');

    const Joi = require('@hapi/joi').extend(validator);
    const validateCnpj = Joi.document().cnpj();

    if(validateCnpj.validate(cnpj)){
        console.log(`CNPJ válido`);
    }
```
 
