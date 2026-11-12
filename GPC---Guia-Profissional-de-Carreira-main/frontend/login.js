const formLogin = document.getElementById("formLogin");

// Erro de login "esperado" (senha errada etc.), diferente de falha de conexão
class ErroLogin extends Error {}

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const botao = formLogin.querySelector(".btn-entrar");

    botao.disabled = true; // evita clicar duas vezes enquanto carrega

    try {
        // A animação do GPC aparece por cima do login enquanto o servidor responde
        const usuario = await GPCLoader.durante(async () => {
            const resposta = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                throw new ErroLogin(erro || "Email ou senha inválidos.");
            }

            return await resposta.json();
        }, {
            texto: "Entrando...",
            imagem: "midia/arvore-gpc.png" // caminho da imagem da árvore
        });

        localStorage.setItem("usuario", JSON.stringify(usuario));
        window.location.href = "index.html";
    } catch (erro) {
        // o loading já sumiu sozinho; agora mostramos o erro
        botao.disabled = false;
        if (erro instanceof ErroLogin) {
            alert(erro.message);
        } else {
            console.error("Erro ao entrar:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    }
});
