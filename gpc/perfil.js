// Perfil do aluno: dados da conta, perfil de aluno e exclusão da conta.
(function () {
    let usuario = GPCUI.exigir();
    if (!usuario) return;
    GPCUI.montarCabecalho('perfil');

    const { h } = GPCUI;
    const raiz = document.getElementById('conteudo');

    const inNome = h('input', { type: 'text', id: 'nome', autocomplete: 'name', value: usuario.nome });
    const inEmail = h('input', { type: 'email', id: 'email', autocomplete: 'email', value: usuario.email });
    const inObjetivo = h('input', { type: 'text', id: 'objetivo', maxlength: '120', placeholder: 'Ex.: ser desenvolvedor backend', value: usuario.objetivo });
    const selNivel = h('select', { id: 'nivel' }, GPC.NIVEIS.map((n) => h('option', { value: n, selected: n === usuario.nivel }, n)));
    inObjetivo.disabled = true;
    selNivel.disabled = true;

    const erroConta = h('p', { class: 'erro-campo', role: 'alert', hidden: true });
    const erroAluno = h('p', { class: 'erro-campo', role: 'alert', hidden: true });
    const papeis = h('div', { class: 'linha', style: 'margin-top:16px;gap:6px' });

    function desenharPapeis() {
        papeis.replaceChildren(h('span', { class: 'sm' }, 'Seus perfis:'), ...usuario.papeis.map((p) => GPCUI.chipPapel(p)));
    }
    desenharPapeis();

    async function salvar(fn, erroEl, mensagem) {
        erroEl.hidden = true;
        try {
            usuario = await fn();
            GPCUI.montarCabecalho('perfil'); // o nome pode ter mudado
            GPCUI.toast(mensagem);
        } catch (e) {
            erroEl.textContent = GPCUI.mensagemDeErro(e);
            erroEl.hidden = false;
        }
    }

    const formConta = h('form', { novalidate: true, onsubmit: async (e) => {
        e.preventDefault();
        await salvar(() => GPC.atualizarConta(usuario.id, { nome: inNome.value, email: inEmail.value }), erroConta, 'Conta atualizada.');
    } },
        h('div', { class: 'campo' }, h('label', { for: 'nome' }, 'Nome'), inNome),
        h('div', { class: 'campo' }, h('label', { for: 'email' }, 'E-mail'), inEmail),
        erroConta, papeis,
        h('div', { class: 'acoes-form' }, h('button', { class: 'btn btn-pri', type: 'submit' }, 'Salvar conta')));

    const formAluno = h('form', { novalidate: true, onsubmit: async (e) => {
        e.preventDefault();
        await salvar(() => GPC.atualizarAluno(usuario.id, { objetivo: inObjetivo.value, nivel: selNivel.value }), erroAluno, 'Perfil de aluno atualizado.');
    } },
        h('div', { class: 'campo' }, h('label', { for: 'objetivo' }, 'Objetivo profissional'), inObjetivo),
        h('div', { class: 'campo' }, h('label', { for: 'nivel' }, 'Nível de experiência'), selNivel),
        erroAluno,
        h('div', { class: 'acoes-form' }, h('button', { class: 'btn btn-pri', type: 'submit', disabled: true }, 'Salvar perfil')));

    async function excluirConta() {
        const confirmado = await GPCUI.confirmar({
            titulo: 'Excluir sua conta?',
            mensagem: 'Sua conta, seu progresso nas trilhas e seus pedidos de perfil serão apagados de forma definitiva. Essa ação não pode ser desfeita.',
            rotulo: 'Excluir definitivamente', perigo: true,
        });
        if (!confirmado) return;
        try {
            await GPC.excluirUsuario(usuario.id);
            GPCUI.avisoProximaPagina('Sua conta foi excluída.');
            location.href = 'index.html';
        } catch (e) {
            GPCUI.toast(GPCUI.mensagemDeErro(e), 'erro');
        }
    }

    raiz.replaceChildren(
        h('div', { class: 'eyebrow' }, 'Sua conta'),
        h('h1', {}, 'Meu perfil'),
        h('p', { class: 'sm' }, 'A API ainda não oferece salvamento destes campos. Eles serão habilitados quando o endpoint de perfil de aluno estiver disponível.'),
        h('div', { class: 'colunas' },
            h('section', { class: 'cartao', 'aria-labelledby': 'tit-conta' }, h('h2', { id: 'tit-conta' }, 'Conta'), formConta),
            h('section', { class: 'cartao', 'aria-labelledby': 'tit-aluno' }, h('h2', { id: 'tit-aluno' }, 'Perfil de aluno'), formAluno)),
        h('section', { class: 'cartao perigo', 'aria-labelledby': 'tit-excluir' },
            h('h2', { id: 'tit-excluir' }, 'Excluir conta'),
            h('p', { class: 'sm' }, 'Apaga sua conta e todo o seu progresso. Pediremos uma confirmação antes.'),
            h('div', { class: 'acoes-form' }, h('button', { class: 'btn btn-perigo', type: 'button', onclick: excluirConta }, 'Excluir minha conta'))));
})();
