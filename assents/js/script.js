alert("Este site ainda está em fase de teste, valores e código ainda não coencidem de acordo com os dados no sistema integrado na fertem. Agradeço a compreensão!")

/*CARREGAMENTO DOS PRODUTOS NA PÁGINA*/
let Produtos = []

fetch("produtos-valores.json")
    .then(response => response.json())
    .then(data => {
        todosProdutos = data;
        exibirProdutos(todosProdutos);
    })

function exibirProdutos(produtos) {
    let containerProduto = document.querySelector('#produto')

    if (produtos.length === 0) {
        containerProduto.innerHTML = ` 
        <div style='color: red;' > 
        <p>Nenhum produto encontrado.</p>
        <li>Verifique se o nome do produto foi escrito corretamente.</li>
        <li>Nessa pesquisa todo tipo de acentuação gráfica é considerada.</li>
        </div>
        `;
        return;
    }

    containerProduto.innerHTML = "";
    produtos.forEach(item => {
        let section = document.createElement("section")
        section.innerHTML =
            `   <section class="product" title=${item.nome}>
                    <nav>
                        <img src=${item.imagem} alt=${item.nome} />
                    </nav>
                    <h2> ${item.nome}</h2>
                    <h3>Cód: ${item.id}</h3>
                    <p>
                        <span>R$</span> ${item.valor}
                    </p>
                    <div class="botao" nome="${item.nome}" valor="${item.valor}" "> 
                        <button> Adicionar </button>
                    </div>
                </section>`
        containerProduto.appendChild(section)
    })
}


/*EVENTO DE BUSCA DO PRODUTO*/
function pesquisarProdutos(nome) {
    const nomeLower = nome.toLowerCase();
    return todosProdutos.filter(item =>
        item.nome.toLowerCase().includes(nomeLower)
    );
}

const inputBusca = document.querySelector("#pesquisa");
inputBusca.addEventListener("input", () => {
    const nome = inputBusca.value.trim();
    if (nome === "") {
        exibirProdutos(todosProdutos);
    }
    else {
        const resultados = pesquisarProdutos(nome);
        exibirProdutos(resultados);
    }
});


//ABERTURA DO CARRINHO
function abrirCart() {
    const modal = document.getElementById('carrinho');
    modal.classList.add("abrir");

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'carrinho' || e.target.id === 'fc') {
            modal.classList.remove('abrir')
        }
    })
}


//CONFIRMANDO QUE O PRODUTO FOI ADICIONADO AO CARRINHO
let carrinho = []
var container = document.querySelector('.container-produtos')
var produtoCarrinho = document.querySelector('.produtos-adicionados')
var valorFinal = document.querySelector('.valor-total')
var localValor = document.querySelector('.valor-add')
var confirmacao = document.querySelector('.aviso')
var contador = document.querySelector('.contador')

function observacao(){
    let produtosAdicionados = document.querySelector('.produtos-adicionados')
    if(carrinho.length === 0){
        produtosAdicionados.innerHTML = 'Nenhum produto adicionado ao orçamento.'
        localValor.style.display = 'none'
    }
    else{
        localValor.style.display = 'flex'
    }
}
observacao()

container.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.botao')
    if (parentButton) {
        var nome = parentButton.getAttribute('nome')
        var valor = parseFloat(parentButton.getAttribute('valor'))
        addToCart(nome, valor)

        confirmacao.innerHTML = 'Produto Adicionado!'
        confirmacao.style.backgroundColor = 'tomato'
        confirmacao.style.color = 'white'
        confirmacao.style.padding = '10px'
        setTimeout(() => {
            confirmacao.innerHTML = ''
            confirmacao.style.backgroundColor = 'transparent'
            confirmacao.style.padding = '0px'
        }, 2000);
    }
})


//ADICIONA O PRODUTO NO CARRINHO
function addToCart(nome, valor) {
    var verificacao = carrinho.find(item => item.nome === nome)
    if (verificacao) {
        verificacao.quantidade += 1
    }
    else {
        carrinho.push({
            nome,
            valor,
            quantidade: 1,
        })
    }
    atualizarCarrinho()
}


//ATUALIZAÇÃO DO CARRINHO
function atualizarCarrinho() {
    produtoCarrinho.innerHTML = ""
    var total = 0
    carrinho.forEach(item => {
        var elementoCarrinho = document.createElement('div')
        
        elementoCarrinho.innerHTML = `
            <nav class="produto-interno">
                <p>${item.nome}</p>

                <div class="produto-valor">
                    <p>Qtd: ${item.quantidade}</p>
                    <p>R$ ${item.valor.toFixed(2)}</p>
                    <button class="remove" nome="${item.nome}" title="Excluir produto"></button>
                </div>
            </nav>
        `
        produtoCarrinho.appendChild(elementoCarrinho)
        total += item.valor * item.quantidade
    })

    valorFinal.innerHTML = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL" 
    })

    observacao()
    contador.innerHTML = carrinho.length
    
}


//REMOÇÃO DO PRODUTO NO CARRINHO
produtoCarrinho.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove")) {
        var nome = event.target.getAttribute("nome")
        removerProduto(nome)
    }
})
function removerProduto(nome) {
    var posicao = carrinho.findIndex(item => item.nome === nome)

    if (posicao !== -1) {
        var produto = carrinho[posicao]
        if (produto.quantidade > 1) {
            produto.quantidade -= 1
            atualizarCarrinho()
            return
        }
        carrinho.splice(posicao, 1)
        atualizarCarrinho()
        observacao()
    }
}
