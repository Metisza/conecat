document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle-senha");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling;
      const tipoAtual = input.getAttribute("type");

      if (tipoAtual === "password") {
        input.setAttribute("type", "text");
        toggle.setAttribute("src", "../images/esconder.png");
      } else {
        input.setAttribute("type", "password");
        toggle.setAttribute("src", "../images/olho-aberto.png");
      }
    });
  });
});
