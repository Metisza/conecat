// URL da API
const API_URL = "http://localhost:8000";

// Elementos do DOM
const userName = document.getElementById("userName");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const btnLogout = document.getElementById("btnLogout");
const formCreatePost = document.getElementById("formCreatePost");
const postContent = document.getElementById("postContent");
const charCount = document.getElementById("charCount");
const feedPosts = document.getElementById("feedPosts");

// Verificar autenticação ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadUserData();
  loadPosts();
});

// Verificar se o usuário está autenticado
function checkAuthentication() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Redirecionar para login se não estiver autenticado
    window.location.href = "/login";
    return;
  }
}

// Carregar dados do usuário
function loadUserData() {
  const userDataStr = localStorage.getItem("user");

  if (!userDataStr) {
    console.error("Dados do usuário não encontrados");
    return;
  }

  try {
    const userData = JSON.parse(userDataStr);

    // Atualizar interface com dados do usuário
    if (userName) userName.textContent = userData.nome || userData.email;
    if (profileName) profileName.textContent = userData.nome || "Usuário";
    if (profileEmail) profileEmail.textContent = userData.email || "";
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
}

// Contador de caracteres
postContent.addEventListener("input", function () {
  const currentLength = postContent.value.length;
  charCount.textContent = `${currentLength}/500`;

  // Mudar cor quando estiver próximo do limite
  if (currentLength > 450) {
    charCount.style.color = "#f44336";
  } else {
    charCount.style.color = "#666666";
  }
});

// Criar novo post
formCreatePost.addEventListener("submit", async function (event) {
  event.preventDefault();

  const content = postContent.value.trim();

  if (!content) {
    alert("Por favor, escreva algo antes de publicar!");
    return;
  }

  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Você precisa estar autenticado para publicar!");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content: content })
    });

    if (response.ok) {
      const newPost = await response.json();

      // Limpar formulário
      postContent.value = "";
      charCount.textContent = "0/500";
      charCount.style.color = "#666666";

      // Recarregar posts
      loadPosts();
    } else if (response.status === 401) {
      alert("Sua sessão expirou. Faça login novamente.");
      handleLogout();
    } else {
      const errorData = await response.json();
      alert("Erro ao criar post: " + (errorData.detail || "Erro desconhecido"));
    }
  } catch (error) {
    console.error("Erro ao criar post:", error);
    alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
  }
});

// Carregar posts do feed
async function loadPosts() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    feedPosts.innerHTML = '<p class="error-message">Você precisa estar autenticado!</p>';
    return;
  }

  try {
    feedPosts.innerHTML = '<div class="loading-message">Carregando posts...</div>';

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const posts = await response.json();

      if (posts.length === 0) {
        feedPosts.innerHTML = '<p class="empty-message">Nenhum post ainda. Seja o primeiro a publicar!</p>';
        return;
      }

      // Renderizar posts
      feedPosts.innerHTML = "";
      posts.forEach(post => {
        feedPosts.appendChild(createPostElement(post));
      });
    } else if (response.status === 401) {
      feedPosts.innerHTML = '<p class="error-message">Sessão expirada. Faça login novamente.</p>';
      setTimeout(() => handleLogout(), 2000);
    } else {
      feedPosts.innerHTML = '<p class="error-message">Erro ao carregar posts.</p>';
    }
  } catch (error) {
    console.error("Erro ao carregar posts:", error);
    feedPosts.innerHTML = '<p class="error-message">Erro de conexão com o servidor.</p>';
  }
}

// Criar elemento de post
function createPostElement(post) {
  const postCard = document.createElement("div");
  postCard.className = "post-card";

  // Formatar data
  const postDate = new Date(post.created_at || Date.now());
  const formattedDate = formatDate(postDate);

  postCard.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">
        <img src="/images/cat.png" alt="Avatar"/>
      </div>
      <div class="post-author-info">
        <div class="post-author-name">${post.author_name || "Usuário"}</div>
        <div class="post-date">${formattedDate}</div>
      </div>
    </div>
    <div class="post-content">
      ${escapeHtml(post.content)}
    </div>
    <div class="post-actions">
      <button class="action-btn" onclick="likePost(${post.id})">
        ❤️ Curtir ${post.likes > 0 ? `(${post.likes})` : ""}
      </button>
      <button class="action-btn">
        💬 Comentar
      </button>
      <button class="action-btn">
        🔄 Compartilhar
      </button>
    </div>
  `;

  return postCard;
}

// Formatar data
function formatDate(date) {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Curtir post (função placeholder)
function likePost(postId) {
  console.log("Curtir post:", postId);
  alert("Funcionalidade de curtir em desenvolvimento!");
}

// Logout
btnLogout.addEventListener("click", handleLogout);

function handleLogout() {
  // Limpar dados do localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  // Redirecionar para página inicial
  window.location.href = "/";
}
