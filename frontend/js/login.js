const formlogin = document.getElementById("formlogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");

// URL da API
const API_URL = "http://localhost:8000";

formlogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  // Validação básica
  if (!email || !senha) {
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  // Preparar dados para enviar à API
  const loginData = {
    email: email,
    senha: senha
  };

  // Desabilitar botão durante o request
  const submitBtn = formlogin.querySelector('input[type="submit"]');
  submitBtn.disabled = true;
  mensagemLogin.textContent = "Entrando...";
  mensagemLogin.style.color = "blue";

  try {
    // Enviar requisição para a API
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (response.ok) {
      // Login bem-sucedido
      mensagemLogin.style.color = "green";
      mensagemLogin.textContent = "Login bem-sucedido! Redirecionando...";

      // Salvar token e dados do usuário no localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = "/pagina-principal";
      }, 1500);
    } else {
      // Erro no login
      submitBtn.disabled = false;
      mensagemLogin.style.color = "red";
      mensagemLogin.textContent = data.detail || "Email ou senha incorretos.";
    }
  } catch (error) {
    // Erro de conexão
    submitBtn.disabled = false;
    mensagemLogin.style.color = "red";
    mensagemLogin.textContent = "Erro de conexão com o servidor. Verifique se o backend está rodando.";
    console.error("Erro:", error);
  }
});

