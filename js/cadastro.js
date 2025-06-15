const formCadastro = document.getElementById("formcadastro");
const mensagemErro = document.getElementById("mensagemErro");

formCadastro.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const dataNascimento = document.getElementById("date").value;
  const genero = document.getElementById("gen").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmsenha").value;

  if (senha !== confirmaSenha) {
    mensagemErro.textContent = "As senhas não conferem!";
    mensagemErro.style.color = "red";
    return;
  }

  if (senha.length < 8) {
    mensagemErro.textContent = "A senha deve ter pelo menos 8 caracteres.";
    mensagemErro.style.color = "red";
    return;
  }

  // Verificar se já existe algum usuário com esse e-mail
  const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];

  const emailJaExiste = usuariosSalvos.some(usuario => usuario.email === email);

  if (emailJaExiste) {
    mensagemErro.textContent = "Este e-mail já está cadastrado!";
    mensagemErro.style.color = "red";
    return;
  }

  // Criar novo usuário
  const novoUsuario = {
    nome,
    dataNascimento,
    genero,
    email,
    senha
  };

  usuariosSalvos.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos));

  mensagemErro.style.color = "green";
  mensagemErro.textContent = "Cadastro realizado com sucesso! Redirecionando...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
