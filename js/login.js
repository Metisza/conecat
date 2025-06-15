const formlogin = document.getElementById("formlogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

formlogin.addEventListener("submit", function(event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem("usuario");
  if (!usuarioSalvo) {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Nenhum usuário cadastrado. Por favor, faça o cadastro primeiro.";
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  if (emailInput.value === usuario.email && senhaInput.value === usuario.senha) {
    mensagemLogin.style.color = "green";
    mensagemLogin.textContent = "Login bem-sucedido! Redirecionando...";

    setTimeout(() => {
      window.location.href = "pagina-principal.html"; // ajuste o caminho da página após login
    }, 1500);
  } else {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Email ou senha incorretos.";
  }
});
