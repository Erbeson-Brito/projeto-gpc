// Cadastro: cria a conta na "API" local (store.js), já deixa o aluno logado e leva às trilhas.
(function () {
    const form = document.getElementById('formCadastro');
    const erro = document.getElementById('erroCadastro');
    const params = new URLSearchParams(location.search);

    // só aceita voltar para páginas do próprio site (ex.: "trilha.html?id=backend")
    const proxima = (params.get('next') || '').match(/^[\w-]+\.html(\?[\w=&%.-]*)?$/) ? params.get('next') : null;

    // quem já está logado não precisa criar conta
    if (GPC.usuarioAtual()) { location.replace(proxima || 'index.html'); return; }
    if (proxima) document.getElementById('linkLogin').href = 'login.html?next=' + encodeURIComponent(proxima);

    function mostrarErro(texto) {
        erro.textContent = texto;
        erro.hidden = false;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        erro.hidden = true;

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirmarSenha').value;

        if (senha !== confirmar) {
            mostrarErro('As senhas não coincidem.');
            document.getElementById('confirmarSenha').focus();
            return;
        }

        try {
            const usuario = GPC.cadastrar({ nome, email, senha });
            GPCUI.avisoProximaPagina(`Conta criada! Bem-vindo(a) ao GPC, ${GPCUI.primeiroNome(usuario)}.`);
            location.href = proxima || 'trilhas.html';
        } catch (err) {
            mostrarErro(GPCUI.mensagemDeErro(err));
        }
    });
})();
