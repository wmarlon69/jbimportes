const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Caminho do arquivo de banco de dados
const dbPath = path.join(__dirname, 'db.json');

// Função para ler o banco de dados
function readDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, criar com dados iniciais
        const initialData = {
            produtos: [],
            admin: { senha: 'admin123' }
        };
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
        return initialData;
    }
}

// Função para salvar no banco de dados
function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Rotas da API
app.get('/api/produtos', (req, res) => {
    const db = readDB();
    res.json(db.produtos);
});

app.post('/api/produtos', (req, res) => {
    const db = readDB();
    const novoProduto = {
        id: Date.now(),
        ...req.body
    };
    db.produtos.push(novoProduto);
    saveDB(db);
    res.json(novoProduto);
});

app.put('/api/produtos/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.produtos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    db.produtos[index] = { ...db.produtos[index], ...req.body };
    saveDB(db);
    res.json(db.produtos[index]);
});

app.delete('/api/produtos/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const index = db.produtos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    db.produtos.splice(index, 1);
    saveDB(db);
    res.json({ success: true });
});

app.get('/api/admin', (req, res) => {
    const db = readDB();
    res.json(db.admin);
});

app.put('/api/admin', (req, res) => {
    const db = readDB();
    db.admin = req.body;
    saveDB(db);
    res.json(db.admin);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 