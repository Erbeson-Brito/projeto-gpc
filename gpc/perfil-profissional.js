// Perfil profissional: solicitar Professor / Tutor / Recrutador e acompanhar os pedidos.
(function () {
    const usuario = GPCUI.exigir();
    if (!usuario) return;
    GPCUI.montarCabecalho('profissional');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');
    const caixaSolicitar = h('section', { class: 'cartao', 'aria-labelledby': 'tit-solicitar' });
    const caixaPedidos = h('section', { class: 'cartao', 'aria-labelledby': 'tit-pedidos' });

    function desenhar() {
        const atual = GPC.usuarioAtual();
        const pedidos = GPC.minhasVerificacoes(usuario.id);
        const pendentes = new Set(pedidos.filter((p) => p.status === 'PENDENTE').map((p) => p.tipo));

        // ---- solicitar
        const erro = h('p', { class: 'erro-campo', role: 'alert', hidden: true });
        let livres = 0;
        const opcoes = GPC.PAPEIS_PROFISSIONAIS.map((tipo, i) => {
            const tem = atual.papeis.includes(tipo);
            const pend = pendentes.has(tipo);
            const off = tem || pend;
            if (!off) livres++;
            return h('label', { class: 'opcao' + (off ? ' off' : '') },
                h('input', { type: 'radio', name: 'tipo', value: tipo, disabled: off }),
                GPC.rotulo(tipo),
                off ? h('small', {}, tem ? 'você já possui' : 'pedido pendente') : null);
        });
        const botao = h('button', { class: 'btn btn-pri', type: 'submit', disabled: livres === 0 }, 'Solicitar');
        const form = h('form', { novalidate: true, onsubmit: (e) => {
            e.preventDefault();
            erro.hidden = true;
            const marcado = form.querySelector('input[name="tipo"]:checked');
            try {
                GPC.solicitarPerfil(usuario.id, marcado ? marcado.value : '');
                GPCUI.toast(`Pedido de ${GPC.rotulo(marcado.value)} enviado para análise.`);
                desenhar();
            } catch (err) {
                erro.textContent = GPCUI.mensagemDeErro(err);
                erro.hidden = false;
            }
        } },
            h('fieldset', {}, h('legend', {}, 'Tipo de perfil'), opcoes),
            h('p', { class: 'sm', style: 'margin-top:14px' }, 'Um administrador analisa o pedido antes de liberar o perfil.'),
            erro,
            h('div', { class: 'acoes-form' }, botao));
        caixaSolicitar.replaceChildren(h('h2', { id: 'tit-solicitar' }, 'Solicitar perfil'), form);

        // ---- meus pedidos
        const conteudo = pedidos.length === 0
            ? h('div', { class: 'vazio sem-margem', style: 'margin-top:0' }, 'Você ainda não fez nenhum pedido.')
            : h('div', { class: 'tabela-wrap sem-margem' }, h('table', {},
                h('thead', {}, h('tr', {}, ['Perfil', 'Status', 'Solicitado em', 'Analisado em'].map((c) => h('th', { scope: 'col' }, c)))),
                h('tbody', {}, pedidos.map((p) => h('tr', {},
                    h('td', {}, GPC.rotulo(p.tipo)),
                    h('td', {}, GPCUI.chip(p.status)),
                    h('td', {}, GPC.fmtData(p.solicitadoEm)),
                    h('td', {}, GPC.fmtData(p.analisadoEm)))))));
        caixaPedidos.replaceChildren(h('h2', { id: 'tit-pedidos' }, 'Meus pedidos'), conteudo);
    }
    desenhar();

    raiz.replaceChildren(
        h('div', { class: 'eyebrow' }, 'Atuação profissional'),
        h('h1', {}, 'Perfil profissional'),
        h('div', { class: 'colunas desigual' }, caixaSolicitar, caixaPedidos));
})();
