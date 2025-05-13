# JB IMPORTES - Sistema de E-commerce

## Novo Banco de Dados MySQL

O sistema agora utiliza MySQL como banco de dados! Siga as instruções abaixo para configurar:

1. Instale o MySQL Server (https://dev.mysql.com/downloads/mysql/)
2. Verifique se o MySQL está rodando
3. Configure o banco de dados:
   ```
   npm run setup-db
   ```
4. Inicie o servidor:
   ```
   npm start
   ```

## Instalação Rápida

1. Instale o [Node.js](https://nodejs.org/)
2. Instale o [MySQL](https://dev.mysql.com/downloads/mysql/)
3. Execute no terminal:
   ```
   npm install
   npm run setup-db
   npm start
   ```
4. Acesse http://localhost:3000 no navegador

## Painel Admin

- URL: http://localhost:3000/admin.html
- Senha: 123456

## Solução para Imagens que Não Aparecem

- Coloque as imagens na pasta `img/`
- Use links https:// válidos
- Recarregue a página após fazer alterações

## Usando na Rede Local

- Acesse pelo IP do servidor: http://IP_DO_SERVIDOR:3000

## Configuração MySQL Avançada

Se você tem uma senha para o MySQL ou deseja usar outro usuário:

1. Edite os arquivos `db-sql.js` e `setup-db.js`
2. Procure pelas configurações de conexão:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'root',      // Altere para seu usuário
     password: '',      // Coloque sua senha
     database: 'jbimportes'
   };
   ```
3. Atualize os valores conforme necessário
4. Execute novamente `npm run setup-db` 