/**
 * JB IMPORTES - Script de configuração do banco de dados
 * Este script cria o banco de dados e as tabelas necessárias para o sistema
 */

const mysql = require('mysql2/promise');

// Configuração da conexão com o MySQL
const config = {
  host: 'localhost',
  user: 'root',      // Substitua pelo seu usuário MySQL
  password: ''       // Substitua pela sua senha MySQL
};

// Configuração da conexão após criar o banco
const dbConfig = {
  ...config,
  database: 'jbimportes'
};

// Função para criar o banco de dados e tabelas
async function setupDatabase() {
  let connection;
  
  try {
    console.log('Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    
    // Criar banco de dados se não existir
    console.log('Criando banco de dados jbimportes se não existir...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS jbimportes`);
    
    // Fechar conexão inicial
    await connection.end();
    
    // Reconectar ao novo banco de dados
    console.log('Conectando ao banco de dados jbimportes...');
    connection = await mysql.createConnection(dbConfig);
    
    // Criar tabela de produtos
    console.log('Criando tabela de produtos...');
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
      console.log('Inserindo produtos iniciais...');
      // Inserir produtos iniciais
      await connection.execute(`
        INSERT INTO produtos (nome, preco, categoria, imagem) VALUES
        ('Camiseta Básica', 49.90, 'masculino', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'),
        ('Vestido Floral', 89.90, 'feminino', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80'),
        ('Calça Jeans', 99.90, 'masculino', 'https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80'),
        ('WMarlon Special', 999.99, 'masculino', 'img/wm.jpg'),
        ('Saia Jeans', 59.90, 'feminino', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'),
        ('Saia Jeans Infantil', 5.90, 'infantil', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80')
      `);
    }
    
    console.log('Configuração do banco de dados concluída com sucesso!');
    console.log('-----------------------------------------------');
    console.log('Informações importantes:');
    console.log('1. O MySQL deve estar em execução');
    console.log('2. Se você alterou o usuário ou senha, atualize os arquivos:');
    console.log('   - setup-db.js');
    console.log('   - db-sql.js');
    console.log('3. Para iniciar o servidor:');
    console.log('   npm start');
    console.log('-----------------------------------------------');
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar a configuração
setupDatabase(); 