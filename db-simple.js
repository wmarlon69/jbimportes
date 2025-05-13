/**
 * db-simple.js - Sistema de banco de dados usando API REST
 * Permite gerenciar os produtos da loja JB IMPORTES
 */

// URL da API - será substituída automaticamente em produção
const API_URL = window.location.origin + '/api';

// Banco de dados usando API REST
const db = {
    // Obter todos os produtos
    async obterTodos() {
        try {
            const response = await fetch(`${API_URL}/produtos`);
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            return await response.json();
        } catch (e) {
            console.error('Erro ao obter produtos:', e);
            return [];
        }
    },
    
    // Função para converter imagem em base64
    async converterImagemParaBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Função para processar imagem antes de salvar
    async processarImagem(imagem) {
        if (typeof imagem === 'string' && imagem.startsWith('data:image')) {
            return imagem; // Já está em base64
        }
        if (imagem instanceof File) {
            return await this.converterImagemParaBase64(imagem);
        }
        return imagem; // URL da imagem
    },

    // Adicionar um novo produto
    async adicionar(produto) {
        try {
            const response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            if (!response.ok) throw new Error('Erro ao adicionar produto');
            return await response.json();
        } catch (e) {
            console.error('Erro ao adicionar produto:', e);
            return null;
        }
    },
    
    // Atualizar um produto existente
    async atualizar(produto) {
        try {
            const response = await fetch(`${API_URL}/produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            if (!response.ok) throw new Error('Erro ao atualizar produto');
            return true;
        } catch (e) {
            console.error('Erro ao atualizar produto:', e);
            return false;
        }
    },
    
    // Excluir um produto
    async excluir(id) {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao excluir produto');
            return true;
        } catch (e) {
            console.error('Erro ao excluir produto:', e);
            return false;
        }
    },
    
    // Buscar produto por ID
    async buscarPorId(id) {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar produto');
            return await response.json();
        } catch (e) {
            console.error('Erro ao buscar produto:', e);
            return null;
        }
    },
    
    // Filtrar produtos por categoria
    filtrarPorCategoria: function(categoria) {
        try {
            const produtos = this.obterTodos();
            return categoria === 'tudo' ? produtos : produtos.filter(p => p.categoria === categoria);
        } catch (e) {
            console.error('Erro ao filtrar por categoria:', e);
            return [];
        }
    },
    
    // Filtrar produtos por preço
    filtrarPorPreco: function(faixaPreco) {
        try {
            const produtos = this.obterTodos();
            if (faixaPreco === 'tudo') return produtos;
            
            if (faixaPreco === 'ate50') {
                return produtos.filter(p => p.preco <= 50);
            } 
            if (faixaPreco === 'ate100') {
                return produtos.filter(p => p.preco <= 100);
            }
            if (faixaPreco === 'acima100') {
                return produtos.filter(p => p.preco > 100);
            }
            
            return produtos;
        } catch (e) {
            console.error('Erro ao filtrar por preço:', e);
            return [];
        }
    },
    
    // Verificar se o usuário é administrador
    async verificarAdmin(senha) {
        try {
            // Se estiver em desenvolvimento local
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return senha === 'admin123';
            }
            
            const response = await fetch(`${API_URL}/admin`);
            if (!response.ok) throw new Error('Erro ao verificar senha');
            const admin = await response.json();
            console.log('Verificando senha:', { senhaFornecida: senha, senhaCorreta: admin.senha });
            return senha === admin.senha;
        } catch (e) {
            console.error('Erro ao verificar senha:', e);
            // Em caso de erro, permite login com senha padrão
            return senha === 'admin123';
        }
    },
    
    // Alterar senha do administrador
    async alterarSenhaAdmin(senhaAtual, novaSenha) {
        try {
            // Verificar senha atual primeiro
            const senhaCorreta = await this.verificarAdmin(senhaAtual);
            if (!senhaCorreta) {
                return false;
            }

            const response = await fetch(`${API_URL}/admin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ senha: novaSenha })
            });
            if (!response.ok) throw new Error('Erro ao alterar senha');
            return true;
        } catch (e) {
            console.error('Erro ao alterar senha:', e);
            return false;
        }
    },
    
    // Exportar dados em formato JSON
    exportarDados: function() {
        return JSON.stringify(this.obterTodos(), null, 2);
    },
    
    // Importar dados a partir de JSON
    importarDados: function(jsonData) {
        try {
            const dados = JSON.parse(jsonData);
            if (Array.isArray(dados)) {
                localStorage.setItem(PRODUTOS_KEY, JSON.stringify(dados));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    },
    
    // Reiniciar a senha para o padrão
    async resetarSenha() {
        try {
            const response = await fetch(`${API_URL}/admin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ senha: 'admin123' })
            });
            if (!response.ok) throw new Error('Erro ao resetar senha');
            console.log('Senha resetada para o padrão: admin123');
            return true;
        } catch (e) {
            console.error('Erro ao resetar senha:', e);
            return false;
        }
    }
};

// Inicialização - verificar se há produtos armazenados
(function() {
    // Se não houver produtos armazenados, carregar os produtos padrão
    if (!localStorage.getItem(PRODUTOS_KEY)) {
        db.carregarProdutosPadrao();
        console.log('Banco de dados inicializado com produtos padrão');
    }
    
    // Se não houver senha de admin definida, criar uma padrão
    if (!localStorage.getItem(ADMIN_KEY)) {
        localStorage.setItem(ADMIN_KEY, 'admin123');
        console.log('Senha de administrador padrão definida: admin123');
    }
    
    // Verificar se o localStorage está funcionando
    try {
        localStorage.setItem('teste', 'teste');
        localStorage.removeItem('teste');
        console.log('localStorage funcionando corretamente');
    } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
        alert('Seu navegador não suporta localStorage ou está bloqueado. O sistema não funcionará corretamente.');
    }
})(); 