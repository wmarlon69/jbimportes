const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Middleware específico para servir imagens
app.use('/img', express.static(path.join(__dirname, 'img')));

// Arquivo de dados (simulando banco de dados)
const PRODUTOS_FILE = path.join(__dirname, 'produtos.json');

// Inicializar arquivo de produtos se não existir
if (!fs.existsSync(PRODUTOS_FILE)) {
    const produtosIniciais = [
        {
            id: 1,
            nome: "Camiseta Básica",
            preco: 49.90,
            categoria: "masculino",
            imagem: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            nome: "Vestido Floral",
            preco: 89.90,
            categoria: "feminino",
            imagem: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            nome: "Calça Jeans",
            preco: 99.90,
            categoria: "masculino",
            imagem: "https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            nome: "wmarlon",
            preco: 999.99,
            categoria: "masculino",
            imagem: "img/wm.jpg"
        },
        {
            id: 5,
            nome: "Saia Jeans",
            preco: 59.90,
            categoria: "feminino",
            imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            nome: "Saia Jeans Infantil",
            preco: 5.90,
            categoria: "infantil",
            imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
        }
    ];
    fs.writeFileSync(PRODUTOS_FILE, JSON.stringify(produtosIniciais, null, 2));
}

// Funções do banco de dados
function lerProdutos() {
    const dados = fs.readFileSync(PRODUTOS_FILE, 'utf8');
    return JSON.parse(dados);
}

function salvarProdutos(produtos) {
    fs.writeFileSync(PRODUTOS_FILE, JSON.stringify(produtos, null, 2));
}

function gerarId(produtos) {
    if (!produtos.length) return 1;
    return Math.max(...produtos.map(p => p.id)) + 1;
}

// Rotas para produtos
app.get('/api/produtos', (req, res) => {
    try {
        const produtos = lerProdutos();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler produtos', detalhes: error.message });
    }
});

app.post('/api/produtos', (req, res) => {
    try {
        const produtos = lerProdutos();
        const novoProduto = req.body;
        
        // Validar dados
        if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria || !novoProduto.imagem) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        // Adicionar ID
        novoProduto.id = gerarId(produtos);
        
        // Adicionar ao array e salvar
        produtos.push(novoProduto);
        salvarProdutos(produtos);
        
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar produto', detalhes: error.message });
    }
});

app.put('/api/produtos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const produtoAtualizado = req.body;
        
        // Validar dados
        if (!produtoAtualizado.nome || !produtoAtualizado.preco || !produtoAtualizado.categoria || !produtoAtualizado.imagem) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        let produtos = lerProdutos();
        const index = produtos.findIndex(p => p.id === id);
        
        if (index === -1) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        // Atualizar produto
        produtoAtualizado.id = id;
        produtos[index] = produtoAtualizado;
        salvarProdutos(produtos);
        
        res.json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar produto', detalhes: error.message });
    }
});

app.delete('/api/produtos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let produtos = lerProdutos();
        const produtoExiste = produtos.some(p => p.id === id);
        
        if (!produtoExiste) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        // Remover produto
        produtos = produtos.filter(p => p.id !== id);
        salvarProdutos(produtos);
        
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir produto', detalhes: error.message });
    }
});

// Filtrar por categoria
app.get('/api/produtos/categoria/:categoria', (req, res) => {
    try {
        const categoria = req.params.categoria;
        const produtos = lerProdutos();
        
        if (categoria === 'tudo') {
            return res.json(produtos);
        }
        
        const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
        res.json(produtosFiltrados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao filtrar produtos', detalhes: error.message });
    }
});

// Filtrar por preço
app.get('/api/produtos/preco/:faixa', (req, res) => {
    try {
        const faixa = req.params.faixa;
        const produtos = lerProdutos();
        
        if (faixa === 'tudo') {
            return res.json(produtos);
        }
        
        let produtosFiltrados = [];
        
        if (faixa === 'ate50') {
            produtosFiltrados = produtos.filter(p => p.preco <= 50);
        } else if (faixa === 'ate100') {
            produtosFiltrados = produtos.filter(p => p.preco <= 100);
        } else if (faixa === 'acima100') {
            produtosFiltrados = produtos.filter(p => p.preco > 100);
        }
        
        res.json(produtosFiltrados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao filtrar produtos', detalhes: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT} para visualizar a loja`);
}); 