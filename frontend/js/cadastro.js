const formCadastro = document.getElementById("formcadastro");
const mensagemErro = document.getElementById("mensagemErro");

formCadastro.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmsenha").value;

  if (senha !== confirmaSenha) {
    mensagemErro.textContent = "As senhas não conferem.";
    mensagemErro.style.color = "red";
    return;
  }

  if (senha.length < 8) {
    mensagemErro.textContent = "A senha deve ter no mínimo 8 caracteres.";
    mensagemErro.style.color = "red";
    return;
  }

  const usuarioSalvo = localStorage.getItem("usuario");

  if (usuarioSalvo) {
    const usuarioExistente = JSON.parse(usuarioSalvo);

    if (usuarioExistente.email === email) {
      mensagemErro.textContent = "Este email já está cadastrado.";
      mensagemErro.style.color = "red";
      return;
    }
  }

  const novoUsuario = {
    nome,
    email,
    senha
  };

  localStorage.setItem("usuario", JSON.stringify(novoUsuario));

  mensagemErro.style.color = "green";
  mensagemErro.textContent = "Cadastro realizado com sucesso!";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});

