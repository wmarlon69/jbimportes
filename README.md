# JB IMPORTES - Sistema de E-commerce

Sistema de e-commerce para JB IMPORTES, com sistema de banco de dados, catálogo de produtos e painel administrativo.

## Funcionalidades

- Exibição de produtos por categoria (feminino, masculino, infantil)
- Filtros de preço
- Painel administrativo para gerenciar produtos
- Sistema de banco de dados usando localStorage (modo offline) e servidor Node.js (modo online)
- Sistema de formulário de compra integrado com WhatsApp

## Instruções para Instalação

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão 14 ou superior)
2. Baixe ou clone este repositório
3. Abra um terminal na pasta do projeto
4. Execute `npm install` para instalar as dependências
5. Execute `npm start` ou use o arquivo `iniciar-servidor.bat` para iniciar o servidor
6. Acesse `http://localhost:3000` no navegador

## Acesso ao Painel Administrativo

- Acesse `http://localhost:3000/admin.html`
- Senha de acesso: `123456`

## Estrutura de Arquivos

- `index.html` - Página principal da loja
- `admin.html` - Painel administrativo
- `script.js` - Código JavaScript para a página principal
- `server.js` - Servidor Node.js com API REST
- `db-remote.js` - Cliente para conectar ao banco de dados remoto
- `config.js` - Configurações do sistema
- `produtos.json` - Arquivo onde os produtos são armazenados (criado automaticamente)

## Soluções para Problemas Comuns

### Produtos não aparecem para outros usuários

Para que os produtos adicionados apareçam para todos os usuários:

1. Certifique-se que o servidor Node.js está rodando (use o arquivo `iniciar-servidor.bat`)
2. Verifique que todos os usuários estão acessando através do endereço do servidor (http://localhost:3000)
3. Se estiver usando em rede local, substitua "localhost" pelo endereço IP do servidor
4. O arquivo `produtos.json` deve ter permissões de escrita para o servidor
5. Após adicionar um produto, os outros usuários precisam recarregar a página (F5)

### Imagens não aparecem

- Verifique se os caminhos das imagens estão corretos
- Certifique-se de que as imagens foram salvas na pasta `img/`
- Para imagens externas, certifique-se de que a URL está correta e acessível

### Erro "EADDRINUSE"

Se ao iniciar o servidor aparecer o erro "EADDRINUSE", significa que a porta 3000 já está sendo usada. Você pode:

1. Encerrar o processo que está usando a porta 3000, ou
2. Alterar a porta no arquivo `server.js` mudando `const PORT = process.env.PORT || 3000;` para outra porta, como 3001

### Servidor fechou inesperadamente

Se o servidor parar de funcionar ou fechar inesperadamente, reinicie-o com o comando:
```
npm start
```

## Desenvolvedores

Este projeto foi desenvolvido por JB IMPORTES. 