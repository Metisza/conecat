const formLogin = document.getElementById("formlogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    mensagemLogin.textContent = "Nenhum usuário cadastrado.";
    mensagemLogin.style.color = "red";
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  if (
    emailInput.value === usuario.email &&
    senhaInput.value === usuario.senha
  ) {
    mensagemLogin.style.color = "green";
    mensagemLogin.textContent = "Login realizado com sucesso!";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } else {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Email ou senha incorretos.";
  }
});


