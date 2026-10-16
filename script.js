function calcularPreco() {
    // Pegando os valores dos inputs com segurança (evitando vazios)
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const margem = parseFloat(document.getElementById('margemLucro').value) || 0;

    // Lógica dos cálculos
    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    
    // Cálculo do preço de venda com base na margem de lucro informada
    const precoVenda = custoTotal * (1 + (margem / 100));
    const lucroLiquido = precoVenda - custoTotal;

    // Formatando e exibindo os resultados na tela em Reais (BRL)
    document.getElementById('resCustoTotal').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
