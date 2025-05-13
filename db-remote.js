/**
 * JB IMPORTES - Banco de Dados remoto
 * Este arquivo fornece funções para gerenciar o banco de dados através de API
 */

// URL base da API - altere para seu domínio quando colocar online
const API_URL = 'http://192.168.1.2:3000/api';

// Objeto do banco de dados
const db = {
    /**
     * Inicializa o banco de dados
     */
    init: async function() {
        console.log('Banco de dados remoto inicializado');
        try {
            // Forçar primeira obtenção de produtos do servidor ao inicializar
            const response = await fetch(`${API_URL}/produtos`);
            if (response.ok) {
                console.log('Conexão com o servidor estabelecida com sucesso');
                const produtos = await response.json();
                // Atualizar o cache local com os dados do servidor
                this.salvarDadosLocais(produtos);
                return produtos;
            } else {
                console.warn('Servidor não está respondendo, usando cache local');
                return this.obterDadosLocais();
            }
        } catch (error) {
            console.error('Erro ao inicializar banco de dados:', error);
            return this.obterDadosLocais();
        }
    },

    /**
     * Obtém todos os produtos do servidor
     * @return {Promise<Array>} Lista de produtos
     */
    obterTodos: async function() {
        try {
            const response = await fetch(`${API_URL}/produtos`);
            if (!response.ok) {
                throw new Error('Erro ao obter produtos');
            }
            const produtos = await response.json();
            // Atualizar o cache local com os dados mais recentes
            this.salvarDadosLocais(produtos);
            return produtos;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            // Fallback para o banco local se o servidor estiver indisponível
            return this.obterDadosLocais();
        }
    },

    /**
     * Adiciona um novo produto
     * @param {Object} produto - Produto a ser adicionado
     * @return {Promise<Object>} Produto adicionado com ID
     */
    adicionar: async function(produto) {
        try {
            const response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao adicionar produto');
            }
            
            const produtoAdicionado = await response.json();
            
            // Após adicionar um produto com sucesso, atualizar o cache local
            // obtendo todos os produtos do servidor para garantir sincronização
            await this.obterTodos();
            
            return produtoAdicionado;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            // Fallback para o banco local
            return this.adicionarLocal(produto);
        }
    },

    /**
     * Atualiza um produto existente
     * @param {Object} produto - Produto com ID para atualizar
     * @return {Promise<Object|null>} Produto atualizado ou null se não encontrado
     */
    atualizar: async function(produto) {
        try {
            const response = await fetch(`${API_URL}/produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao atualizar produto');
            }
            
            const produtoAtualizado = await response.json();
            
            // Após atualizar um produto com sucesso, atualizar cache local
            await this.obterTodos();
            
            return produtoAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            // Fallback para o banco local
            return this.atualizarLocal(produto);
        }
    },

    /**
     * Remove um produto pelo ID
     * @param {number} id - ID do produto a remover
     * @return {Promise<boolean>} Verdadeiro se removido com sucesso
     */
    remover: async function(id) {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Após remover um produto com sucesso, atualizar cache local
                await this.obterTodos();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            // Fallback para o banco local
            return this.removerLocal(id);
        }
    },

    /**
     * Busca um produto pelo ID
     * @param {number} id - ID do produto a buscar
     * @return {Promise<Object|null>} Produto encontrado ou null
     */
    buscarPorId: async function(id) {
        try {
            const produtos = await this.obterTodos();
            return produtos.find(p => p.id === id) || null;
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            return null;
        }
    },

    /**
     * Filtra produtos por categoria
     * @param {string} categoria - Categoria para filtrar
     * @return {Promise<Array>} Lista de produtos filtrados
     */
    filtrarPorCategoria: async function(categoria) {
        try {
            const response = await fetch(`${API_URL}/produtos/categoria/${categoria}`);
            if (!response.ok) {
                throw new Error('Erro ao filtrar produtos por categoria');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao filtrar produtos por categoria:', error);
            
            // Fallback para filtro local
            const produtos = await this.obterTodos();
            if (categoria === 'tudo') {
                return produtos;
            }
            return produtos.filter(p => p.categoria === categoria);
        }
    },

    /**
     * Filtra produtos por faixa de preço
     * @param {string} faixa - Faixa de preço (ate50, ate100, acima100)
     * @return {Promise<Array>} Lista de produtos filtrados
     */
    filtrarPorPreco: async function(faixa) {
        try {
            const response = await fetch(`${API_URL}/produtos/preco/${faixa}`);
            if (!response.ok) {
                throw new Error('Erro ao filtrar produtos por preço');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao filtrar produtos por preço:', error);
            
            // Fallback para filtro local
            const produtos = await this.obterTodos();
            
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
        }
    },

    /**
     * Obter dados do localStorage como fallback
     * @return {Array} Lista de produtos do banco local
     */
    obterDadosLocais: function() {
        const dados = localStorage.getItem('jbimportes_produtos');
        return dados ? JSON.parse(dados) : [];
    },
    
    /**
     * Salvar dados no localStorage como fallback
     * @param {Array} produtos - Lista de produtos para salvar
     */
    salvarDadosLocais: function(produtos) {
        localStorage.setItem('jbimportes_produtos', JSON.stringify(produtos));
    },
    
    /**
     * Adicionar produto localmente como fallback
     * @param {Object} produto - Produto a ser adicionado
     * @return {Object} Produto adicionado com ID
     */
    adicionarLocal: function(produto) {
        const produtos = this.obterDadosLocais();
        produto.id = this.gerarIdLocal(produtos);
        produtos.push(produto);
        this.salvarDadosLocais(produtos);
        return produto;
    },
    
    /**
     * Atualizar produto localmente como fallback
     * @param {Object} produto - Produto com ID para atualizar
     * @return {Object|null} Produto atualizado ou null se não encontrado
     */
    atualizarLocal: function(produto) {
        let produtos = this.obterDadosLocais();
        const index = produtos.findIndex(p => p.id === produto.id);
        
        if (index === -1) return null;
        
        produtos[index] = produto;
        this.salvarDadosLocais(produtos);
        return produto;
    },
    
    /**
     * Remover produto localmente como fallback
     * @param {number} id - ID do produto a remover
     * @return {boolean} Verdadeiro se removido com sucesso
     */
    removerLocal: function(id) {
        let produtos = this.obterDadosLocais();
        const tamanhoAntes = produtos.length;
        produtos = produtos.filter(p => p.id !== id);
        
        if (produtos.length === tamanhoAntes) {
            return false;
        }
        
        this.salvarDadosLocais(produtos);
        return true;
    },
    
    /**
     * Gerar ID localmente como fallback
     * @param {Array} produtos - Lista de produtos existentes
     * @return {number} Novo ID
     */
    gerarIdLocal: function(produtos) {
        if (!produtos.length) return 1;
        return Math.max(...produtos.map(p => p.id)) + 1;
    }
};

// Inicializar o banco de dados ao carregar
db.init(); 