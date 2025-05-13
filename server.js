const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar o banco de dados SQL
const db = require('./db-sql');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Middleware específico para servir imagens
app.use('/img', express.static(path.join(__dirname, 'img')));

// Variável para armazenar o status da inicialização do banco de dados
let dbInitialized = false;

// Inicializar o banco de dados
async function initDB() {
    try {
        await db.init();
        console.log('Banco de dados inicializado com sucesso');
        dbInitialized = true;
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        // Continuar a inicialização do servidor mesmo que o banco de dados falhe
    }
}

// Middleware para verificar se o banco de dados está inicializado
function verificarDB(req, res, next) {
    if (!dbInitialized) {
        return res.status(503).json({ erro: 'Banco de dados não inicializado. Tente novamente em instantes.' });
    }
    next();
}

// Rotas para produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await db.obterTodos();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler produtos', detalhes: error.message });
    }
});

app.post('/api/produtos', async (req, res) => {
    try {
        const novoProduto = req.body;
        
        // Validar dados
        if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        // Garantir que a imagem existe
        if (!novoProduto.imagem) {
            novoProduto.imagem = 'img/imagem-indisponivel.jpg';
        }
        
        // Adicionar ao banco de dados
        const produtoAdicionado = await db.adicionar(novoProduto);
        
        res.status(201).json(produtoAdicionado);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar produto', detalhes: error.message });
    }
});

app.put('/api/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const produtoAtualizado = req.body;
        
        // Validar dados
        if (!produtoAtualizado.nome || !produtoAtualizado.preco || !produtoAtualizado.categoria) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        // Garantir que a imagem existe
        if (!produtoAtualizado.imagem) {
            produtoAtualizado.imagem = 'img/imagem-indisponivel.jpg';
        }
        
        // Garantir que o ID está correto
        produtoAtualizado.id = id;
        
        // Atualizar no banco de dados
        const resultado = await db.atualizar(produtoAtualizado);
        
        if (!resultado) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar produto', detalhes: error.message });
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Remover do banco de dados
        const removido = await db.remover(id);
        
        if (!removido) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir produto', detalhes: error.message });
    }
});

// Filtrar por categoria
app.get('/api/produtos/categoria/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const produtosFiltrados = await db.filtrarPorCategoria(categoria);
        res.json(produtosFiltrados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao filtrar produtos', detalhes: error.message });
    }
});

// Filtrar por preço
app.get('/api/produtos/preco/:faixa', async (req, res) => {
    try {
        const faixa = req.params.faixa;
        const produtosFiltrados = await db.filtrarPorPreco(faixa);
        res.json(produtosFiltrados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao filtrar produtos', detalhes: error.message });
    }
});

// Rota para verificar se o servidor está rodando
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online',
        dbStatus: dbInitialized ? 'conectado' : 'desconectado' 
    });
});

// Inicializar banco de dados e iniciar servidor
async function iniciarServidor() {
    // Tentar inicializar o banco de dados
    await initDB();
    
    // Iniciar o servidor de qualquer forma
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Acesse http://localhost:${PORT} para visualizar a loja`);
        console.log(`Status do banco de dados: ${dbInitialized ? 'CONECTADO' : 'DESCONECTADO'}`);
        
        if (!dbInitialized) {
            console.log('O servidor está rodando mas o banco de dados não foi inicializado.');
            console.log('Algumas operações podem não funcionar corretamente.');
        }
    });
}

iniciarServidor(); 