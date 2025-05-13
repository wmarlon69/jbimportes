/**
 * JB IMPORTES - Banco de Dados SQL (MySQL)
 * Este arquivo fornece funções para gerenciar o banco de dados através de MySQL
 */

const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',      // Substitua pelo seu usuário MySQL
  password: '',      // Substitua pela sua senha MySQL
  database: 'jbimportes'
};

// Objeto do banco de dados
const db = {
  /**
   * Inicializa a conexão com o banco de dados
   */
  pool: null,

  /**
   * Inicializa o banco de dados
   */
  init: async function() {
    try {
      // Criar pool de conexões
      this.pool = mysql.createPool(dbConfig);
      
      console.log('Banco de dados SQL inicializado');
      
      // Verificar se as tabelas existem, senão criar
      await this.criarTabelas();
      
      // Retornar todos os produtos
      return await this.obterTodos();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados SQL:', error);
      throw error;
    }
  },

  /**
   * Cria as tabelas necessárias se não existirem
   */
  criarTabelas: async function() {
    try {
      const connection = await this.pool.getConnection();
      
      // Criar tabela de produtos
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS produtos (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nome VARCHAR(255) NOT NULL,
          preco DECIMAL(10, 2) NOT NULL,
          categoria VARCHAR(50) NOT NULL,
          imagem VARCHAR(500)
        )
      `);
      
      // Verificar se há produtos, senão inserir alguns padrão
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM produtos');
      
      if (rows[0].count === 0) {
        // Inserir produtos iniciais
        await connection.execute(`
          INSERT INTO produtos (nome, preco, categoria, imagem) VALUES
          ('Camiseta Básica', 49.90, 'masculino', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'),
          ('Vestido Floral', 89.90, 'feminino', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80'),
          ('Calça Jeans', 99.90, 'masculino', 'https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80'),
          ('WMarlon Special', 999.99, 'masculino', 'img/wm.jpg')
        `);
      }
      
      connection.release();
      console.log('Tabelas verificadas/criadas com sucesso');
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
      throw error;
    }
  },

  /**
   * Obtém todos os produtos
   * @return {Promise<Array>} Lista de produtos
   */
  obterTodos: async function() {
    try {
      const [rows] = await this.pool.execute('SELECT * FROM produtos');
      return rows.map(row => ({
        id: row.id,
        nome: row.nome,
        preco: parseFloat(row.preco),
        categoria: row.categoria,
        imagem: row.imagem
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
      const [result] = await this.pool.execute(
        'INSERT INTO produtos (nome, preco, categoria, imagem) VALUES (?, ?, ?, ?)',
        [produto.nome, produto.preco, produto.categoria, produto.imagem]
      );
      
      return {
        ...produto,
        id: result.insertId
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
      const [result] = await this.pool.execute(
        'UPDATE produtos SET nome = ?, preco = ?, categoria = ?, imagem = ? WHERE id = ?',
        [produto.nome, produto.preco, produto.categoria, produto.imagem, produto.id]
      );
      
      if (result.affectedRows === 0) {
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
   * @param {number} id - ID do produto a remover
   * @return {Promise<boolean>} Verdadeiro se removido com sucesso
   */
  remover: async function(id) {
    try {
      const [result] = await this.pool.execute(
        'DELETE FROM produtos WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return false;
    }
  },

  /**
   * Busca um produto pelo ID
   * @param {number} id - ID do produto a buscar
   * @return {Promise<Object|null>} Produto encontrado ou null
   */
  buscarPorId: async function(id) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM produtos WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        nome: row.nome,
        preco: parseFloat(row.preco),
        categoria: row.categoria,
        imagem: row.imagem
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
      
      const [rows] = await this.pool.execute(
        'SELECT * FROM produtos WHERE categoria = ?',
        [categoria]
      );
      
      return rows.map(row => ({
        id: row.id,
        nome: row.nome,
        preco: parseFloat(row.preco),
        categoria: row.categoria,
        imagem: row.imagem
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
      let query = 'SELECT * FROM produtos';
      
      if (faixa === 'ate50') {
        query += ' WHERE preco <= 50';
      } else if (faixa === 'ate100') {
        query += ' WHERE preco <= 100';
      } else if (faixa === 'acima100') {
        query += ' WHERE preco > 100';
      }
      
      const [rows] = await this.pool.execute(query);
      
      return rows.map(row => ({
        id: row.id,
        nome: row.nome,
        preco: parseFloat(row.preco),
        categoria: row.categoria,
        imagem: row.imagem
      }));
    } catch (error) {
      console.error('Erro ao filtrar produtos por preço:', error);
      return [];
    }
  }
};

module.exports = db; 