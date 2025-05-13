/**
 * JB IMPORTES - Arquivo de configuração
 * Este arquivo contém configurações globais do sistema
 */

// Configurações de acesso ao painel administrativo
const CONFIG = {
    // Senha para acesso ao painel administrativo
    SENHA_ADMIN: "123456",
    
    // Redirecionar automaticamente para a página de login se não estiver autenticado
    REDIRECIONAR_SEM_AUTENTICACAO: true,
    
    // Tempo de expiração da sessão (em minutos)
    TEMPO_EXPIRACAO_SESSAO: 30,
    
    // Outras configurações do sistema
    NOME_LOJA: "JB IMPORTES",
    MOEDA: "R$",
    
    // Categorias disponíveis
    CATEGORIAS: [
        {id: "infantil", nome: "Infantil", icone: "🧒"},
        {id: "feminino", nome: "Feminino", icone: "👗"},
        {id: "masculino", nome: "Masculino", icone: "🧥"}
    ],
    
    // Tamanhos disponíveis
    TAMANHOS: ["P", "M", "G", "GG"]
}; 