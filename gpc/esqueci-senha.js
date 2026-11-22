// Esqueci minha senha: pede ao backend o link de redefinição.
(function () {
    const form = document.getElementById('formEsqueci');
    const erro = document.getElementById('erroEsqueci');
    const botao = document.getElementById('btnEnviar');
    const campoEmail = document.getElementById('email');
    const params = new URLSearchParams(location.search);

    // só aceita voltar para páginas do próprio site
    const proxima = (params.get('next') || '').match(/^[\w-]+\.html(\?[\w=&%.-]*)?$/) ? params.get('next') : null;
    if (proxima) {
        const volta = 'login.html?next=' + encodeURIComponent(proxima);
        document.getElementById('linkVoltar').href = volta;
        document.getElementById('linkLogin').href = volta;
    }
    if (params.get('email')) campoEmail.value = params.get('email');

    function mostrarErro(texto) { erro.textContent = texto; erro.hidden = false; }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        erro.hidden = true;

        const email = campoEmail.value.trim();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            mostrarErro('Informe um e-mail válido.');
            campoEmail.focus();
            return;
        }

        botao.disabled = true;
        botao.textContent = 'Enviando...';
        try {
            const resp = await GPCAPI.esqueciSenha(email);
            form.hidden = true;
            document.getElementById('msgConfirmacao').textContent = resp.mensagem;

            // sem servidor de e-mail, o backend devolve o token em modo desenvolvimento
            if (resp.tokenDev) {
                const link = new URL('redefinir-senha.html', location.href);
                link.search = new URLSearchParams(proxima ? { token: resp.tokenDev, next: proxima } : { token: resp.tokenDev });
                const a = document.getElementById('linkDev');
                a.href = link.href;
                a.textContent = 'Criar nova senha';
                document.getElementById('caixaDev').hidden = false;
            }
            document.getElementById('confirmacao').hidden = false;
        } catch (err) {
            botao.disabled = false;
            botao.textContent = 'Enviar link de recuperação';
            mostrarErro(GPCUI.mensagemDeErro(err));
        }
    });
})();
