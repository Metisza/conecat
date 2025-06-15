const formlogin = document.getElementById("formlogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

formlogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuariosSalvos.find(
    usuario => usuario.email === emailInput.value && usuario.senha === senhaInput.value
  );

  if (usuarioEncontrado) {
    mensagemLogin.style.color = "green";
    mensagemLogin.textContent = "Login bem-sucedido! Redirecionando...";

    setTimeout(() => {
      window.location.href = "pagina-principal.html";
    }, 1500);
  } else {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Email ou senha incorretos.";
  }
});

