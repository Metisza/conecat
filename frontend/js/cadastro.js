const formCadastro = document.getElementById("formcadastro");
const mensagemErro = document.getElementById("mensagemErro");

// URL da API
const API_URL = "http://localhost:8000";

formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const dataNascimento = document.getElementById("date").value;
  const genero = document.getElementById("gen").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmsenha").value;

  // Validação client-side
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

  // Preparar dados para enviar à API
  const userData = {
    nome: nome,
    email: email,
    senha: senha,
    confirm_senha: confirmaSenha,
    data_nascimento: dataNascimento,
    genero: genero
  };

  // Desabilitar botão de envio durante o request
  const submitBtn = formCadastro.querySelector('input[type="submit"]');
  submitBtn.disabled = true;
  mensagemErro.textContent = "Cadastrando...";
  mensagemErro.style.color = "blue";

  try {
    // Enviar requisição para a API
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      // Cadastro bem-sucedido
      mensagemErro.style.color = "green";
      mensagemErro.textContent = "Cadastro realizado com sucesso! Redirecionando...";

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      // Erro no cadastro
      submitBtn.disabled = false;
      mensagemErro.style.color = "red";

      // Tratar diferentes tipos de erro
      if (data.detail) {
        mensagemErro.textContent = data.detail;
      } else if (data.errors && data.errors.length > 0) {
        mensagemErro.textContent = data.errors[0].message;
      } else {
        mensagemErro.textContent = "Erro ao realizar cadastro. Tente novamente.";
      }
    }
  } catch (error) {
    // Erro de conexão
    submitBtn.disabled = false;
    mensagemErro.style.color = "red";
    mensagemErro.textContent = "Erro de conexão com o servidor. Verifique se o backend está rodando.";
    console.error("Erro:", error);
  }
});
