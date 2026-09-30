const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro || "Email ou senha inválidos.");
            return;
        }

        const usuario = await resposta.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));
        window.location.href = "index.html";
    } catch (erro) {
        console.error("Erro ao entrar:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
