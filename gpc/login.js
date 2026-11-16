// Login: confere e-mail e senha na "API" local (store.js) e leva o usuário ao destino certo.
(function () {
    const form = document.getElementById('formLogin');
    const erro = document.getElementById('erroLogin');
    const botao = form.querySelector('.btn-entrar');
    const params = new URLSearchParams(location.search);

    // só aceita voltar para páginas do próprio site (ex.: "trilha.html?id=backend")
    const proxima = (params.get('next') || '').match(/^[\w-]+\.html(\?[\w=&%.-]*)?$/) ? params.get('next') : null;
    const destinoPadrao = (u) => (GPC.temPapel(u, 'ADMINISTRADOR') ? 'admin-pedidos.html' : 'index.html');

    // quem já está logado não precisa ver o login
    const jaLogado = GPC.usuarioAtual();
    if (jaLogado) { location.replace(proxima || destinoPadrao(jaLogado)); return; }

    // mantém o "voltar para" ao ir criar a conta
    if (proxima) document.getElementById('linkCadastro').href = 'cadastro.html?next=' + encodeURIComponent(proxima);

    function mostrarErro(texto) {
        erro.textContent = texto;
        erro.hidden = false;
    }

    document.getElementById('esqueciSenha').addEventListener('click', (e) => {
        e.preventDefault();
        GPCUI.toast('Esta versão funciona só no navegador e não envia e-mails. Peça a um administrador para excluir a conta antiga e crie uma nova.', 'erro');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        erro.hidden = true;

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        if (!email || !senha) { mostrarErro('Informe o e-mail e a senha.'); return; }

        botao.disabled = true; // evita clicar duas vezes durante a animação
        let usuario;
        try {
            usuario = GPC.entrar(email, senha);
        } catch (err) {
            botao.disabled = false;
            mostrarErro(GPCUI.mensagemDeErro(err));
            return;
        }

        // login correto: a árvore do GPC cresce por cima da tela antes de entrar
        await GPCLoader.durante(async () => {}, { texto: 'Entrando...', imagem: 'midia/GPClogo.png' });
        location.href = proxima || destinoPadrao(usuario);
    });
})();
