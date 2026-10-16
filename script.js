function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const margem = parseFloat(document.getElementById('margemLucro').value) || 0;

    // Validação de segurança
    if (materiais === 0 && horas === 0) {
        alert('Por favor, informe ao menos o custo dos materiais ou o tempo gasto.');
        return;
    }

    // Cálculos matemáticos corporativos
    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    const precoVenda = custoTotal * (1 + (margem / 100));
    const lucroLiquido = precoVenda - custoTotal;

    // Atualização de elementos visuais no HTML
    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto sem identificação";
    document.getElementById('resCustoTotal').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Mudança de estado do Badge de Status
    const badge = document.getElementById('badgeStatus');
    badge.innerText = "Calculado com Sucesso";
    badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
}

function limparFormulario() {
    document.getElementById('calcForm').reset();
    document.getElementById('resNomeProduto').innerText = "-";
    document.getElementById('resCustoTotal').innerText = "R$ 0,00";
    document.getElementById('resPrecoVenda').innerText = "R$ 0,00";
    document.getElementById('resLucro').innerText = "R$ 0,00";
    
    const badge = document.getElementById('badgeStatus');
    badge.innerText = "Aguardando dados";
    badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700";
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        alert('Realize um cálculo antes de copiar o resumo executivo.');
        return;
    }

    const textoFormatado = `📊 *Relatório de Precificação Executiva - PrecificaFácil*\n📌 Item: ${nome}\n💰 Preço de Venda Sugerido: ${preco}\n💎 Lucro Líquido Esperado: ${lucro}`;
    
    navigator.clipboard.writeText(textoFormatado).then(() => {
        alert('Resumo copiado com sucesso para a área de transferência!');
    });
}
