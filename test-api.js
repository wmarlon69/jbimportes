// Script para testar as APIs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPostProduto() {
    console.log('Testando criação de produto...');
    
    const produto = {
        nome: 'Produto Teste',
        preco: 99.99,
        categoria: 'outros',
        descricao: 'Um produto de teste',
        imagem: 'https://via.placeholder.com/150'
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': '123456'
            },
            body: JSON.stringify(produto)
        });
        
        console.log('Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Produto criado com sucesso:', data);
        } else {
            const error = await response.text();
            console.error('Erro ao criar produto:', error);
        }
    } catch (error) {
        console.error('Exceção ao criar produto:', error);
    }
}

async function testGetProdutos() {
    console.log('Testando listagem de produtos...');
    
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        
        console.log('Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Produtos encontrados:', data.length);
            console.log('Primeiro produto (se existir):', data[0] || 'Nenhum produto encontrado');
        } else {
            const error = await response.text();
            console.error('Erro ao listar produtos:', error);
        }
    } catch (error) {
        console.error('Exceção ao listar produtos:', error);
    }
}

// Executar os testes
async function runTests() {
    await testGetProdutos();
    await testPostProduto();
    await testGetProdutos();
}

runTests().catch(console.error); 