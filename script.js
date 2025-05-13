// Array de produtos (será substituído pelos dados do banco)
let produtos = [];

function abrirModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.nome;
    document.getElementById('modal-produto-img').src = produto.imagem;
    document.getElementById('modal-produto-img').alt = produto.nome;
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
function carregarProdutos() {
    // Verificar se o banco de dados está disponível
    if (typeof db !== 'undefined') {
        // Usar o banco de dados
        if (categoriaSelecionada !== 'tudo' && precoSelecionado !== 'tudo') {
            // Filtrar por categoria e preço
            let produtosFiltrados = db.filtrarPorCategoria(categoriaSelecionada);
            
            // Aplicar filtro de preço
            if (precoSelecionado === "ate50") {
                produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 50);
            } else if (precoSelecionado === "ate100") {
                produtosFiltrados = produtosFiltrados.filter(p => p.preco <= 100);
            } else if (precoSelecionado === "acima100") {
                produtosFiltrados = produtosFiltrados.filter(p => p.preco > 100);
            }
            
            return produtosFiltrados;
        } else if (categoriaSelecionada !== 'tudo') {
            // Filtrar apenas por categoria
            return db.filtrarPorCategoria(categoriaSelecionada);
        } else if (precoSelecionado !== 'tudo') {
            // Filtrar apenas por preço
            return db.filtrarPorPreco(precoSelecionado);
        } else {
            // Sem filtros
            return db.obterTodos();
        }
    } else {
        console.warn('Banco de dados não disponível, usando array de produtos estático');
        return produtos;
    }
}

function filtrarProdutos() {
    const produtosFiltrados = carregarProdutos();
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
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
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

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.filtro[data-categoria="tudo"]').classList.add('active');
    
    // Carregar dados iniciais
    if (typeof db !== 'undefined') {
        produtos = db.obterTodos();
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
                imagem: "https://imags.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
            }
        ];
    }
    
    filtrarProdutos();
});