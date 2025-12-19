const formLogin = document.getElementById("formlogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

function mostrarMensagem(texto, tipo) {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = ""; // limpa classes antigas
  mensagemLogin.classList.add(tipo, "show");
}

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    mostrarMensagem("Nenhum usuário cadastrado.", "error");
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  if (
    emailInput.value === usuario.email &&
    senhaInput.value === usuario.senha
  ) {
    mostrarMensagem("Login realizado com sucesso!", "success");

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
  } else {
    mostrarMensagem("Email ou senha incorretos.", "error");
  }
});


