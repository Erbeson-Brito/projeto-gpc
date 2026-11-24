// Redefinir senha: valida o token do link no banco local e grava a nova senha.
(function () {
    const params = new URLSearchParams(location.search);
    const token = params.get('token') || '';
    const proxima = (params.get('next') || '').match(/^[\w-]+\.html(\?[\w=&%.-]*)?$/) ? params.get('next') : null;
    const loginHref = proxima ? 'login.html?next=' + encodeURIComponent(proxima) : 'login.html';

    const $ = (id) => document.getElementById(id);
    const estados = ['estadoCarregando', 'estadoInvalido', 'formRedefinir', 'estadoSucesso'];
    function mostrar(qual) { estados.forEach((id) => { $(id).hidden = id !== qual; }); }

    $('linkVoltar').href = loginHref;
    $('btnIrLogin').href = loginHref;

    const form = $('formRedefinir');
    const erro = $('erroRedefinir');
    const botao = $('btnSalvar');
    function mostrarErro(texto) { erro.textContent = texto; erro.hidden = false; }

    $('mostrarSenha').addEventListener('change', (e) => {
        const tipo = e.target.checked ? 'text' : 'password';
        $('novaSenha').type = tipo;
        $('confirmarSenha').type = tipo;
    });

    // 1) confere o link antes de mostrar o formulário
    (async function validar() {
        if (!token) {
            $('msgInvalido').textContent = 'Link de recuperação inválido. Peça um novo.';
            mostrar('estadoInvalido');
            return;
        }
        try {
            await GPC.validarTokenSenha(token);
            mostrar('formRedefinir');
            $('novaSenha').focus();
        } catch (err) {
            $('msgInvalido').textContent = GPCUI.mensagemDeErro(err);
            mostrar('estadoInvalido');
        }
    })();

    // 2) grava a nova senha
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        erro.hidden = true;

        const nova = $('novaSenha').value;
        const confirmar = $('confirmarSenha').value;
        if (nova.length < 6) { mostrarErro('A senha precisa ter pelo menos 6 caracteres.'); $('novaSenha').focus(); return; }
        if (nova.length > 72) { mostrarErro('A senha pode ter no máximo 72 caracteres.'); $('novaSenha').focus(); return; }
        if (nova !== confirmar) { mostrarErro('As senhas não coincidem.'); $('confirmarSenha').focus(); return; }

        botao.disabled = true;
        botao.textContent = 'Salvando...';
        try {
            await GPC.redefinirSenha(token, nova);
            // tira o token da barra de endereço/histórico
            history.replaceState(null, '', 'redefinir-senha.html');
            mostrar('estadoSucesso');
        } catch (err) {
            botao.disabled = false;
            botao.textContent = 'Salvar nova senha';
            mostrarErro(GPCUI.mensagemDeErro(err));
        }
    });
})();
