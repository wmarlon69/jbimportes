const produtos = [
    {
        nome: "Camiseta Básica",
        preco: "R$ 49,90",
        categoria: "masculino",
        imagem: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Vestido Floral",
        preco: "R$ 89,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Calça Jeans",
        preco: "R$ 99,90",
        categoria: "masculino",
        imagem: "https://imags.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "wmarlon",
        preco: "R$ 999,99",
        categoria: "masculino",
        imagem: "img/wm.jpg"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 59,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 5,90",
        categoria: "infantil",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },

    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        nome: "Saia Jeans",
        preco: "R$ 51,90",
        categoria: "feminino",
        imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    
];

function abrirModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.nome;
    document.getElementById('modal-produto-img').src = produto.imagem;
    document.getElementById('modal-produto-img').alt = produto.nome;
    document.getElementById('modal-produto-preco').textContent = produto.preco;
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

function filtrarProdutos() {
    let lista = produtos;

    // Filtro por categoria
    if (categoriaSelecionada !== 'tudo') {
        lista = lista.filter(p => p.categoria === categoriaSelecionada);
    }

    // Filtro por preço
    if (precoSelecionado === "ate50") {
        lista = lista.filter(p => parseFloat(p.preco.replace("R$", "").replace(",", ".")) <= 50);
    } else if (precoSelecionado === "ate100") {
        lista = lista.filter(p => parseFloat(p.preco.replace("R$", "").replace(",", ".")) <= 100);
    } else if (precoSelecionado === "acima100") {
        lista = lista.filter(p => parseFloat(p.preco.replace("R$", "").replace(",", ".")) > 100);
    }

    renderizarProdutosFiltrados(lista);
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
            <p>${produto.preco}</p>
            <button class="comprar-btn">Comprar</button>
        `;
        div.querySelector('.comprar-btn').onclick = () => {
            abrirModal(produto);
        };
        container.appendChild(div);
    });
}

// Inicialização
document.querySelector('.filtro[data-categoria="tudo"]').classList.add('active');
filtrarProdutos();