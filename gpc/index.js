// Página inicial: cabeçalho conforme o login e cartão "Minha jornada" com o progresso real.
(function () {
    const usuario = GPC.usuarioAtual();
    GPCUI.ajustarCabecalhoPublico(usuario);
    if (!usuario) return; // visitante: fica a versão padrão da página

    const admin = GPC.temPapel(usuario, 'ADMINISTRADOR');
    const cta = document.getElementById('ctaPrincipal');

    if (admin) {
        cta.textContent = 'Pedidos pendentes →';
        cta.href = 'admin-pedidos.html';
        return;
    }

    // trilha em que o aluno mais avançou (empate: a primeira)
    const resumo = GPC.resumoTrilhas(usuario.id).reduce((melhor, t) => (t.pct > melhor.pct ? t : melhor));

    // botão principal: leva direto ao próximo nó (ou à trilha, se já terminou)
    cta.textContent = resumo.concluidos === 0 ? 'Começar minha jornada →' : 'Continuar minha jornada →';
    cta.href = resumo.proximoNoId
        ? `atividade.html?trilha=${encodeURIComponent(resumo.id)}&no=${encodeURIComponent(resumo.proximoNoId)}`
        : `trilha.html?id=${encodeURIComponent(resumo.id)}`;

    // cartão "Minha jornada"
    document.getElementById('cardTitulo').textContent = resumo.titulo;
    document.getElementById('cardPct').textContent = `${resumo.pct}%`;
    const barra = document.getElementById('cardBarra');
    barra.setAttribute('aria-valuenow', resumo.pct);
    barra.firstElementChild.style.width = `${resumo.pct}%`;

    // bolinhas de módulos de cada trilha
    const bolinhas = { backend: ['LP', 'Java', 'SQL'], frontend: ['LP', 'CSS', 'JS'] }[resumo.id];
    if (bolinhas) {
        ['.logica', '.java', '.sql'].forEach((seletor, i) => {
            document.querySelector(`.sessoes ${seletor}`).textContent = bolinhas[i];
        });
    }
})();
