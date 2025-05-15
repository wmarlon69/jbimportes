// Configurações do sistema
const config = {
    // Senha do administrador (você pode alterar para a senha que desejar)
    adminPassword: "123456",
    
    // Função para verificar a senha do administrador
    verificarSenhaAdmin: function(senha) {
        return senha === this.adminPassword;
    }
};

module.exports = config; 