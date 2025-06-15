const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {
  const tipoAtual = senhaInput.getAttribute("type");
  const novoTipo = tipoAtual === "password" ? "text" : "password";
  senhaInput.setAttribute("type", novoTipo);

  // Altera a imagem do olho
  toggleSenha.src = novoTipo === "password"
    ? "../images/olho-aberto.png"      // 👁️ Olho aberto
    : "../images/esconder.png"; // 🙈 Olho fechado
});
