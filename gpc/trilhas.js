// Trilhas: visitante vê o convite para criar conta; quem está logado vê o progresso e abre a trilha.
(function () {
    const usuario = GPC.usuarioAtual();
    GPCUI.ajustarCabecalhoPublico(usuario);
    if (!usuario) return; // visitante: a página já vem pronta no HTML

    document.querySelector('.modo-visitante').style.display = 'none';
    document.querySelector('.texto-trilhas .info-texto').textContent = 'SUAS TRILHAS';
    document.querySelector('.texto-trilhas p').textContent = 'Abra uma trilha para continuar de onde parou. Seu progresso é salvo a cada nó concluído.';

    document.querySelectorAll('[data-trilha]').forEach((cartao) => {
        const estado = GPC.estadoTrilha(usuario.id, cartao.dataset.trilha);
        if (!estado) return;

        // bolinhas da linha do tempo: módulo concluído / módulo em andamento
        const itens = cartao.querySelectorAll('ul li span');
        const atual = estado.modulos.findIndex((m) => m.status !== 'CONCLUIDO');
        estado.modulos.forEach((m, i) => {
            if (!itens[i]) return;
            if (m.status === 'CONCLUIDO') { itens[i].classList.add('feito'); itens[i].textContent = '✓'; }
            else if (i === atual) itens[i].classList.add('atual');
        });

        // barra de progresso
        const prog = cartao.querySelector('.trilha-prog');
        prog.hidden = false;
        prog.querySelector('.barra-mini div').style.width = `${estado.pct}%`;
        prog.querySelector('.trilha-prog-txt').textContent = `${estado.concluidos} de ${estado.total} nós · ${estado.pct}%`;

        // botão da trilha
        const botao = cartao.querySelector('.btn-criarConta');
        botao.href = `trilha.html?id=${encodeURIComponent(estado.trilha.id)}`;
        botao.textContent = estado.completa ? 'Rever trilha →'
            : estado.concluidos === 0 ? 'Começar trilha →'
                : 'Continuar trilha →';
    });
})();
