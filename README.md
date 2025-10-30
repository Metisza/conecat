# 🐱 Conecat - Rede Social

O Conecat é uma rede social que estou desenvolvendo conforme vou progredindo nos meus estudos, portanto ainda está incompleta.

## 📋 Visão Geral

Rede social construída com FastAPI (backend) e HTML/CSS/JavaScript vanilla (frontend), com autenticação JWT e banco de dados SQLite/PostgreSQL.

## 🚀 Quick Start com Docker

```bash
# Clone e entre no diretório
git clone <https://github.com/Metisza/Conecat.git>
cd Conecat

# Suba os serviços
docker-compose up -d

# Acesse: http://localhost:8000
```

## 📦 Instalação Local

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app:app --reload

# Acesse: http://localhost:8000
```

## 📚 Documentação

- **Backend README**: [backend/README.md](backend/README.md)
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ✅ Funcionalidades

- ✅ Cadastro e Login com JWT
- ✅ Autenticação segura (bcrypt)
- ✅ API RESTful documentada
- 🚧 Sistema de posts (em desenvolvimento)
- 🚧 Sistema de amizades (em desenvolvimento)

## 🛠️ Tecnologias

**Backend**: FastAPI, SQLAlchemy, JWT, Bcrypt
**Frontend**: HTML5, CSS3, JavaScript ES6+
**Database**: SQLite (dev) / PostgreSQL (prod)

## 📄 Licença

MIT License

---

**Status**: 🚧 Em desenvolvimento ativo
