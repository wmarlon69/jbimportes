// Array de produtos (será substituído pelos dados do banco)
let produtos = [];

function abrirModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.nome;
    
    // Garantir que a imagem existe
    const imgElement = document.getElementById('modal-produto-img');
    imgElement.src = produto.imagem || '';
    imgElement.alt = produto.nome;
    
    document.getElementById('modal-produto-preco').textContent = formatarPreco(produto.preco);
    document.getElementById('tamanho').value = "";
    document.getElementById('modal-compra').style.display = 'flex';

    document.getElementById('finalizar-compra').onclick = function() {
        const tamanho = document.getElementById('tamanho').value;
        if (!tamanho) {
            alert('Selecione um tamanho!');
            return;
        }
        // Substitua o número abaixo pelo seu número do WhatsApp
        const numero = '5583996695516';
        const mensagem = encodeURIComponent(`Olá! Quero comprar: ${produto.nome} - Tamanho: ${tamanho}`);
        window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    };
}

document.getElementById('fechar-modal').onclick = function() {
    document.getElementById('modal-compra').style.display = 'none';
};
window.onclick = function(event) {
    if (event.target === document.getElementById('modal-compra')) {
        document.getElementById('modal-compra').style.display = 'none';
    }
};

let categoriaSelecionada = 'tudo';
let precoSelecionado = 'tudo';

// Função para formatar o preço
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função para carregar produtos do banco de dados
async function carregarProdutos() {
    // Mostrar indicador de carregamento
    document.getElementById("produtos").innerHTML = '<div class="loading">Carregando produtos...</div>';
    
    try {
        let produtosFiltrados = [];
        
        // Verificar se o banco de dados está disponível
        if (typeof db !== 'undefined') {
            // Usar o banco de dados
            if (categoriaSelecionada !== 'tudo' && precoSelecionado !== 'tudo') {
                // Filtrar por categoria e preço
                produtosFiltrados = await db.filtrarPorCategoria(categoriaSelecionada);
                
                // Aplicar filtro de preço
                if (precoSelecionado === "ate50") {
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 50);
                } else if (precoSelecionado === "ate100") {
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 100);
                } else if (precoSelecionado === "acima100") {
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco > 100);
                }
            } else if (categoriaSelecionada !== 'tudo') {
                // Filtrar apenas por categoria
                produtosFiltrados = await db.filtrarPorCategoria(categoriaSelecionada);
            } else if (precoSelecionado !== 'tudo') {
                // Filtrar apenas por preço
                produtosFiltrados = await db.filtrarPorPreco(precoSelecionado);
            } else {
                // Sem filtros
                produtosFiltrados = await db.obterTodos();
            }
        } else {
            console.warn('Banco de dados não disponível, usando array de produtos estático');
            produtosFiltrados = produtos;
        }
        
        return produtosFiltrados;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return []; // Retornar array vazio em caso de erro
    }
}

async function filtrarProdutos() {
    const produtosFiltrados = await carregarProdutos();
    renderizarProdutosFiltrados(produtosFiltrados);
}

document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filtro').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        categoriaSelecionada = this.dataset.categoria;
        filtrarProdutos();
    });
});

document.getElementById("faixa-preco").addEventListener("change", function() {
    precoSelecionado = this.value;
    filtrarProdutos();
});

function renderizarProdutosFiltrados(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    lista.forEach(produto => {
        const div = document.createElement("div");
        div.className = "produto";
        
        // Criar a imagem com tratamento de erro
        const imgSrc = produto.imagem || '';
        
        div.innerHTML = `
            <img src="${imgSrc}" alt="${produto.nome}" onerror="this.onerror=null; this.src='img/imagem-indisponivel.jpg'; this.alt='Imagem indisponível';">
            <h2>${produto.nome}</h2>
            <p>${formatarPreco(produto.preco)}</p>
            <button class="comprar-btn">Comprar</button>
        `;
        div.querySelector('.comprar-btn').onclick = () => {
            abrirModal(produto);
        };
        container.appendChild(div);
    });
}

// Adicionar estilos CSS para o indicador de carregamento
function adicionarEstilosCarregamento() {
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            text-align: center;
            padding: 30px;
            font-size: 18px;
            color: #bfa046;
        }

        .loading:after {
            content: "...";
            animation: dots 1.5s steps(5, end) infinite;
        }

        @keyframes dots {
            0%, 20% { content: "."; }
            40% { content: ".."; }
            60%, 100% { content: "..."; }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', async () => {
    // Adicionar estilos para o indicador de carregamento
    adicionarEstilosCarregamento();
    
    document.querySelector('.filtro[data-categoria="tudo"]').classList.add('active');
    
    // Carregar dados iniciais
    try {
        if (typeof db !== 'undefined') {
            produtos = await db.obterTodos();
        } else {
            console.warn('Banco de dados não disponível, carregando produtos padrão');
            // Dados padrão caso db.js não esteja carregado
            produtos = [
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
                    imagem: "https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
                }
            ];
        }
        
        // Mostrar os produtos na página
        await filtrarProdutos();
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
        document.getElementById("produtos").innerHTML = '<p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>';
    }
});