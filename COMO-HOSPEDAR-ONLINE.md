# Como Hospedar o JB IMPORTES Online

Este guia vai ajudar você a colocar o site JB IMPORTES online para que qualquer pessoa possa acessar de qualquer lugar.

## Passo 1: Criar uma conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta gratuita
3. Crie um novo cluster (use a opção gratuita "Shared")
4. Em "Security" → "Database Access", crie um novo usuário com senha
5. Em "Security" → "Network Access", clique em "Add IP Address" e selecione "Allow Access from Anywhere"
6. No cluster, clique em "Connect" → "Connect your application"
7. Copie a string de conexão (parece com `mongodb+srv://usuario:senha@cluster0.mongodb.net/`)
8. Substitua `<password>` pela senha do usuário que você criou
9. Armazene essa string para usar mais tarde

## Passo 2: Criar conta e repositório no GitHub

1. Acesse [GitHub](https://github.com/) e crie uma conta gratuita
2. Instale o [Git](https://git-scm.com/downloads) no seu computador
3. Abra o terminal na pasta do projeto
4. Execute os comandos:

```
git init
git add .
git commit -m "Versão inicial"
```

5. No GitHub, crie um novo repositório
6. Siga as instruções para conectar seu repositório local ao GitHub:

```
git remote add origin https://github.com/SEU-USUARIO/jb-importes.git
git branch -M main
git push -u origin main
```

## Passo 3: Configurar e fazer deploy no Vercel

1. Acesse [Vercel](https://vercel.com/) e crie uma conta (pode usar sua conta do GitHub)
2. Clique em "New Project" → "Import Git Repository"
3. Selecione o repositório que você criou
4. Na seção de configuração:
   - Em "Environment Variables", adicione:
     - Nome: `MONGODB_URI`
     - Valor: cole a string de conexão do MongoDB Atlas que você copiou antes
   - Deixe as outras configurações padrão
5. Clique em "Deploy"
6. Aguarde a conclusão do deploy (alguns minutos)
7. Pronto! O Vercel fornecerá um link para seu site (algo como jb-importes.vercel.app)

## Passo 4: Testar e usar seu site online

1. Acesse o link fornecido pelo Vercel
2. Teste todas as funcionalidades:
   - Visualização de produtos
   - Painel administrativo (https://jb-importes.vercel.app/admin.html)
   - Adicionar/editar/remover produtos

## Dicas importantes

- Sempre que você fizer alterações no código:
  1. Faça commit das alterações locais:
     ```
     git add .
     git commit -m "Descrição das alterações"
     ```
  2. Envie para o GitHub:
     ```
     git push
     ```
  3. O Vercel detectará automaticamente as alterações e fará um novo deploy

- Se precisar alterar a senha do painel admin:
  1. Edite o arquivo `config.js`
  2. Altere a senha em `SENHA_ADMIN`
  3. Faça commit e push para o GitHub

- Se tiver problemas com imagens locais:
  1. Use links externos (https://) para imagens em produção
  2. Ou armazene suas imagens em um serviço como Cloudinary ou Imgur

## Problemas comuns

- Se os produtos não aparecerem, verifique a variável de ambiente MONGODB_URI no Vercel
- Se encontrar erros de CORS, ajuste o servidor para permitir solicitações do seu domínio 