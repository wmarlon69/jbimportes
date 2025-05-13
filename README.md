# JB IMPORTES - Sistema de E-commerce

Este é um sistema de e-commerce para a loja JB IMPORTES, com gerenciamento de produtos e painel administrativo.

## Requisitos

Para executar o sistema completo, você precisa ter instalado:

- Node.js (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

## Instalação do Node.js e npm

### Windows

1. Acesse o site oficial do Node.js: https://nodejs.org/
2. Baixe a versão LTS (recomendada para a maioria dos usuários)
3. Execute o instalador baixado e siga as instruções na tela
4. Ao finalizar a instalação, abra o Prompt de Comando (ou PowerShell) e verifique se tudo foi instalado corretamente com os comandos:
   ```
   node --version
   npm --version
   ```

### macOS

1. Acesse o site oficial do Node.js: https://nodejs.org/
2. Baixe a versão LTS para macOS
3. Execute o instalador e siga as instruções
4. Alternativamente, se você usar Homebrew, pode instalar com: `brew install node`
5. Verifique a instalação com os comandos:
   ```
   node --version
   npm --version
   ```

### Linux (Ubuntu/Debian)

1. Abra o terminal e execute os seguintes comandos:
   ```
   sudo apt update
   sudo apt install nodejs npm
   ```
2. Verifique a instalação:
   ```
   node --version
   npm --version
   ```

## Executando o Projeto

1. Após instalar o Node.js e npm, abra o terminal (Prompt de Comando, PowerShell, Terminal) e navegue até a pasta do projeto:
   ```
   cd caminho/para/jbimportes
   ```

2. Instale as dependências do projeto:
   ```
   npm install
   ```

3. Inicie o servidor:
   ```
   npm start
   ```
   
4. O servidor será iniciado na porta 3000. Você pode acessar o site em:
   ```
   http://localhost:3000
   ```

5. Para acessar o painel administrativo, vá para:
   ```
   http://localhost:3000/admin.html
   ```
   Senha padrão: 123456 (pode ser alterada no arquivo config.js)

## Estrutura do Projeto

- `index.html` - Página principal da loja
- `admin.html` - Painel administrativo
- `script.js` - Código JavaScript para a página principal
- `server.js` - Servidor Node.js com API REST
- `db-remote.js` - Cliente para conectar ao banco de dados remoto
- `config.js` - Configurações do sistema
- `produtos.json` - Arquivo onde os produtos são armazenados (criado automaticamente)

## Soluções para Problemas Comuns

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