// Administração · usuários: buscar, editar (nome, e-mail, status) e excluir.
(function () {
    const admin = GPCUI.exigir({ papel: 'ADMINISTRADOR' });
    if (!admin) return;
    GPCUI.montarCabecalho('usuarios');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');
    const area = h('div', {});
    const resumo = h('p', { class: 'lead' });
    const busca = h('input', { type: 'search', id: 'busca', placeholder: 'Nome ou e-mail', autocomplete: 'off' });

    const semAcento = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    async function editar(u) {
        const nome = h('input', { type: 'text', id: 'ed-nome', value: u.nome });
        const email = h('input', { type: 'email', id: 'ed-email', value: u.email });
        const corpo = h('div', {},
            h('div', { class: 'campo' }, h('label', { for: 'ed-nome' }, 'Nome'), nome),
            h('div', { class: 'campo' }, h('label', { for: 'ed-email' }, 'E-mail'), email));
        const salvo = await GPCUI.dialogo({
            titulo: `Editar usuário #${u.id}`, corpo, rotuloConfirmar: 'Salvar',
            aoConfirmar: () => GPC.atualizarConta(u.id, { nome: nome.value, email: email.value }),
        });
        if (salvo) { GPCUI.toast('Usuário atualizado.'); desenhar(); }
    }

    async function excluir(u) {
        const ok = await GPCUI.confirmar({
            titulo: 'Excluir usuário?',
            mensagem: `${u.nome} (${u.email}) será removido junto com o progresso e os pedidos de perfil. Essa ação não pode ser desfeita.`,
            rotulo: 'Excluir', perigo: true,
        });
        if (!ok) return;
        try {
            await GPC.excluirUsuario(u.id);
            GPCUI.toast('Usuário excluído.');
        } catch (e) {
            GPCUI.toast(GPCUI.mensagemDeErro(e), 'erro');
        }
        desenhar();
    }

    async function desenhar() {
        const termo = semAcento(busca.value.trim());
        let todos;
        try { todos = await GPC.listarUsuarios(); }
        catch (e) { area.replaceChildren(h('div', { class: 'vazio' }, GPCUI.mensagemDeErro(e))); return; }
        const lista = todos.filter((u) => !termo || semAcento(u.nome).includes(termo) || semAcento(u.email).includes(termo));
        resumo.textContent = termo
            ? `${lista.length} de ${todos.length} ${todos.length === 1 ? 'usuário' : 'usuários'}.`
            : `${todos.length} ${todos.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}.`;

        if (lista.length === 0) {
            area.replaceChildren(h('div', { class: 'vazio' }, termo ? 'Nenhum usuário encontrado para essa busca.' : 'Nenhum usuário cadastrado.'));
            return;
        }
        area.replaceChildren(h('div', { class: 'tabela-wrap' }, h('table', {},
            h('thead', {}, h('tr', {}, ['ID', 'Nome', 'E-mail', 'Papéis', 'Status', 'Ações'].map((c) => h('th', { scope: 'col' }, c)))),
            h('tbody', {}, lista.map((u) => {
                const eu = u.id === admin.id;
                return h('tr', {},
                    h('td', {}, String(u.id)),
                    h('td', {}, u.nome, eu ? h('span', { class: 'sm' }, ' (você)') : null),
                    h('td', {}, u.email),
                    h('td', {}, u.papeis.map((p) => GPCUI.chipPapel(p))),
                    h('td', {}, GPCUI.chip(u.status)),
                    h('td', { class: 'acoes' },
                        h('button', { class: 'btn btn-peq', type: 'button', onclick: () => editar(u), 'aria-label': `Editar ${u.nome}` }, 'Editar'),
                        h('button', { class: 'btn btn-perigo btn-peq', type: 'button', disabled: eu, title: eu ? 'Você não pode excluir a própria conta aqui' : null, onclick: () => excluir(u), 'aria-label': `Excluir ${u.nome}` }, 'Excluir')));
            })))));
    }

    busca.addEventListener('input', desenhar);

    raiz.replaceChildren(
        h('div', { class: 'eyebrow' }, 'Administração'),
        h('h1', {}, 'Usuários'),
        resumo,
        h('div', { class: 'busca' }, h('label', { for: 'busca' }, 'Buscar'), busca),
        area,
        h('div', { class: 'rodape-admin' }, h('span', { class: 'sm' }, 'Usuários e pedidos são carregados do backend GPC.')));
    desenhar();
})();
