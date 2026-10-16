function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const margem = parseFloat(document.getElementById('sliderMargem').value) || 60;
    const taxaCartao = parseFloat(document.getElementById('taxaCartao').value) || 0;

    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    
    const precoBase = custoTotal * (1 + (margem / 100));

    let precoVenda = precoBase;
    if (taxaCartao > 0 && taxaCartao < 100) {
        precoVenda = precoBase / (1 - (taxaCartao / 100));
    }

    const lucroLiquido = precoVenda - custoTotal - (precoVenda * (taxaCartao / 100));
    const markup = custoTotal > 0 ? (precoVenda / custoTotal).toFixed(2) : 0;

    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto sem identificação";
    document.getElementById('resCustoTotal').innerText = `Custo: ${custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    if (taxaCartao > 0) {
        document.getElementById('resPrecoCartao').innerText = `À Vista / PIX: ${precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    } else {
        document.getElementById('resPrecoCartao').innerText = `Preço validado para venda direta.`;
    }

    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Indicador de Saúde
    const badgeSaude = document.getElementById('badgeSaude');
    if (margem < 30) {
        badgeSaude.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Atenção`;
        badgeSaude.className = "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5";
    } else {
        badgeSaude.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Excelente`;
        badgeSaude.className = "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5";
    }

    // Gráfico de Proporção
    if (precoVenda > 0) {
        const pctCusto = (custoTotal / precoVenda) * 100;
        const pctLucro = 100 - pctCusto;
        document.getElementById('barraCusto').style.width = `${pctCusto}%`;
        document.getElementById('barraLucro').style.width = `${pctLucro}%`;
        document.getElementById('valBarraCusto').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('valBarraLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('txtMarkupEfetivo').innerText = `Markup: ${markup}x`;
    }
}

function sincronizarMargem(origem) {
    const slider = document.getElementById('sliderMargem');
    document.getElementById('labelMargem').innerText = `${slider.value}%`;
    calcularPreco();
}

function limparFormulario() {
    document.getElementById('calcForm').reset();
    document.getElementById('sliderMargem').value = 60;
    document.getElementById('labelMargem').innerText = '60%';
    calcularPreco();
    mostrarToast('Redefinido', 'Os campos foram limpos com sucesso.', 'info');
}

function salvarPrecificacao() {
    const nome = document.getElementById('nomeProduto').value.trim() || "Produto Criativo";
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        mostrarToast('Aviso', 'Preencha os custos antes de salvar.', 'error');
        return;
    }

    const item = { nome, preco, lucro, data: new Date().toLocaleDateString('pt-BR') };
    let historico = JSON.parse(localStorage.getItem('precifica_historico_enterprise')) || [];
    historico.unshift(item);
    if (historico.length > 25) historico.pop();
    localStorage.setItem('precifica_historico_enterprise', JSON.stringify(historico));

    mostrarToast('Sucesso!', `"${nome}" foi salvo no histórico com sucesso.`);
}

function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const lista = document.getElementById('listaHistorico');
    let historico = JSON.parse(localStorage.getItem('precifica_historico_enterprise')) || [];

    if (historico.length === 0) {
        lista.innerHTML = `<p class="text-slate-500 text-xs text-center py-8">Nenhum registro encontrado no histórico.</p>`;
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
    if (confirm('Deseja realmente apagar todo o histórico salvo?')) {
        localStorage.removeItem('precifica_historico_enterprise');
        abrirHistorico();
        mostrarToast('Limpo', 'O histórico foi apagado.', 'info');
    }
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        mostrarToast('Aviso', 'Faça um cálculo antes de enviar o orçamento.', 'error');
        return;
    }

    const texto = `🛍️ *Orçamento Oficial*\n📌 *Item:* ${nome}\n💰 *Preço Sugerido:* ${preco}\n✨ Qualidade e preço justo garantidos.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Sistema de Notificações Toasts Flutuantes
function mostrarToast(titulo, mensagem, tipo = 'success') {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastTitle').innerText = titulo;
    document.getElementById('toastMessage').innerText = mensagem;
    
    toast.classList.remove('translate-y-[-200%]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-200%]', 'opacity-0');
    }, 3500);
}

window.onload = () => { calcularPreco(); };
