document.addEventListener("DOMContentLoaded", () => {
  const senhaInput = document.getElementById("senha");
  const toggleSenha = document.getElementById("toggleSenha");

  if (senhaInput && toggleSenha) {
    toggleSenha.addEventListener("click", () => {
      const tipoAtual = senhaInput.getAttribute("type");

      if (tipoAtual === "password") {
        senhaInput.setAttribute("type", "text");
        toggleSenha.setAttribute("src", "../images/esconder.png");
      } else {
        senhaInput.setAttribute("type", "password");
        toggleSenha.setAttribute("src", "../images/olho-aberto.png");
      }
    });
  }
});
