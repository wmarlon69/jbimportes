/**
 * JB IMPORTES - Banco de Dados MongoDB Atlas
 * Este arquivo fornece funções para gerenciar o banco de dados através do MongoDB Atlas
 */

const { MongoClient, ObjectId } = require('mongodb');

// URL de conexão do MongoDB Atlas - substitua pela sua URL quando criar a conta
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://usuario:senha@cluster0.mongodb.net/jbimportes';

// Objeto do banco de dados
const db = {
  /**
   * Cliente e conexão MongoDB
   */
  client: null,
  dbInstance: null,
  collection: null,

  /**
   * Inicializa o banco de dados
   */
  init: async function() {
    try {
      if (!this.client) {
        this.client = new MongoClient(MONGODB_URI);
        await this.client.connect();
        console.log('Conectado ao MongoDB Atlas');
        
        this.dbInstance = this.client.db();
        this.collection = this.dbInstance.collection('produtos');
        
        // Verificar se há produtos, senão inserir alguns padrão
        const count = await this.collection.countDocuments();
        
        if (count === 0) {
          console.log('Inserindo produtos iniciais...');
          await this.collection.insertMany([
            {
              nome: "Camiseta Básica",
              preco: 49.90,
              categoria: "masculino",
              imagem: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
            },
            {
              nome: "Vestido Floral",
              preco: 89.90,
              categoria: "feminino",
              imagem: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
            },
            {
              nome: "Calça Jeans",
              preco: 99.90,
              categoria: "masculino",
              imagem: "https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
            },
            {
              nome: "WMarlon Special",
              preco: 999.99,
              categoria: "masculino",
              imagem: "img/wm.jpg"
            }
          ]);
        }
      }
      
      return await this.obterTodos();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados MongoDB:', error);
      throw error;
    }
  },

  /**
   * Obtém todos os produtos
   * @return {Promise<Array>} Lista de produtos
   */
  obterTodos: async function() {
    try {
      const produtos = await this.collection.find({}).toArray();
      return produtos.map(p => ({
        id: p._id.toString(),
        nome: p.nome,
        preco: p.preco,
        categoria: p.categoria,
        imagem: p.imagem
      }));
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return [];
    }
  },

  /**
   * Adiciona um novo produto
   * @param {Object} produto - Produto a ser adicionado
   * @return {Promise<Object>} Produto adicionado com ID
   */
  adicionar: async function(produto) {
    try {
      const result = await this.collection.insertOne(produto);
      return {
        ...produto,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },

  /**
   * Atualiza um produto existente
   * @param {Object} produto - Produto com ID para atualizar
   * @return {Promise<Object|null>} Produto atualizado ou null se não encontrado
   */
  atualizar: async function(produto) {
    try {
      const id = produto.id;
      const { id: _, ...dadosProduto } = produto;
      
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: dadosProduto }
      );
      
      if (result.matchedCount === 0) {
        return null;
      }
      
      return produto;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  /**
   * Remove um produto pelo ID
   * @param {number|string} id - ID do produto a remover
   * @return {Promise<boolean>} Verdadeiro se removido com sucesso
   */
  remover: async function(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return false;
    }
  },

  /**
   * Busca um produto pelo ID
   * @param {number|string} id - ID do produto a buscar
   * @return {Promise<Object|null>} Produto encontrado ou null
   */
  buscarPorId: async function(id) {
    try {
      const produto = await this.collection.findOne({ _id: new ObjectId(id) });
      
      if (!produto) {
        return null;
      }
      
      return {
        id: produto._id.toString(),
        nome: produto.nome,
        preco: produto.preco,
        categoria: produto.categoria,
        imagem: produto.imagem
      };
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
      if (categoria === 'tudo') {
        return await this.obterTodos();
      }
      
      const produtos = await this.collection.find({ categoria }).toArray();
      
      return produtos.map(p => ({
        id: p._id.toString(),
        nome: p.nome,
        preco: p.preco,
        categoria: p.categoria,
        imagem: p.imagem
      }));
    } catch (error) {
      console.error('Erro ao filtrar produtos por categoria:', error);
      return [];
    }
  },

  /**
   * Filtra produtos por faixa de preço
   * @param {string} faixa - Faixa de preço (ate50, ate100, acima100)
   * @return {Promise<Array>} Lista de produtos filtrados
   */
  filtrarPorPreco: async function(faixa) {
    try {
      let filtro = {};
      
      if (faixa === 'ate50') {
        filtro = { preco: { $lte: 50 } };
      } else if (faixa === 'ate100') {
        filtro = { preco: { $lte: 100 } };
      } else if (faixa === 'acima100') {
        filtro = { preco: { $gt: 100 } };
      }
      
      const produtos = await this.collection.find(filtro).toArray();
      
      return produtos.map(p => ({
        id: p._id.toString(),
        nome: p.nome,
        preco: p.preco,
        categoria: p.categoria,
        imagem: p.imagem
      }));
    } catch (error) {
      console.error('Erro ao filtrar produtos por preço:', error);
      return [];
    }
  }
};

module.exports = db; 