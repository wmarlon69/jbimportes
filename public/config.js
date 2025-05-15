/**
 * config.js - Arquivo de configurações da loja JB IMPORTES
 */

const CONFIG = {
    // Nome da loja
    nomeLoja: 'JB IMPORTES',
    
    // Versão do aplicativo
    versao: '1.0.0',
    
    // Configurações do sistema
    sistema: {
        // Local de armazenamento das imagens
        pastaImagens: 'img/',
        
        // Imagem padrão quando não encontrada
        imagemPadrao: 'img/imagem-indisponivel.jpg',
        
        // Limite de tamanho para upload de imagens (em bytes)
        limiteTamanhoImagem: 5 * 1024 * 1024, // 5MB
        
        // Tipos de arquivos permitidos para upload
        tiposArquivosPermitidos: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    
    // Categorias disponíveis
    categorias: [
        { id: 'tudo', nome: '✨ Tudo', icone: '✨' },
        { id: 'infantil', nome: '🧒 Infantil', icone: '🧒' },
        { id: 'feminino', nome: '👗 Feminino', icone: '👗' },
        { id: 'masculino', nome: '🧥 Masculino', icone: '🧥' }
    ],
    
    // Faixas de preço para filtro
    faixasPreco: [
        { id: 'tudo', nome: 'Todos' },
        { id: 'ate50', nome: 'Até R$50' },
        { id: 'ate100', nome: 'Até R$100' },
        { id: 'acima100', nome: 'Acima de R$100' }
    ],
    
    // Tamanhos disponíveis
    tamanhos: ['P', 'M', 'G', 'GG'],
    
    // Configurações de contato
    contato: {
        whatsapp: '5583996695516',
        instagram: 'jbimportes',
        email: 'contato@jbimportes.com.br'
    }
}; 