/**
 * JB IMPORTES - Banco de Dados em localStorage
 * Este arquivo fornece funções para gerenciar o banco de dados local
 */

// Chave para armazenar os produtos no localStorage
const DB_KEY = 'jbimportes_produtos';

// Objeto do banco de dados
const db = {
    /**
     * Inicializa o banco de dados com valores padrão se não existir
     */
    init: function() {
        if (!localStorage.getItem(DB_KEY)) {
            // Dados iniciais baseados no array existente em script.js
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
                    imagem: "https://imags.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
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
            this.salvarTodos(produtosIniciais);
        }
    },

    /**
     * Obtém todos os produtos
     * @return {Array} Lista de produtos
     */
    obterTodos: function() {
        const dados = localStorage.getItem(DB_KEY);
        return dados ? JSON.parse(dados) : [];
    },

    /**
     * Salva todos os produtos
     * @param {Array} produtos - Lista de produtos para salvar
     */
    salvarTodos: function(produtos) {
        localStorage.setItem(DB_KEY, JSON.stringify(produtos));
    },

    /**
     * Adiciona um novo produto
     * @param {Object} produto - Produto a ser adicionado
     * @return {Object} Produto adicionado com ID
     */
    adicionar: function(produto) {
        const produtos = this.obterTodos();
        produto.id = this.gerarId(produtos);
        produtos.push(produto);
        this.salvarTodos(produtos);
        return produto;
    },

    /**
     * Atualiza um produto existente
     * @param {Object} produto - Produto com ID para atualizar
     * @return {Object|null} Produto atualizado ou null se não encontrado
     */
    atualizar: function(produto) {
        let produtos = this.obterTodos();
        const index = produtos.findIndex(p => p.id === produto.id);
        
        if (index === -1) return null;
        
        produtos[index] = produto;
        this.salvarTodos(produtos);
        return produto;
    },

    /**
     * Remove um produto pelo ID
     * @param {number} id - ID do produto a remover
     * @return {boolean} Verdadeiro se removido com sucesso
     */
    remover: function(id) {
        let produtos = this.obterTodos();
        const tamanhoAntes = produtos.length;
        produtos = produtos.filter(p => p.id !== id);
        
        if (produtos.length === tamanhoAntes) {
            return false;
        }
        
        this.salvarTodos(produtos);
        return true;
    },

    /**
     * Busca um produto pelo ID
     * @param {number} id - ID do produto a buscar
     * @return {Object|null} Produto encontrado ou null
     */
    buscarPorId: function(id) {
        const produtos = this.obterTodos();
        return produtos.find(p => p.id === id) || null;
    },

    /**
     * Filtra produtos por categoria
     * @param {string} categoria - Categoria para filtrar
     * @return {Array} Lista de produtos filtrados
     */
    filtrarPorCategoria: function(categoria) {
        if (categoria === 'tudo') {
            return this.obterTodos();
        }
        
        const produtos = this.obterTodos();
        return produtos.filter(p => p.categoria === categoria);
    },

    /**
     * Filtra produtos por faixa de preço
     * @param {string} faixa - Faixa de preço (ate50, ate100, acima100)
     * @return {Array} Lista de produtos filtrados
     */
    filtrarPorPreco: function(faixa) {
        const produtos = this.obterTodos();
        
        if (faixa === 'tudo') {
            return produtos;
        }
        
        if (faixa === 'ate50') {
            return produtos.filter(p => p.preco <= 50);
        } else if (faixa === 'ate100') {
            return produtos.filter(p => p.preco <= 100);
        } else if (faixa === 'acima100') {
            return produtos.filter(p => p.preco > 100);
        }
        
        return produtos;
    },

    /**
     * Gera um novo ID para produto
     * @param {Array} produtos - Lista de produtos existentes
     * @return {number} Novo ID
     */
    gerarId: function(produtos) {
        if (!produtos.length) return 1;
        return Math.max(...produtos.map(p => p.id)) + 1;
    },

    /**
     * Exporta os dados para um arquivo
     * @return {string} URL do arquivo para download
     */
    exportarDados: function() {
        const produtos = this.obterTodos();
        const blob = new Blob([JSON.stringify(produtos, null, 2)], { type: 'application/json' });
        return URL.createObjectURL(blob);
    },

    /**
     * Importa dados de um arquivo JSON
     * @param {string} json - String JSON para importar
     * @return {boolean} Verdadeiro se importado com sucesso
     */
    importarDados: function(json) {
        try {
            const dados = JSON.parse(json);
            if (!Array.isArray(dados)) {
                throw new Error('Formato inválido: não é um array');
            }
            
            // Validar cada produto
            dados.forEach(produto => {
                if (!produto.nome || !produto.preco || !produto.categoria || !produto.imagem) {
                    throw new Error('Formato inválido: produto com campos obrigatórios ausentes');
                }
            });
            
            this.salvarTodos(dados);
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }
};

// Inicializar o banco de dados ao carregar
db.init(); 