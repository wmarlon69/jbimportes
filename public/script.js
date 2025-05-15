// Array de produtos (será substituído pelos dados da API)
let produtos = [];

function abrirModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.nome;
    
    // Garantir que a imagem existe
    const imgElement = document.getElementById('modal-produto-img');
    const imgSrc = verificarCaminhoImagem(produto.imagem);
    imgElement.src = imgSrc;
    imgElement.alt = produto.nome;
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = 'img/imagem-indisponivel.jpg';
        this.alt = 'Imagem indisponível';
    };
    
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

// Função para verificar e corrigir caminhos de imagem
function verificarCaminhoImagem(imagem) {
    if (!imagem) return 'img/imagem-indisponivel.jpg';
    
    // Se a imagem já contém http ou https, retornar como está
    if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
        return imagem;
    }
    
    // Se é um caminho local começando com 'img/', garantir que o caminho está correto
    if (imagem.startsWith('img/')) {
        return imagem;
    }
    
    // Se é apenas um nome de arquivo sem o prefixo img/, adicionar o prefixo
    if (!imagem.includes('/')) {
        return `img/${imagem}`;
    }
    
    return imagem;
}

// Função para carregar produtos da API
async function carregarProdutos() {
    // Mostrar indicador de carregamento
    document.getElementById("produtos").innerHTML = '<div class="loading">Carregando produtos...</div>';
    
    try {
        // Fazer requisição para a API
        const response = await fetch('/api/produtos');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos da API');
        }
        
        let produtos = await response.json();
        let produtosFiltrados = produtos;
        
        // Aplicar filtros
        if (categoriaSelecionada !== 'tudo') {
            produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaSelecionada);
        }
        
        if (precoSelecionado !== 'tudo') {
            switch (precoSelecionado) {
                case 'ate50':
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 50);
                    break;
                case 'ate100':
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 100);
                    break;
                case 'acima100':
                    produtosFiltrados = produtosFiltrados.filter(p => p.preco > 100);
                    break;
            }
        }
        
        // Garantir que todas as imagens têm caminhos válidos
        produtosFiltrados = produtosFiltrados.map(produto => ({
            ...produto,
            imagem: verificarCaminhoImagem(produto.imagem)
        }));
        
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
        const imgSrc = verificarCaminhoImagem(produto.imagem);
        
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
    
    // Ativar o filtro "tudo" por padrão
    const filtroTudo = document.querySelector('.filtro[data-categoria="tudo"]');
    if (filtroTudo) {
        filtroTudo.classList.add('active');
    }
    
    // Criar um arquivo de imagem indisponível se não existir
    function criarImagemIndisponivel() {
        fetch('img/imagem-indisponivel.jpg')
            .then(response => {
                if (!response.ok) {
                    console.warn('Imagem indisponível não encontrada. Usando placeholder.');
                }
            })
            .catch(error => {
                console.error('Erro ao verificar imagem indisponível:', error);
            });
    }
    
    criarImagemIndisponivel();
    
    // Carregar produtos iniciais
    try {
        const produtos = await carregarProdutos();
        renderizarProdutosFiltrados(produtos);
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
        document.getElementById("produtos").innerHTML = 
            '<p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>';
    }
});