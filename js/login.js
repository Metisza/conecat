const formlogin = document.getElementById("formlogin");
const email = document.getElementById("email");
const senhaLogin = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

// Simulando um "usuário cadastrado" (exemplo fixo)
const usuarioCadastrado = {
  email: "usuario@exemplo.com",
  senha: "senha123"
};

formlogin.addEventListener("submit", function(event) {
  event.preventDefault(); // impede o envio padrão do form

  if (email.value === usuarioCadastrado.email && senhaLogin.value === usuarioCadastrado.senha) {
    mensagemLogin.style.color = "green";
    mensagemLogin.textContent = "Login bem-sucedido! Redirecionando...";

    // Aqui você poderia redirecionar o usuário, por exemplo:
    setTimeout(() => {
      window.location.href = "pagina-principal.html"; // mudar para a página do feed
    }, 1500);
  } else {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Email ou senha incorretos.";
  }
});
