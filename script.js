// Executa o cálculo automaticamente a cada alteração nos campos
function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const margem = parseFloat(document.getElementById('margemLucro').value) || 0;

    // Fórmulas financeiras
    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    const precoVenda = custoTotal * (1 + (margem / 100));
    const lucroLiquido = precoVenda - custoTotal;
    const markup = custoTotal > 0 ? (precoVenda / custoTotal).toFixed(2) : 0;

    // Atualização visual do Dashboard
    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto sem identificação";
    document.getElementById('resCustoTotal').innerText = `Custo: ${custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualizar barra proporcional se houver valor
    if (precoVenda > 0) {
        const pctCusto = (custoTotal / precoVenda) * 100;
        const pctLucro = 100 - pctCusto;
        document.getElementById('barraCusto').style.width = `${pctCusto}%`;
        document.getElementById('barraLucro').style.width = `${pctLucro}%`;
        document.getElementById('valBarraCusto').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('valBarraLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('txtMarkupEfetivo').innerText = `Markup: ${markup}x`;
    } else {
        document.getElementById('barraCusto').style.width = '50%';
        document.getElementById('barraLucro').style.width = '50%';
        document.getElementById('valBarraCusto').innerText = 'R$ 0';
        document.getElementById('valBarraLucro').innerText = 'R$ 0';
        document.getElementById('txtMarkupEfetivo').innerText = 'Markup: 0x';
    }
}

// Sincronização entre o Slider e o Input numérico de margem
function sincronizarMargem(origem) {
    const slider = document.getElementById('sliderMargem');
    const input = document.getElementById('margemLucro');
    const label = document.getElementById('labelMargem');

    if (origem === 'slider') {
        input.value = slider.value;
        label.innerText = `${slider.value}%`;
    } else {
        slider.value = input.value;
        label.innerText = `${input.value}%`;
    }
    calcularPreco();
}

function limparFormulario() {
    document.getElementById('calcForm').reset();
    document.getElementById('sliderMargem').value = 50;
    document.getElementById('margemLucro').value = 50;
    document.getElementById('labelMargem').innerText = '50%';
    calcularPreco();
}

// Salvar no navegador (localStorage)
function salvarPrecificacao() {
    const nome = document.getElementById('nomeProduto').value.trim() || "Produto Criativo";
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        alert('Preencha os custos antes de salvar o registro.');
        return;
    }

    const item = {
        nome: nome,
        preco: preco,
        lucro: lucro,
        data: new Date().toLocaleDateString('pt-BR')
    };

    let historico = JSON.parse(localStorage.getItem('precifica_historico')) || [];
    historico.unshift(item); // Adiciona no topo
    if (historico.length > 20) historico.pop(); // Limita a 20 itens
    localStorage.setItem('precifica_historico', JSON.stringify(historico));

    alert(`Sucesso! "${nome}" foi salvo no seu histórico de precificações.`);
}

function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const lista = document.getElementById('listaHistorico');
    let historico = JSON.parse(localStorage.getItem('precifica_historico')) || [];

    if (historico.length === 0) {
        lista.innerHTML = `<p class="text-slate-500 text-xs text-center py-8">Nenhum cálculo salvo no histórico ainda.</p>`;
    } else {
        lista.innerHTML = historico.map(h => `
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                    <h4 class="text-white text-sm font-bold">${h.nome}</h4>
                    <p class="text-xs text-slate-400">Data: ${h.data} | Lucro: <span class="text-emerald-400 font-bold">${h.lucro}</span></p>
                </div>
                <div class="text-right">
                    <span class="text-indigo-400 font-mono font-black text-base">${h.preco}</span>
                </div>
            </div>
        `).join('');
    }

    modal.classList.remove('hidden');
}

function fecharHistorico() {
    document.getElementById('modalHistorico').classList.add('hidden');
}

function limparHistorico() {
    if (confirm('Deseja realmente apagar todo o seu histórico salvo?')) {
        localStorage.removeItem('precifica_historico');
        abrirHistorico();
    }
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        alert('Faça um cálculo antes de copiar o resumo.');
        return;
    }

    const texto = `📊 *Orçamento & Precrição - PrecificaFácil*\n📌 Produto: ${nome}\n💰 Preço de Venda: ${preco}\n💎 Lucro Estimado: ${lucro}`;
    
    navigator.clipboard.writeText(texto).then(() => {
        alert('Resumo copiado para a área de transferência!');
    });
}

// Inicializa o cálculo ao carregar
window.onload = () => { calcularPreco(); };
