# Guia para Usar o MongoDB Local com JB IMPORTES

Este guia vai ajudar você a configurar e usar o MongoDB local que você baixou.

## Passo 1: Confirmar a Instalação do MongoDB

1. Verifique se o MongoDB está instalado corretamente:
   - Abra o Prompt de Comando
   - Digite `mongod --version`
   - Deve mostrar a versão do MongoDB (ex: MongoDB shell version: 6.0.x)

2. Se não estiver instalado ou o comando não for reconhecido:
   - Baixe o MongoDB Community Edition em: https://www.mongodb.com/try/download/community
   - Escolha a versão para Windows
   - Durante a instalação, selecione "Complete" ou "Custom" e garanta que "Install MongoDB as a Service" esteja marcado
   - Complete a instalação

## Passo 2: Criar a Pasta de Dados

O MongoDB precisa de uma pasta para armazenar os dados:

1. Crie uma pasta chamada `data` dentro da pasta do projeto:
   ```
   mkdir data
   ```

## Passo 3: Iniciar o Sistema

Para iniciar o MongoDB e o servidor JB IMPORTES:

1. Simplesmente dê um duplo clique no arquivo `iniciar-mongodb.bat`
2. Este script vai:
   - Iniciar o MongoDB
   - Instalar as dependências necessárias
   - Iniciar o servidor JB IMPORTES

3. Acesse o site em:
   - Local: http://localhost:3000
   - Outros dispositivos na rede: http://SEU_IP:3000 (ex: http://192.168.1.2:3000)

## Solução de Problemas

### Erro "MongoDB não encontrado"

Se o script mostrar erro de MongoDB não encontrado:

1. Certifique-se de que o MongoDB foi instalado corretamente
2. Adicione o MongoDB ao PATH do sistema:
   - Painel de Controle > Sistema e Segurança > Sistema > Configurações Avançadas do Sistema
   - Avançado > Variáveis de Ambiente
   - Na lista "Variáveis do Sistema", selecione "Path" e clique em "Editar"
   - Adicione o caminho para a pasta bin do MongoDB (geralmente C:\Program Files\MongoDB\Server\6.0\bin)
   - Clique em OK em todas as janelas
   - Reinicie o prompt de comando

### Erro "Porta 27017 já está em uso"

Se o MongoDB não iniciar porque a porta 27017 já está em uso:

1. Significa que o MongoDB já está rodando
2. Continue com o script ou inicie manualmente com `npm start`

### Produtos não aparecem

Se os produtos não aparecem:

1. Verifique se o MongoDB está rodando com o comando:
   ```
   tasklist | findstr mongod
   ```
2. Verifique o console do navegador (F12) para ver se há erros
3. Reinicie o servidor com o script `iniciar-mongodb.bat`

## Acesso ao Painel Admin

1. Acesse o painel administrativo em:
   - http://localhost:3000/admin.html
   - ou http://SEU_IP:3000/admin.html
2. Use a senha padrão: 123456

## Aviso Importante

Quando terminar de usar o servidor, feche a janela do script `iniciar-mongodb.bat`. 
Isso vai encerrar corretamente tanto o servidor JB IMPORTES quanto o MongoDB. 