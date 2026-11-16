const formCadastro = document.getElementById("formCadastro");

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById("mensagemAlert");
  if (!el) return;
  el.textContent = texto;
  el.style.display = "block";
  el.classList.remove("sucesso", "erro");
  el.classList.add(tipo);
}

formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (!nome || !email || !senha) {
    mostrarMensagem("Preencha todos os campos!", "erro");
    return;
  }

  if (senha !== confirmarSenha) {
    mostrarMensagem("As senhas não coincidem!", "erro");
    return;
  }

  try {
    const usuario = await GPCLoader.durante(async () => {
      const resposta = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro || "Erro ao cadastrar");
      }

      const texto = await resposta.text();
      try {
        return JSON.parse(texto);
      } catch (e) {
        return { nome, email, mensagem: texto };
      }
    }, {
      texto: "Criando sua conta...",
      imagem: "midia/GPCLogo.png",
      minimo: 2500,
      esconderNoFim: true
    });

    localStorage.setItem("usuario", JSON.stringify(usuario));

    mostrarMensagem("Cadastro realizado com sucesso!", "sucesso");
    await new Promise(r => setTimeout(r, 1500));
    window.location.href = "index.html";

  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});