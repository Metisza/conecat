# Conecat Backend API

Backend da rede social Conecat construído com FastAPI, SQLAlchemy e autenticação JWT.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Servidor](#executando-o-servidor)
- [Documentação da API](#documentação-da-api)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Docker](#docker)

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **Bcrypt** - Hash de senhas
- **JWT (PyJWT)** - Autenticação via tokens
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

## 📁 Estrutura do Projeto

```
backend/
├── app.py                 # Aplicação principal FastAPI
├── config.py              # Configurações (JWT, DB)
├── database.py            # Configuração do banco de dados
├── models.py              # Schemas Pydantic
├── requirements.txt       # Dependências Python
├── routes/
│   ├── __init__.py
│   ├── auth.py           # Rotas de autenticação
│   ├── users.py          # Rotas de usuários
│   └── posts.py          # Rotas de posts
├── middleware/
│   └── auth.py           # Middleware de autenticação
└── conecat.db            # Banco de dados SQLite (criado automaticamente)
```

## 📦 Instalação

### Pré-requisitos

- Python 3.11 ou superior
- pip

### Passo a passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Conecat/backend
```

2. **Crie um ambiente virtual**
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

## ⚙️ Configuração

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do backend:

```env
SECRET_KEY=sua-chave-secreta-super-segura
DATABASE_URL=sqlite:///./conecat.db
```

**Nota:** Se não configurar, valores padrão serão usados.

### Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução.

## 🏃 Executando o Servidor

### Modo Desenvolvimento

```bash
uvicorn app:app --reload
```

Ou:

```bash
python app.py
```

O servidor iniciará em: **http://localhost:8000**

### Modo Produção

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

## 📚 Documentação da API

A documentação interativa é gerada automaticamente pelo FastAPI:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🛣️ Rotas Disponíveis

### Frontend (Páginas HTML)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página inicial |
| GET | `/register` | Página de cadastro |
| GET | `/login` | Página de login |
| GET | `/pagina-principal` | Página principal (após login) |

### API - Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/api/auth/register` | Cadastrar novo usuário | Não |
| POST | `/api/auth/login` | Fazer login | Não |
| GET | `/api/auth/me` | Obter usuário logado | Sim |

### API - Usuários

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/api/users/` | Listar usuários | Em desenvolvimento |

### API - Posts

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/api/posts/` | Listar posts | Em desenvolvimento |

### Utilitários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |

## 🔐 Autenticação

O backend usa **JWT (JSON Web Tokens)** para autenticação.

### Fluxo de Autenticação

1. **Registro**: `POST /api/auth/register`
   ```json
   {
     "nome": "João Silva",
     "email": "joao@example.com",
     "senha": "senha123456",
     "confirm_senha": "senha123456",
     "data_nascimento": "2000-01-15",
     "genero": "masc"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "joao@example.com",
     "senha": "senha123456"
   }
   ```

   **Resposta:**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer",
     "user": {
       "id": 1,
       "nome": "João Silva",
       "email": "joao@example.com",
       "data_nascimento": "2000-01-15",
       "genero": "masc",
       "created_at": "2025-10-28T12:00:00"
     }
   }
   ```

3. **Usar Token**: Incluir no header das requisições autenticadas
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Exemplos de Requisição

**cURL:**
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"senha123456"}'

# Obter usuário logado
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**JavaScript (Fetch):**
```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@example.com',
    senha: 'senha123456'
  })
});
const data = await response.json();
const token = data.access_token;

// Requisição autenticada
const user = await fetch('http://localhost:8000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🧪 Testes

### Testar Endpoints via Swagger

1. Acesse http://localhost:8000/docs
2. Clique no endpoint desejado
3. Clique em "Try it out"
4. Preencha os dados
5. Execute

### Testar via cURL

```bash
# Health check
curl http://localhost:8000/health

# Cadastro
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Usuario",
    "email": "teste@example.com",
    "senha": "senha12345",
    "confirm_senha": "senha12345",
    "data_nascimento": "1995-05-20",
    "genero": "outro"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","senha":"senha12345"}'
```

## 🐳 Docker

### Usando Docker Compose (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Usando Docker puro

```bash
# Build
docker build -t conecat-backend .

# Run
docker run -p 8000:8000 conecat-backend
```

## 🔧 Desenvolvimento

### Adicionar Nova Rota

1. Crie a rota em `routes/`:
```python
# routes/exemplo.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def exemplo():
    return {"message": "Olá!"}
```

2. Registre no `app.py`:
```python
from routes import exemplo

app.include_router(exemplo.router, prefix="/api/exemplo", tags=["Exemplo"])
```

### Atualizar Banco de Dados

Modifique `database.py` e reinicie o servidor. As tabelas serão recriadas automaticamente.

## 📝 Notas

- **Segurança**: Troque a `SECRET_KEY` em produção
- **Banco de Dados**: Em produção, use PostgreSQL/MySQL
- **CORS**: Configure `allow_origins` para domínios específicos em produção
- **Senhas**: Sempre criptografadas com bcrypt
- **Tokens JWT**: Expiram em 7 dias

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Bruno Rodrigues

---

**Status do Projeto**: 🚧 Em desenvolvimento ativo
