const formCadastro = document.getElementById("formcadastro");
const mensagemErro = document.getElementById("mensagemErro");

function mostrarMensagemCadastro(texto, tipo) {
  mensagemErro.textContent = texto;
  mensagemErro.className = "mensagem"; // limpa classes anteriores
  mensagemErro.classList.add(tipo, "show");
}

formCadastro.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmsenha").value;

  // validação: senhas iguais
  if (senha !== confirmaSenha) {
    mostrarMensagemCadastro("As senhas não conferem.", "error");
    return;
  }

  // validação: tamanho mínimo da senha
  if (senha.length < 8) {
    mostrarMensagemCadastro(
      "A senha deve ter no mínimo 8 caracteres.",
      "error"
    );
    return;
  }

  const usuarioSalvo = localStorage.getItem("usuario");

  if (usuarioSalvo) {
    const usuarioExistente = JSON.parse(usuarioSalvo);

    if (usuarioExistente.email === email) {
      mostrarMensagemCadastro(
        "Este email já está cadastrado.",
        "error"
      );
      return;
    }
  }

  const novoUsuario = {
    nome,
    email,
    senha
  };

  localStorage.setItem("usuario", JSON.stringify(novoUsuario));

  mostrarMensagemCadastro("Cadastro realizado com sucesso!", "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});
