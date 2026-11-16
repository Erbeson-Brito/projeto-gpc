// Administração · pedidos pendentes de perfil profissional (aprovar / rejeitar).
(function () {
    const admin = GPCUI.exigir({ papel: 'ADMINISTRADOR' });
    if (!admin) return;
    GPCUI.montarCabecalho('pedidos');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');
    const area = h('div', {});
    const resumo = h('p', { class: 'lead' });

    async function decidir(pedido, aprovar) {
        const rotulo = GPC.rotulo(pedido.tipo);
        const ok = await GPCUI.confirmar({
            titulo: aprovar ? 'Aprovar pedido?' : 'Rejeitar pedido?',
            mensagem: aprovar
                ? `${pedido.nome} passará a ter o perfil de ${rotulo}.`
                : `O pedido de ${rotulo} feito por ${pedido.nome} será rejeitado. A pessoa poderá solicitar novamente.`,
            rotulo: aprovar ? 'Aprovar' : 'Rejeitar', perigo: !aprovar,
        });
        if (!ok) return;
        try {
            GPC.decidirVerificacao(pedido.id, aprovar, admin.id);
            GPCUI.toast(`Pedido de ${pedido.nome} ${aprovar ? 'aprovado' : 'rejeitado'}.`);
        } catch (e) {
            GPCUI.toast(GPCUI.mensagemDeErro(e), 'erro');
        }
        desenhar();
    }

    function desenhar() {
        const lista = GPC.pendentes();
        resumo.textContent = lista.length === 0
            ? 'Nenhum pedido aguardando análise.'
            : `${lista.length} ${lista.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'} análise.`;

        if (lista.length === 0) {
            area.replaceChildren(h('div', { class: 'vazio' }, 'Nenhum pedido pendente. Quando alguém solicitar um perfil profissional, ele aparecerá aqui.'));
            return;
        }
        area.replaceChildren(h('div', { class: 'tabela-wrap' }, h('table', {},
            h('thead', {}, h('tr', {}, ['Usuário', 'E-mail', 'Perfil solicitado', 'Solicitado em', 'Ações'].map((c) => h('th', { scope: 'col' }, c)))),
            h('tbody', {}, lista.map((p) => h('tr', {},
                h('td', {}, p.nome),
                h('td', {}, p.email),
                h('td', {}, GPC.rotulo(p.tipo)),
                h('td', {}, GPC.fmtData(p.solicitadoEm)),
                h('td', { class: 'acoes' },
                    h('button', { class: 'btn btn-pri btn-peq', type: 'button', onclick: () => decidir(p, true), 'aria-label': `Aprovar ${p.nome}` }, 'Aprovar'),
                    h('button', { class: 'btn btn-peq', type: 'button', onclick: () => decidir(p, false), 'aria-label': `Rejeitar ${p.nome}` }, 'Rejeitar'))))))));
    }
    desenhar();

    raiz.replaceChildren(
        h('div', { class: 'eyebrow' }, 'Administração'),
        h('h1', {}, 'Pedidos pendentes'),
        resumo, area);
})();
