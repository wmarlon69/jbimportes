# JB IMPORTES

Sistema de loja virtual da JB IMPORTES com painel administrativo e catálogo de produtos.

## Funcionalidades

- Painel administrativo para gerenciar produtos
- Catálogo de produtos com filtro por categoria e preço
- Conexão com MongoDB Atlas
- Sistema de autenticação para área administrativa

## Requisitos

- Node.js (v14+)
- MongoDB Atlas (ou MongoDB local)

## Instalação

1. Clone o repositório:
```
git clone https://github.com/seu-usuario/jb-importes.git
cd jb-importes
```

2. Instale as dependências:
```
npm install
```

3. Crie o arquivo de configuração:
```
cp config.env.example config.env
```

4. Edite o arquivo `config.env` com suas credenciais do MongoDB Atlas.

5. Inicie o servidor:
```
node server.js
```

## Acesso

- **Loja**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin.html
  - Senha padrão: 123456 (definida no arquivo config.js)

## Tecnologias Utilizadas

- Node.js com Express
- MongoDB Atlas
- JavaScript puro (Vanilla JS)
- HTML5 e CSS3 