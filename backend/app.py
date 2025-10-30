from fastapi import FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import auth, users, posts
from database import Base, engine
import uvicorn
import os

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Conecat API",
    version="1.0.0",
    description="API da rede social Conecat"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção: ["http://localhost:8000", "http://127.0.0.1:8000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Exception Handler para validações (mensagens em português)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """Tratamento personalizado de erros de validação"""
    errors = []
    for error in exc.errors():
        field = error['loc'][-1] if error['loc'] else 'unknown'
        message = error['msg']
        error_type = error.get('type', '')

        # Mensagens customizadas em português
        if 'senhas_devem_ser_iguais' in str(error):
            message = "As senhas não conferem!"
        elif 'validar_idade_minima' in str(error):
            message = "Você deve ter pelo menos 13 anos"
        elif field == 'email' or 'email' in error_type:
            message = "Email inválido"
        elif 'min_length' in message or 'at least' in message:
            message = f"Campo '{field}' muito curto"
        elif 'missing' in error_type:
            message = f"Campo '{field}' é obrigatório"
        elif 'string_pattern_mismatch' in error_type:
            message = f"Valor inválido para '{field}'"

        errors.append({
            "field": field,
            "message": message
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Erro de validação", "errors": errors}
    )

# Registrar rotas com prefixo /api
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(users.router, prefix="/api/users", tags=["Usuários"])
app.include_router(posts.router, prefix="/api/posts", tags=["Publicações"])

# Montar arquivos estáticos (CSS, JS, imagens)
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/css", StaticFiles(directory=os.path.join(frontend_path, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(frontend_path, "js")), name="js")
    app.mount("/images", StaticFiles(directory=os.path.join(frontend_path, "images")), name="images")

# Rotas para servir páginas HTML
@app.get("/", tags=["Frontend"])
async def index():
    """Página inicial"""
    html_path = os.path.join(frontend_path, "html", "index.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"message": "Bem-vindo ao Conecat API!", "version": "1.0.0", "docs": "/docs"}

@app.get("/register", tags=["Frontend"])
async def register_page():
    """Página de cadastro"""
    html_path = os.path.join(frontend_path, "html", "register.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"error": "Página não encontrada"}

@app.get("/login", tags=["Frontend"])
async def login_page():
    """Página de login"""
    html_path = os.path.join(frontend_path, "html", "login.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"error": "Página não encontrada"}

@app.get("/pagina-principal", tags=["Frontend"])
async def main_page():
    """Página principal (após login)"""
    html_path = os.path.join(frontend_path, "html", "pagina-principal.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"error": "Página não encontrada"}

@app.get("/health", tags=["Health"])
async def health_check():
    """Verificar se a API está funcionando"""
    return {"status": "ok", "message": "API está funcionando"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)