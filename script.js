let usuarioAtual = JSON.parse(localStorage.getItem('precifica_user')) || null;

window.onload = () => {
    verificarAutenticacao();
    calcularPreco();
};

function verificarAutenticacao() {
    if (!usuarioAtual) {
        document.getElementById('telaAuth').classList.remove('hidden');
    } else {
        document.getElementById('telaAuth').classList.add('hidden');
        document.getElementById('userGreeting').innerText = `Olá, ${usuarioAtual.nome || 'Cliente'}`;
        atualizarBadgePlano();
    }
}

let modoCadastro = false;
function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    document.getElementById('campoNomeDiv').classList.toggle('hidden', !modoCadastro);
    document.getElementById('authTitulo').innerText = modoCadastro ? "Criar sua conta grátis" : "Bem-vindo de volta";
    document.getElementById('authSub').innerText = modoCadastro ? "Comece a precificar seus produtos agora mesmo" : "Insira suas credenciais para gerenciar seus produtos";
    document.getElementById('btnSubmitAuth').innerText = modoCadastro ? "Cadastrar Gratuitamente" : "Acessar Plataforma";
    document.getElementById('authToggleText').innerText = modoCadastro ? "Já tem uma conta?" : "Ainda não tem uma conta?";
    document.getElementById('authToggleBtn').innerText = modoCadastro ? "Fazer login" : "Criar conta gratuita";
}

function realizarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    const nome = modoCadastro ? document.getElementById('authNome').value || "Usuário" : email.split('@')[0];
    
    usuarioAtual = { email, nome, plano: 'FREE' };
    localStorage.setItem('precifica_user', JSON.stringify(usuarioAtual));
    
    verificarAutenticacao();
    mostrarToast('Sucesso!', `Bem-vindo à plataforma, ${nome}.`);
}

function fazerLogout() {
    localStorage.removeItem('precifica_user');
    usuarioAtual = null;
    verificarAutenticacao();
}

function atualizarBadgePlano() {
    const badge = document.getElementById('badgePlanoNavbar');
    const btnNav = document.getElementById('btnUpgradeNav');
    if (usuarioAtual && usuarioAtual.plano === 'PRO') {
        badge.innerText = "PRO";
        badge.className = "bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase";
        btnNav.classList.add('hidden');
    } else {
        badge.innerText = "FREE";
        badge.className = "bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20 uppercase";
        btnNav.classList.remove('hidden');
    }
}

function abrirPro() {
    document.getElementById('modalPro').classList.remove('hidden');
}

function fecharPro() {
    document.getElementById('modalPro').classList.add('hidden');
}

function ativarPlanoPro() {
    if (usuarioAtual) {
        usuarioAtual.plano = 'PRO';
        localStorage.setItem('precifica_user', JSON.stringify(usuarioAtual));
        atualizarBadgePlano();
        fecharPro();
        mostrarToast('Parabéns!', 'Sua conta foi atualizada para o Plano PRO!', 'success');
    }
}

function checarRecursoPro(input) {
    if (usuarioAtual && usuarioAtual.plano !== 'PRO') {
        input.value = 0;
        abrirPro();
    } else {
        calcularPreco();
    }
}

function gerarPdfPro() {
    if (usuarioAtual && usuarioAtual.plano !== 'PRO') {
        abrirPro();
    } else {
        window.print();
    }
}

function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const margem = parseFloat(document.getElementById('sliderMargem').value) || 60;
    const taxaCartao = usuarioAtual && usuarioAtual.plano === 'PRO' ? (parseFloat(document.getElementById('taxaCartao').value) || 0) : 0;

    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    const precoBase = custoTotal * (1 + (margem / 100));

    let precoVenda = precoBase;
    if (taxaCartao > 0) {
        precoVenda = precoBase / (1 - (taxaCartao / 100));
    }

    const lucroLiquido = precoVenda - custoTotal - (precoVenda * (taxaCartao / 100));

    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto sem nome";
    document.getElementById('resCustoTotal').innerText = `Custo: ${custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resPrecoCartao').innerText = taxaCartao > 0 ? `À Vista: ${precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `Venda Direta / PIX`;
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function sincronizarMargem() {
    const slider = document.getElementById('sliderMargem');
    document.getElementById('labelMargem').innerText = `${slider.value}%`;
    calcularPreco();
}

function limparFormulario() {
    document.getElementById('calcForm').reset();
    document.getElementById('sliderMargem').value = 60;
    document.getElementById('labelMargem').innerText = '60%';
    calcularPreco();
}

function salvarPrecificacao() {
    if (usuarioAtual && usuarioAtual.plano !== 'PRO') {
        let historico = JSON.parse(localStorage.getItem('precifica_historico_user')) || [];
        if (historico.length >= 3) {
            abrirPro();
            return;
        }
    }

    const nome = document.getElementById('nomeProduto').value.trim() || "Produto Criativo";
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

    if (preco === "R$ 0,00") {
        mostrarToast('Aviso', 'Preencha os custos antes de salvar.', 'error');
        return;
    }

    const item = { nome, preco, lucro, data: new Date().toLocaleDateString('pt-BR') };
    let historico = JSON.parse(localStorage.getItem('precifica_historico_user')) || [];
    historico.unshift(item);
    localStorage.setItem('precifica_historico_user', JSON.stringify(historico));

    mostrarToast('Salvo!', `"${nome}" foi registrado com sucesso.`);
}

function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const lista = document.getElementById('listaHistorico');
    let historico = JSON.parse(localStorage.getItem('precifica_historico_user')) || [];

    if (historico.length === 0) {
        lista.innerHTML = `<p class="text-slate-500 text-xs text-center py-8">Nenhum cálculo salvo.</p>`;
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
    localStorage.removeItem('precifica_historico_user');
    abrirHistorico();
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;
    const texto = `🛍️ *Orçamento*\n📌 ${nome}\n💰 ${preco}\n✨ Qualidade garantida.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

function mostrarToast(titulo, mensagem) {
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
