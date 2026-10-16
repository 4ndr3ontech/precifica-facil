function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const margem = parseFloat(document.getElementById('sliderMargem').value) || 50;
    const taxaCartao = parseFloat(document.getElementById('taxaCartao').value) || 0;

    // Custos
    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    
    // Preço base à vista (PIX)
    const precoBase = custoTotal * (1 + (margem / 100));

    // Preço com taxa de maquininha embutida (Fórmula comercial oficial)
    let precoVenda = precoBase;
    if (taxaCartao > 0 && taxaCartao < 100) {
        precoVenda = precoBase / (1 - (taxaCartao / 100));
    }

    const lucroLiquido = precoVenda - custoTotal - (precoVenda * (taxaCartao / 100));
    const markup = custoTotal > 0 ? (precoVenda / custoTotal).toFixed(2) : 0;

    // Atualização do Dashboard
    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto sem nome";
    document.getElementById('resCustoTotal').innerText = `Custo: ${custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    if (taxaCartao > 0) {
        document.getElementById('resPrecoCartao').innerText = `À Vista / PIX seria: ${precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    } else {
        document.getElementById('resPrecoCartao').innerText = `Preço ideal validado para venda direta.`;
    }

    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Indicador de Saúde do Negócio
    const badgeSaude = document.getElementById('badgeSaude');
    if (margem < 30) {
        badgeSaude.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Margem Baixa`;
        badgeSaude.className = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5";
    } else {
        badgeSaude.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Saudável`;
        badgeSaude.className = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5";
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
    document.getElementById('sliderMargem').value = 50;
    document.getElementById('labelMargem').innerText = '50%';
    calcularPreco();
}

function salvarPrecificacao() {
    const nome = document.getElementById('nomeProduto').value.trim() || "Produto Criativo";
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        alert('Preencha os custos antes de salvar.');
        return;
    }

    const item = { nome, preco, lucro, data: new Date().toLocaleDateString('pt-BR') };
    let historico = JSON.parse(localStorage.getItem('precifica_historico_br')) || [];
    historico.unshift(item);
    if (historico.length > 20) historico.pop();
    localStorage.setItem('precifica_historico_br', JSON.stringify(historico));

    alert(`Sucesso! "${nome}" foi registrado no histórico nacional.`);
}

function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const lista = document.getElementById('listaHistorico');
    let historico = JSON.parse(localStorage.getItem('precifica_historico_br')) || [];

    if (historico.length === 0) {
        lista.innerHTML = `<p class="text-slate-500 text-xs text-center py-8">Nenhum cálculo salvo no histórico.</p>`;
    } else {
        lista.innerHTML = historico.map(h => `
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                    <h4 class="text-white text-sm font-bold">${h.nome}</h4>
                    <p class="text-xs text-slate-400">Data: ${h.data} | Lucro Líquido: <span class="text-emerald-400 font-bold">${h.lucro}</span></p>
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
    if (confirm('Deseja apagar todo o histórico salvo?')) {
        localStorage.removeItem('precifica_historico_br');
        abrirHistorico();
    }
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        alert('Faça um cálculo antes de enviar o orçamento.');
        return;
    }

    const texto = `🛍️ *Orçamento Oficial*\n📌 *Produto:* ${nome}\n💰 *Valor Sugerido:* ${preco}\n✨ Qualidade garantida com preço justo.`;
    
    // Abre direto no WhatsApp Web
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

window.onload = () => { calcularPreco(); };
