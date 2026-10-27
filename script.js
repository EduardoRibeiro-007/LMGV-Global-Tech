
/* ==========================================
   01. CONFIGURAÇÕES GERAIS
========================================== */

// Número do WhatsApp da loja
const WA = "5511975585731";

// Categorias disponíveis
const CATS = [
    "Todos",
    "Eletrônicos",
    "Perfumes",
    "Importados",
    "Ofertas"
];

// Valor mínimo para frete grátis
const FRETE_GRATIS = 299;

// Desconto para pagamentos via PIX
const DESCONTO_PIX = 0.05;


/* ==========================================
   02. CATÁLOGO DE PRODUTOS
========================================== */

const P = [
    {
        id: 1,
        n: "Smartphone Pro 256 GB",
        c: "Eletrônicos",
        e: "📱",
        p: 3499,
        o: 4299,
        r: 4.8,
        v: 312,
        s: 7,
        t: ["#1a6bff", "#0a1d4d"]
    },
    {
        id: 2,
        n: "Notebook Ultra 15 pol. 16 GB",
        c: "Eletrônicos",
        e: "💻",
        p: 4890,
        o: 5990,
        r: 4.7,
        v: 148,
        s: 4,
        t: ["#3a4a72", "#0b1020"]
    },
    {
        id: 3,
        n: "Fone Bluetooth com cancelamento de ruído",
        c: "Eletrônicos",
        e: "🎧",
        p: 429,
        o: 699,
        r: 4.6,
        v: 870,
        s: 23,
        t: ["#2b6bff", "#0d2a6b"]
    },
    {
        id: 4,
        n: "Smartwatch Fit com GPS",
        c: "Eletrônicos",
        e: "⌚",
        p: 549,
        o: 799,
        r: 4.5,
        v: 455,
        s: 12,
        t: ["#5b7bd6", "#16224a"]
    },
    {
        id: 5,
        n: "Caixa de som portátil à prova d’água",
        c: "Eletrônicos",
        e: "🔊",
        p: 259,
        o: 389,
        r: 4.7,
        v: 640,
        s: 31,
        t: ["#1a6bff", "#05122e"]
    },
    {
        id: 6,
        n: "Perfume árabe Oud 100 ml",
        c: "Perfumes",
        e: "🧴",
        p: 389,
        o: 520,
        r: 4.9,
        v: 233,
        s: 9,
        t: ["#8a5a14", "#2a1a05"]
    },
    {
        id: 7,
        n: "Eau de parfum floral feminino 50 ml",
        c: "Perfumes",
        e: "🌸",
        p: 329,
        o: 459,
        r: 4.8,
        v: 301,
        s: 5,
        t: ["#c2517a", "#3b1226"]
    },
    {
        id: 8,
        n: "Perfume masculino amadeirado 100 ml",
        c: "Perfumes",
        e: "🧴",
        p: 299,
        o: 410,
        r: 4.7,
        v: 512,
        s: 18,
        t: ["#2f5f6e", "#0b1f26"]
    },
    {
        id: 9,
        n: "Console portátil com 64 GB",
        c: "Importados",
        e: "🎮",
        p: 2199,
        o: 2699,
        r: 4.8,
        v: 96,
        s: 3,
        t: ["#6a3df0", "#1c0f4a"]
    },
    {
        id: 10,
        n: "Óculos de sol polarizado",
        c: "Importados",
        e: "🕶️",
        p: 219,
        o: 349,
        r: 4.4,
        v: 187,
        s: 26,
        t: ["#555f73", "#10141f"]
    },
    {
        id: 11,
        n: "Câmera de ação 4K à prova d’água",
        c: "Importados",
        e: "📷",
        p: 899,
        o: 1199,
        r: 4.6,
        v: 210,
        s: 8,
        t: ["#e0702b", "#40180a"]
    },
    {
        id: 12,
        n: "Kit skincare importado 5 itens",
        c: "Importados",
        e: "🧼",
        p: 279,
        o: 399,
        r: 4.7,
        v: 143,
        s: 14,
        t: ["#2ba58f", "#0a3027"]
    }
];


/* ==========================================
   03. FUNÇÕES AUXILIARES
========================================== */

// Seleciona um elemento HTML
const $ = (seletor) => document.querySelector(seletor);

