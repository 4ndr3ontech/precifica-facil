let usuarioAtual = JSON.parse(localStorage.getItem('precifica_user')) || null;
let cicloAtual = 'mensal';

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
    document.getElementById('authSub').innerText = modoCadastro ? "Comece a usar os módulos avançados" : "Acesse sua conta para gerenciar seus negócios";
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
    mostrarToast('Sucesso!', `Bem-vindo, ${nome}.`);
}

function fazerLogout() {
    localStorage.removeItem('precifica_user');
    usuarioAtual = null;
    verificarAutenticacao();
}

function atualizarBadgePlano() {
    const badge = document.getElementById('badgePlanoNavbar');
    const btnNav = document.getElementById('btnUpgradeNav');
    if (usuarioAtual && usuarioAtual.plano !== 'FREE') {
        badge.innerText = usuarioAtual.plano;
        badge.className = "bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase";
        btnNav.classList.add('hidden');
    } else {
        badge.innerText = "FREE";
        badge.className = "bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20 uppercase";
        btnNav.classList.remove('hidden');
    }
}

function abrirPlanos() {
    document.getElementById('modalPlanos').classList.remove('hidden');
}

function fecharPlanos() {
    document.getElementById('modalPlanos').classList.add('hidden');
}

function mudarCiclo(ciclo) {
    cicloAtual = ciclo;
    const btnM = document.getElementById('btnMensal');
    const btnA = document.getElementById('btnAnual');
    const pPro = document.getElementById('precoPro');
    const pPrem = document.getElementById('precoPremium');

    if (ciclo === 'anual') {
        btnA.className = "px-5 py-2 rounded-full text-xs font-bold transition bg-indigo-600 text-white cursor-pointer";
        btnM.className = "px-5 py-2 rounded-full text-xs font-bold transition text-slate-400 hover:text-white cursor-pointer";
        pPro.innerText = "R$ 16,50";
        pPrem.innerText = "R$ 33,10";
    } else {
        btnM.className = "px-5 py-2 rounded-full text-xs font-bold transition bg-indigo-600 text-white cursor-pointer";
        btnA.className = "px-5 py-2 rounded-full text-xs font-bold transition text-slate-400 hover:text-white cursor-pointer";
        pPro.innerText = "R$ 19,90";
        pPrem.innerText = "R$ 39,90";
    }
}

function assinarPlano(plano) {
    if (usuarioAtual) {
        usuarioAtual.plano = plano;
        localStorage.setItem('precifica_user', JSON.stringify(usuarioAtual));
        atualizarBadgePlano();
        fecharPlanos();
        mostrarToast('Parabéns!', `Sua conta foi atualizada para o plano ${plano}!`, 'success');
    }
}

// Navegação por Módulos com Validação de Plano
function mudarModulo(modulo) {
    if (modulo === 'marketplaces' && usuarioAtual && usuarioAtual.plano === 'FREE') {
        abrirPlanos();
        return;
    }
    if (modulo === 'lotes' && usuarioAtual && usuarioAtual.plano !== 'PREMIUM') {
        abrirPlanos();
        return;
    }

    document.getElementById('tabUnitario').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-900 text-slate-400 border border-slate-800 hover:text-white cursor-pointer";
    document.getElementById('tabMarketplaces').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-900 text-slate-400 border border-slate-800 hover:text-white cursor-pointer";
    document.getElementById('tabLotes').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-900 text-slate-400 border border-slate-800 hover:text-white cursor-pointer";

    document.getElementById('moduloUnitario').classList.add('hidden');
    document.getElementById('moduloMarketplaces').classList.add('hidden');
    document.getElementById('moduloLotes').classList.add('hidden');

    if (modulo === 'unitario') {
        document.getElementById('tabUnitario').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 cursor-pointer";
        document.getElementById('moduloUnitario').classList.remove('hidden');
        calcularPreco();
    } else if (modulo === 'marketplaces') {
        document.getElementById('tabMarketplaces').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 cursor-pointer";
        document.getElementById('moduloMarketplaces').classList.remove('hidden');
        calcularMarketplace();
    } else if (modulo === 'lotes') {
        document.getElementById('tabLotes').className = "px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 cursor-pointer";
        document.getElementById('moduloLotes').classList.remove('hidden');
        calcularLote();
    }
}

function calcularPreco() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const materiais = parseFloat(document.getElementById('custoMateriais').value) || 0;
    const custosFixos = parseFloat(document.getElementById('custosFixos').value) || 0;
    const horas = parseFloat(document.getElementById('horasTrabalho').value) || 0;
    const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
    const margem = parseFloat(document.getElementById('sliderMargem').value) || 60;

    const maoDeObra = horas * valorHora;
    const custoTotal = materiais + maoDeObra + custosFixos;
    const precoVenda = custoTotal * (1 + (margem / 100));
    const lucroLiquido = precoVenda - custoTotal;

    document.getElementById('resNomeProduto').innerText = nome !== "" ? nome : "Produto Unitário";
    document.getElementById('resCustoTotal').innerText = `Custo: ${custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularMarketplace() {
    const comissao = parseFloat(document.getElementById('selectMarketplace').value) || 0;
    const custo = parseFloat(document.getElementById('custoBaseMarketplace').value) || 0;
    const margem = parseFloat(document.getElementById('margemMarketplace').value) || 50;

    const precoBase = custo * (1 + (margem / 100));
    const precoFinal = comissao > 0 ? precoBase / (1 - (comissao / 100)) : precoBase;
    const lucro = precoFinal - custo - (precoFinal * (comissao / 100));

    document.getElementById('resCustoTotal').innerText = `Custo Base: ${custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularLote() {
    const qtd = parseInt(document.getElementById('qtdLote').value) || 1;
    const custoTotalLote = parseFloat(document.getElementById('custoTotalLote').value) || 0;
    const custoUnitario = qtd > 0 ? custoTotalLote / qtd : 0;

    document.getElementById('resCustoTotal').innerText = `Lote (${qtd} un): ${custoTotalLote.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resPrecoVenda').innerText = (custoUnitario * 1.6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('resLucro').innerText = (custoUnitario * 0.6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
    if (usuarioAtual && usuarioAtual.plano === 'FREE') {
        let historico = JSON.parse(localStorage.getItem('precifica_historico_user')) || [];
        if (historico.length >= 5) {
            abrirPlanos();
            return;
        }
    }

    const nome = document.getElementById('nomeProduto').value.trim() || "Produto Criativo";
    const preco = document.getElementById('resPrecoVenda').innerText;
    const lucro = document.getElementById('resLucro').innerText;

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

function gerarPdfPro() {
    if (usuarioAtual && usuarioAtual.plano === 'FREE') {
        abrirPlanos();
    } else {
        window.print();
    }
}

function copiarResumo() {
    const nome = document.getElementById('resNomeProduto').innerText;
    const preco = document.getElementById('resPrecoVenda').innerText;
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
