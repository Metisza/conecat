const forml = document.getElementById("formcadastro");
const senha = document.getElementById("senha");
const confirmsenha = document.getElementById("confirmsenha");
const mensagemErro = document.getElementById("mensagemErro");

forml.addEventListener("submit", function(event) {
  if (senha.value !== confirmsenha.value) {
    event.preventDefault(); // impede o envio do formulário
    mensagemErro.textContent = "As senhas não são iguais!";
  } else if (senha.value.length < 8) {
    event.preventDefault();
    mensagemErro.textContent = "A senha deve ter pelo menos 8 caracteres.";
  } else {
    mensagemErro.textContent = ""; // limpa a mensagem de erro
  }
});