// Formata valores em reais
const f = (valor) => {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

// Calcula a porcentagem de desconto
const off = (produto) => {
    return Math.round(
        (1 - produto.p / produto.o) * 100
    );
};

// Localiza um produto pelo ID
function buscarProduto(id) {
    return P.find(produto => produto.id === Number(id));
}


/* ==========================================
   04. VARIÁVEIS DE CONTROLE
========================================== */

// Categoria selecionada
let cat = "Todos";

// Texto pesquisado
let q = "";

// Ordenação dos produtos
let sort = "rel";

// Produtos adicionados ao carrinho
let cart = {};

// Produtos favoritos
let wish = [];

// Valor percentual do cupom
let cup = 0;

// Informações de entrega
let ship = null;

// Forma de pagamento
let pay = "pix";

// Controla a visualização dos favoritos
let onlyFavorites = false;


/* ==========================================
   05. CARREGAMENTO DOS DADOS SALVOS
========================================== */

try {
    cart = JSON.parse(
        localStorage.getItem("lmgv-cart")
    ) || {};

    wish = JSON.parse(
        localStorage.getItem("lmgv-wish")
    ) || [];

} catch (erro) {
    cart = {};
    wish = [];
    console.warn("Não foi possível carregar os dados.", erro);
}

// Valida os dados recuperados
if (
    typeof cart !== "object" ||
    cart === null ||
    Array.isArray(cart)
) {
    cart = {};
}

if (!Array.isArray(wish)) {
    wish = [];
}

// Remove produtos inexistentes ou quantidades inválidas
cart = Object.fromEntries(
    Object.entries(cart)
        .map(([id, quantidade]) => {
            const produto = buscarProduto(id);

            if (!produto) {
                return null;
            }

            const numero = Number(quantidade);

            if (!Number.isFinite(numero) || numero <= 0) {
                return null;
            }

            return [
                produto.id,
                Math.min(Math.floor(numero), produto.s)
            ];
        })
        .filter(Boolean)
);

// Mantém apenas favoritos válidos
wish = [
    ...new Set(
        wish.map(Number).filter(id => buscarProduto(id))
    )
];


/* ==========================================
   06. SALVAR DADOS NO NAVEGADOR
========================================== */

function save() {
    try {
        localStorage.setItem(
            "lmgv-cart",
            JSON.stringify(cart)
        );

        localStorage.setItem(
            "lmgv-wish",
            JSON.stringify(wish)
        );

    } catch (erro) {
        console.warn("Não foi possível salvar os dados.", erro);
    }
}


/* ==========================================
   07. CRIAÇÃO DOS CARDS DOS PRODUTOS
========================================== */

function card(produto) {

    // Determina a quantidade de parcelas
    const parcelas =
        produto.p >= 500 ? 10 :
        produto.p >= 150 ? 6 : 3;

    // Verifica se o produto está nos favoritos
    const favorito = wish.includes(produto.id);

    // Verifica se o estoque está baixo
    const estoqueBaixo = produto.s <= 5;

    return `
        <article class="card">

            <!-- Botão de favoritos -->
            <button
                class="hb ${favorito ? "on" : ""}"
                data-w="${produto.id}"
                aria-label="Favoritar ${produto.n}"
            >
                ♥
            </button>

            <!-- Imagem ilustrativa do produto -->
            <div
                class="ph"
                style="background: linear-gradient(
                    135deg,
                    ${produto.t[0]},
                    ${produto.t[1]}
                )"
            >
                <span>${produto.e}</span>

                <i>-${off(produto)}%</i>
            </div>

            <!-- Informações do produto -->
            <div class="bd">

                <small>${produto.c}</small>

                <h3>${produto.n}</h3>

                <!-- Avaliações -->
                <div class="st">
                    ${"★".repeat(Math.round(produto.r))}

                    <em>
                        ${produto.r} (${produto.v})
                    </em>
                </div>

                <!-- Preço original -->
                <s>${f(produto.o)}</s>

                <!-- Preço promocional -->
                <strong>${f(produto.p)}</strong>

                <!-- Preço no PIX -->
                <div class="px">
                    ${f(produto.p * (1 - DESCONTO_PIX))}
                    no PIX
                </div>

                <!-- Parcelamento -->
                <div class="in">
                    ou ${parcelas}x de
                    ${f(produto.p / parcelas)}
                    sem juros
                </div>

                <!-- Aviso de estoque baixo -->
                ${
                    estoqueBaixo
                        ? `<div class="lw">
                               Restam ${produto.s} unidades
                           </div>`
                        : ""
                }

                <!-- Botão adicionar -->
                <button
                    class="add"
                    data-a="${produto.id}"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </article>
    `;
}


/* ==========================================
   08. FILTRAGEM E ORDENAÇÃO DOS PRODUTOS
========================================== */

function list() {

    let produtos = P.filter(produto => {

        // Filtro por categoria
        const categoriaValida =
            cat === "Todos" ||
            produto.c === cat ||
            (
                cat === "Ofertas" &&
                off(produto) >= 25
            );

        // Filtro por texto pesquisado
        const pesquisaValida = produto.n
            .toLowerCase()
            .includes(q.toLowerCase());

        // Filtro de favoritos
        const favoritoValido =
            !onlyFavorites ||
            wish.includes(produto.id);

        return (
            categoriaValida &&
            pesquisaValida &&
            favoritoValido
        );
    });


    /* Ordenação */

    if (sort === "lo") {
        produtos.sort((a, b) => a.p - b.p);
    }

    if (sort === "hi") {
        produtos.sort((a, b) => b.p - a.p);
    }

    if (sort === "of") {
        produtos.sort((a, b) => off(b) - off(a));
    }

    if (sort === "rel") {
        produtos.sort((a, b) => b.v - a.v);
    }


    /* Exibição dos produtos */

    $("#gr").innerHTML = produtos
        .map(card)
        .join("");

    $("#em").style.display =
        produtos.length ? "none" : "block";


    /* Menu de navegação */

    $("#nv").innerHTML = CATS.map(categoria => `
        <button
            data-go="${categoria}"
            class="${categoria === cat ? "on" : ""}"
        >
            ${categoria}
        </button>
    `).join("");


    /* Filtros do catálogo */

    $("#fl").innerHTML = CATS.map(categoria => `
        <button
            class="ch ${categoria === cat ? "on" : ""}"
            data-go="${categoria}"
        >
            ${categoria}
        </button>
    `).join("") + `

        <select id="so" aria-label="Ordenar produtos">

            <option value="rel">
                Mais vendidos
            </option>

            <option value="lo">
                Menor preço
            </option>

            <option value="hi">
                Maior preço
            </option>

            <option value="of">
                Maior desconto
            </option>

        </select>
    `;

    $("#so").value = sort;

    // Atualiza o contador de favoritos
    $("#wc").textContent = wish.length;
}


/* ==========================================
   09. OFERTAS DO DIA
========================================== */

function deals() {

    // Seleciona os quatro maiores descontos
    const ofertas = [...P]
        .sort((a, b) => off(b) - off(a))
        .slice(0, 4);

    $("#dl").innerHTML = ofertas
        .map(card)
        .join("");
}


/* ==========================================
   10. CONTADOR REGRESSIVO
========================================== */

function tick() {

    const agora = new Date();

    // Define o final do dia
    const fim = new Date(agora);

    fim.setHours(24, 0, 0, 0);

    // Calcula os segundos restantes
    const segundos = Math.floor(
        (fim - agora) / 1000
    );

    // Adiciona zero à esquerda
    const zero = valor =>
        String(valor).padStart(2, "0");

    const horas = Math.floor(segundos / 3600);

    const minutos = Math.floor(
        (segundos % 3600) / 60
    );

    const segundosRestantes = segundos % 60;

    $("#tm").textContent = `
        ${zero(horas)}:
        ${zero(minutos)}:
        ${zero(segundosRestantes)}
    `.replace(/\s/g, "");
}


/* ==========================================
   11. NOTIFICAÇÕES DO SITE
========================================== */

let toastTimer;

function toast(mensagem) {

    const elemento = $("#ts");

    elemento.textContent = mensagem;

    elemento.classList.add("on");

    // Cancela o temporizador anterior
    clearTimeout(toastTimer);

    // Oculta a mensagem depois de 1,8 segundo
    toastTimer = setTimeout(() => {
        elemento.classList.remove("on");
    }, 1800);
}


/* ==========================================
   12. ITENS DO CARRINHO
========================================== */

function items() {

    return Object.keys(cart)
        .map(id => ({
            p: buscarProduto(id),
            q: cart[id]
        }))
        .filter(item => item.p);
}


/* ==========================================
   13. CÁLCULO DO CARRINHO
========================================== */

function calc() {

    const produtos = items();

    // Calcula o subtotal
    const subtotal = produtos.reduce(
        (total, item) => {
            return total + item.p.p * item.q;
        },
        0
    );

    // Desconto do cupom
    const descontoCupom = subtotal * cup;

    // Valor depois do cupom
    const valorComCupom =
        subtotal - descontoCupom;

    // Desconto no PIX
    const descontoPix = pay === "pix"
        ? valorComCupom * DESCONTO_PIX
        : 0;

    // Frete
    const frete = ship
        ? (
            subtotal >= FRETE_GRATIS
                ? 0
                : ship.fee
        )
        : 0;

    // Total
    const total =
        subtotal -
        descontoCupom -
        descontoPix +
        frete;

    return {
        it: produtos,
        sub: subtotal,
        dc: descontoCupom,
        px: descontoPix,
        sh: frete,
        tot: total
    };
}


/* ==========================================
   14. ATUALIZAÇÃO VISUAL DO CARRINHO
========================================== */

function drawCart() {

    const carrinho = calc();

    // Quantidade total de produtos
    const quantidade = carrinho.it.reduce(
        (total, item) => total + item.q,
        0
    );

    $("#cc").textContent = quantidade;


    /* Lista de produtos */

    if (carrinho.it.length) {

        $("#ci").innerHTML = carrinho.it.map(item => `

            <div class="it">

                <span>${item.p.e}</span>

                <div>

                    ${item.p.n}

                    <div class="qt">

                        <button
                            data-m="${item.p.id}"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        ${item.q}

                        <button
                            data-pl="${item.p.id}"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>

                    </div>

                </div>

                <b>
                    ${f(item.p.p * item.q)}
                </b>

            </div>

        `).join("");

    } else {

        $("#ci").innerHTML = `
            <p style="color: var(--mu)">
                Seu carrinho está vazio.
                Adicione produtos para ver o total,
                o frete e as formas de pagamento.
            </p>
        `;
    }


    /* Barra de frete grátis */

    const progresso = Math.min(
        100,
        carrinho.sub / FRETE_GRATIS * 100
    );

    const mensagemFrete =
        carrinho.sub >= FRETE_GRATIS
            ? "Você ganhou frete grátis"
            : `Faltam ${f(FRETE_GRATIS - carrinho.sub)}
               para o frete grátis`;


    /* Resumo e finalização */

    $("#df").innerHTML = `

        <div>${mensagemFrete}</div>

        <div class="pb">
            <div style="width: ${progresso}%"></div>
        </div>

        <!-- Consulta de CEP -->
        <div class="rw">

            <input
                id="cep"
                inputmode="numeric"
                maxlength="9"
                placeholder="CEP"
                value="${ship ? ship.cep : ""}"
            >

            <button id="cb2">
                Calcular frete
            </button>

        </div>

        ${
            ship
                ? `<div style="color: var(--mu)">
                       Entrega em ${ship.days}
                       dias úteis (estimativa)
                   </div>`
                : ""
        }

        <!-- Cupom de desconto -->
        <div class="rw">

            <input
                id="cp"
                placeholder="Cupom (teste: LMGV10)"
            >

            <button id="cb3">
                Aplicar
            </button>

        </div>

        <!-- Forma de pagamento -->
        <div class="rw">

            <label>
                <input
                    type="radio"
                    name="pg"
                    value="pix"
                    ${pay === "pix" ? "checked" : ""}
                >
                PIX (5% off)
            </label>

            <label style="margin-left: 12px">

                <input
                    type="radio"
                    name="pg"
                    value="cartao"
                    ${pay === "cartao" ? "checked" : ""}
                >

                Cartão

            </label>

        </div>

        <!-- Subtotal -->
        <div class="l">
            <span>Subtotal</span>
            <span>${f(carrinho.sub)}</span>
        </div>

        <!-- Desconto do cupom -->
        ${
            carrinho.dc
                ? `<div class="l">
                       <span>Cupom</span>
                       <span>-${f(carrinho.dc)}</span>
                   </div>`
                : ""
        }

        <!-- Desconto PIX -->
        ${
            carrinho.px
                ? `<div class="l">
                       <span>Desconto PIX</span>
                       <span>-${f(carrinho.px)}</span>
                   </div>`
                : ""
        }

        <!-- Frete -->
        <div class="l">

            <span>Frete</span>

            <span>
                ${
                    ship
                        ? (
                            carrinho.sh
                                ? f(carrinho.sh)
                                : "Grátis"
                        )
                        : "Informe o CEP"
                }
            </span>

        </div>

        <!-- Total -->
        <div class="l tt">
            <span>Total</span>
            <span>${f(carrinho.tot)}</span>
        </div>

        <!-- Finalização por WhatsApp -->
        <a
            id="ck"
            class="${
                carrinho.it.length && ship
                    ? ""
                    : "off"
            }"
            target="_blank"
            rel="noopener noreferrer"
            href="${wa(carrinho)}"
        >
            Finalizar pelo WhatsApp
        </a>
    `;
}


/* ==========================================
   15. FINALIZAÇÃO PELO WHATSAPP
========================================== */

function wa(carrinho) {

    // Mensagem de abertura
    let mensagem =
        "Olá! Quero finalizar meu pedido na LMGV Global Tech:\n";

    // Lista de produtos
    mensagem += carrinho.it.map(item => {

        return (
            `${item.q}x ${item.p.n} ` +
            `(${f(item.p.p * item.q)})`
        );

    }).join("\n");

    // Dados do pagamento e entrega
    mensagem +=
        `\nPagamento: ${
            pay === "pix" ? "PIX" : "Cartão"
        }`;

    mensagem +=
        `\nCEP: ${ship ? ship.cep : ""}`;

    mensagem +=
        `\nTotal: ${f(carrinho.tot)}`;

    // Codifica a mensagem para a URL
    return (
        `https://wa.me/${WA}?text=` +
        encodeURIComponent(mensagem)
    );
}


/* ==========================================
   16. ABRIR E FECHAR O CARRINHO
========================================== */

function open(abrir) {

    $("#dr").classList.toggle("on", abrir);

    $("#ov").style.display =
        abrir ? "block" : "none";
}


/* ==========================================
   17. ADICIONAR PRODUTOS AO CARRINHO
========================================== */

function add(id) {

    const produto = buscarProduto(id);

    if (!produto) {
        return;
    }

    const quantidadeAtual = cart[id] || 0;

    // Verifica o limite de estoque
    if (quantidadeAtual >= produto.s) {
        toast("Quantidade máxima em estoque atingida");
        return;
    }

    // Adiciona uma unidade
    cart[id] = quantidadeAtual + 1;

    // Salva e atualiza
    save();
    drawCart();

    toast("Adicionado ao carrinho");
}


/* ==========================================
   18. REMOVER QUANTIDADE DO CARRINHO
========================================== */

function remove(id) {

    if (!cart[id]) {
        return;
    }

    cart[id]--;

    // Remove o produto caso a quantidade seja zero
    if (cart[id] <= 0) {
        delete cart[id];
    }

    save();
    drawCart();
}


/* ==========================================
   19. ADICIONAR / REMOVER FAVORITOS
========================================== */

function toggleWish(id) {

    if (!buscarProduto(id)) {
        return;
    }

    if (wish.includes(id)) {

        // Remove dos favoritos
        wish = wish.filter(item => item !== id);

    } else {

        // Adiciona aos favoritos
        wish.push(id);
    }

    save();

    // Atualiza as duas listas
    list();
    deals();
}


/* ==========================================
   20. SELECIONAR CATEGORIAS
========================================== */

function selecionarCategoria(categoria) {

    if (!CATS.includes(categoria)) {
        return;
    }

    cat = categoria;

    // Sai do modo de favoritos
    onlyFavorites = false;

    // Atualiza o catálogo
    list();

    // Rola até os produtos
    $("#catalogo").scrollIntoView();
}


/* ==========================================
   21. EXIBIR PRODUTOS FAVORITOS
========================================== */

function mostrarFavoritos() {

    cat = "Todos";
    q = "";

    $("#q").value = "";

    if (wish.length === 0) {

        onlyFavorites = false;

        list();

        toast("Toque no coração para salvar favoritos");

        return;
    }

    onlyFavorites = true;

    list();

    $("#catalogo").scrollIntoView();

    toast("Mostrando seus favoritos");
}


/* ==========================================
   22. CALCULAR FRETE (SIMULAÇÃO)
========================================== */

function calcularFrete() {

    // Remove caracteres que não são números
    const cep = $("#cep").value.replace(/\D/g, "");

    // Valida a quantidade de dígitos
    if (cep.length !== 8) {
        toast("Digite um CEP com 8 números");
        return;
    }

    // Primeiro número do CEP
    const primeiroDigito = Number(cep[0]);

    // Valores simulados para demonstração
    const valorFrete = 19.90 + (primeiroDigito % 3) * 5;

    const prazoEntrega = 2 + (primeiroDigito % 4);

    ship = {
        cep: cep.replace(/(\d{5})(\d{3})/, "$1-$2"),
        fee: valorFrete,
        days: prazoEntrega
    };

    drawCart();

    toast("Frete estimado calculado");
}


/* ==========================================
   23. APLICAR CUPOM DE DESCONTO
========================================== */

function aplicarCupom() {

    const codigo = $("#cp")
        .value
        .trim()
        .toUpperCase();

    if (codigo === "LMGV10") {

        cup = 0.10;

        toast("Cupom de 10% aplicado");

    } else {

        cup = 0;

        toast("Cupom inválido");
    }

    drawCart();
}


/* ==========================================
   24. EVENTOS DE CLIQUE
========================================== */

document.addEventListener("click", (evento) => {

    const elemento = evento.target.closest("button, a");

    if (!elemento) {
        return;
    }

    const dados = elemento.dataset;


    /* Adicionar produto */

    if (dados.a) {

        add(Number(dados.a));

    }

    /* Favoritar produto */

    else if (dados.w) {

        toggleWish(Number(dados.w));

    }

    /* Selecionar categoria */

    else if (dados.go) {

        selecionarCategoria(dados.go);

    }

    /* Aumentar quantidade */

    else if (dados.pl) {

        add(Number(dados.pl));

    }

    /* Diminuir quantidade */

    else if (dados.m) {

        remove(Number(dados.m));

    }

    /* Abrir carrinho */

    else if (elemento.id === "cb") {

        open(true);

    }

    /* Fechar carrinho */

    else if (elemento.id === "x") {

        open(false);

    }

    /* Mostrar favoritos */

    else if (elemento.id === "wb") {

        mostrarFavoritos();

    }

    /* Calcular frete */

    else if (elemento.id === "cb2") {

        calcularFrete();

    }

    /* Aplicar cupom */

    else if (elemento.id === "cb3") {

        aplicarCupom();

    }

    /* Selecionar sugestão de pesquisa */

    else if (
        elemento.closest("#sg") &&
        dados.s
    ) {

        q = dados.s;

        $("#q").value = q;

        $("#sg").style.display = "none";

        // Pesquisa em todo o catálogo
        cat = "Todos";
        onlyFavorites = false;

        list();

        $("#catalogo").scrollIntoView();
    }

});


/* ==========================================
   25. EVENTOS DE ALTERAÇÃO
========================================== */

document.addEventListener("change", (evento) => {

    const elemento = evento.target;

    /* Alterar forma de pagamento */

    if (elemento.name === "pg") {

        pay = elemento.value;

        drawCart();
    }

    /* Alterar ordenação */

    else if (elemento.id === "so") {

        sort = elemento.value;

        list();
    }

});


/* ==========================================
   26. FECHAR CARRINHO PELO FUNDO
========================================== */

$("#ov").addEventListener("click", () => {
    open(false);
});


/* ==========================================
   27. PESQUISA DE PRODUTOS
========================================== */

$("#q").addEventListener("input", (evento) => {

    q = evento.target.value;

    // A pesquisa considera todo o catálogo
    cat = "Todos";
    onlyFavorites = false;

    // Sugestões aparecem a partir de 2 caracteres
    const sugestoes = q.length > 1
        ? P.filter(produto =>
            produto.n
                .toLowerCase()
                .includes(q.toLowerCase())
        ).slice(0, 5)
        : [];

    // Cria botões de sugestões
    $("#sg").innerHTML = sugestoes.map(produto => `

        <button data-s="${produto.n}">
            ${produto.e} ${produto.n}
        </button>

    `).join("");

    // Mostra ou oculta sugestões
    $("#sg").style.display =
        sugestoes.length ? "block" : "none";

    // Atualiza a lista
    list();
});


/* ==========================================
   28. PESQUISAR PRESSIONANDO ENTER
========================================== */

$("#q").addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {

        $("#sg").style.display = "none";

        $("#catalogo").scrollIntoView();
    }

});


/* ==========================================
   29. INICIALIZAÇÃO DO SITE
========================================== */

// Salva dados já validados
save();

// Carrega o catálogo
list();

// Carrega as ofertas
deals();

// Atualiza o carrinho
drawCart();

// Inicia o contador regressivo
tick();

// Atualiza o contador a cada segundo
setInterval(tick, 1000);
