const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro || "Não foi possível realizar o cadastro.");
            return;
        }

        const usuario = await resposta.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";
    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
