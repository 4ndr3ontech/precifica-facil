function calcularPreco() {
    // Recolher o nome do produto
    const nomeProduto = document.getElementById('nomeProduto').value.trim();
    if (nomeProduto !== "") {
        document.getElementById('tituloExibicao').innerText = nomeProduto;
    } else {
        document.getElementById('tituloExibicao').innerText = "Seu Produto";
    }

    // Pegar os valores numéricos com segurança
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const margem = parseFloat(document.getElementById('margemLucro').value) || 0;

    // Fórmulas
    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    const precoVenda = custoTotal * (1 + (margem / 100));
    const lucroLiquido = precoVenda - custoTotal;

    // Atualizar no ecrã formatado em Reais (BRL)
    document.getElementById('resCustoTotal').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
