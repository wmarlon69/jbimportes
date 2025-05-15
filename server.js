require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configurar CORS de forma mais explícita
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-password']
}));

// Middleware para parsear o JSON - aumentar o limite e configurar corretamente
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos com tipos MIME corretos
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware de autenticação para rotas administrativas
const autenticarAdmin = (req, res, next) => {
    console.log('Verificando autenticação para:', req.method, req.url);
    console.log('Headers:', JSON.stringify(req.headers));
    
    const senha = req.headers['x-admin-password'];
    console.log('Senha recebida:', senha);
    
    // Verificação temporária - aceitar a senha diretamente
    if (senha === '123456') {
        console.log('Autenticação bem-sucedida com senha direta');
        return next();
    }
    
    // Verificação pelo config
    if (senha && config.verificarSenhaAdmin(senha)) {
        console.log('Autenticação bem-sucedida via config');
        return next();
    }
    
    console.log('Autenticação falhou');
    return res.status(401).json({ error: 'Não autorizado' });
};

// Rota para verificar senha do administrador
app.post('/api/admin/login', (req, res) => {
    try {
        console.log('Tentativa de login recebida');
        console.log('Corpo da requisição:', req.body);
        
        const { senha } = req.body || {};
        
        if (!senha) {
            console.log('Senha não fornecida');
            return res.status(400).json({ 
                success: false, 
                error: 'Senha não fornecida' 
            });
        }
        
        console.log('Verificando senha');
        const senhaValida = config.verificarSenhaAdmin(senha);
        console.log('Resultado da verificação:', senhaValida);
        
        if (senhaValida) {
            console.log('Login bem-sucedido');
            return res.status(200).json({ 
                success: true, 
                message: 'Login bem-sucedido' 
            });
        } else {
            console.log('Senha incorreta');
            return res.status(401).json({ 
                success: false, 
                error: 'Senha incorreta' 
            });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Erro interno no servidor' 
        });
    }
});

// Rotas da API
// GET /api/produtos (pública)
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Product.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// GET /api/produtos/:id (pública)
app.get('/api/produtos/:id', async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id);
        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// POST /api/produtos (protegida)
app.post('/api/produtos', autenticarAdmin, async (req, res) => {
    try {
        console.log('Recebendo requisição POST para criar produto');
        console.log('Corpo da requisição:', req.body);
        
        // Validar os campos obrigatórios
        const { nome, preco, categoria, descricao, imagem } = req.body;
        
        if (!nome || !preco || !categoria || !descricao || !imagem) {
            console.log('Campos obrigatórios ausentes');
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios (nome, preco, categoria, descricao, imagem)' 
            });
        }
        
        // Criar e salvar o produto
        const novoProduto = new Product(req.body);
        console.log('Criando produto:', novoProduto);
        
        const produtoSalvo = await novoProduto.save();
        console.log('Produto salvo com sucesso:', produtoSalvo);
        
        res.status(201).json(produtoSalvo);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        
        // Verificar se é um erro de validação do Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Erro de validação', 
                detalhes: error.message 
            });
        }
        
        res.status(500).json({ error: 'Erro ao adicionar produto', detalhes: error.message });
    }
});

// PUT /api/produtos/:id (protegida)
app.put('/api/produtos/:id', autenticarAdmin, async (req, res) => {
    try {
        console.log(`Recebendo requisição PUT para atualizar produto id=${req.params.id}`);
        console.log('Corpo da requisição:', req.body);
        
        // Validar os campos obrigatórios
        const { nome, preco, categoria, descricao, imagem } = req.body;
        
        if (!nome || !preco || !categoria || !descricao || !imagem) {
            console.log('Campos obrigatórios ausentes');
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios (nome, preco, categoria, descricao, imagem)' 
            });
        }
        
        // Atualizar o produto
        console.log('Atualizando produto...');
        
        const produto = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (produto) {
            console.log('Produto atualizado com sucesso:', produto);
            res.json(produto);
        } else {
            console.log('Produto não encontrado');
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        
        // Verificar se é um erro de validação do Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Erro de validação', 
                detalhes: error.message 
            });
        }
        
        res.status(500).json({ error: 'Erro ao atualizar produto', detalhes: error.message });
    }
});

// DELETE /api/produtos/:id (protegida)
app.delete('/api/produtos/:id', autenticarAdmin, async (req, res) => {
    try {
        const produto = await Product.findByIdAndDelete(req.params.id);
        if (produto) {
            res.json({ message: 'Produto excluído com sucesso' });
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

// Middleware para capturar erros 404
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint não encontrado' });
    }
    next();
});

// Rota para servir o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 