<!--
https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/

https://www.makeareadme.com/

https://rahuldkjain.github.io/gh-profile-readme-generator/
-->

# Sobre 

<p>

<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Javascript">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="Typescript">

</p>

Esse projeto é uma API REST para gerenciamento de livros, para solução da atividade de backend, do grupo mais1code.

Essa aplicação foi desenvolvida utilizando Node Next.js

## Instalação

```bash
npm install

npm run dev
```

## Rotas API

### POST /api/livros

Cadastrar um livro

Exemplo body request:

```json
{
    "titulo": "Snoopy",
    "autor": "Schultz",
    "editora": "Editor"
}
```

### GET /api/livros

Listagem dos livros cadastrados

### DELETE /api/livros?idLivro=:idLivro

Remoção de um livro

Exemplo query params:

/api/livros?idLivro=641d01ed6b28c6f4645d1b9d


### PUT /api/livros?idLivro=:idLivro

Alteração de um livro

Exemplo query params:

/api/livros?idLivro=641d01ed6b28c6f4645d1b9d

```json
{
    "titulo": "Snoopy",
    "autor": "Schultz",
    "editora": "Editor"
}
```

### GET /api/health-check

Verificar o estado da aplicação

## Desenvolvedor

Ana Caroline de Souza

ana.caroline.souza09@gmail.com
