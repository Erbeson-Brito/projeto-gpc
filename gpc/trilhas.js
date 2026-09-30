const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
const btnConta = document.getElementById("btnConta");
const modoVisitante = document.querySelector(".modo-visitante");

if (usuario) {
    if (btnConta) {
        btnConta.textContent = `Sair (${usuario.nome})`;
        btnConta.href = "#";
        btnConta.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        });
    }

    if (modoVisitante) {
        modoVisitante.style.display = "none";
    }
}
