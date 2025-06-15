const formCadastro = document.getElementById("formcadastro");
const mensagemErro = document.getElementById("mensagemErro");

formCadastro.addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const dataNascimento = document.getElementById("date").value;
  const genero = document.getElementById("gen").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmaSenha = document.getElementById("confirmsenha").value.trim();

  // Verificar se já existe usuário cadastrado
  if(localStorage.getItem("usuario")) {
    mensagemErro.style.color = "red";
    mensagemErro.textContent = "Usuário já cadastrado! Por favor, faça login.";
    return;
  }

  // Verificar se as senhas conferem
  if (senha !== confirmaSenha) {
    mensagemErro.style.color = "red";
    mensagemErro.textContent = "As senhas não conferem!";
    return;
  }

  // Verificar tamanho da senha
  if (senha.length < 8) {
    mensagemErro.style.color = "red";
    mensagemErro.textContent = "A senha deve ter pelo menos 8 caracteres.";
    return;
  }

  // Criar objeto usuário
  const usuario = {
    nome,
    dataNascimento,
    genero,
    email,
    senha
  };

  // Salvar usuário no localStorage
  localStorage.setItem("usuario", JSON.stringify(usuario));

  // Mensagem de sucesso
  mensagemErro.style.color = "green";
  mensagemErro.textContent = "Cadastro realizado com sucesso! Redirecionando...";

  // Redirecionar para login após 2 segundos
  setTimeout(() => {
    window.location.href = "login.html"; // ajuste o caminho se precisar
  }, 2000);
});

