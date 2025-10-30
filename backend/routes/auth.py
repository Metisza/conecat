from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

from models import UserResponse, UserRegister
from database import get_db, User
from sqlalchemy.orm import Session
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Schemas para Login
class LoginRequest(BaseModel):
    email: EmailStr
    senha: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Funções de hash de senha usando bcrypt diretamente
def hash_senha(senha: str) -> str:
    """Gera hash da senha usando bcrypt"""
    senha_bytes = senha.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(senha_bytes, salt)
    return hashed.decode('utf-8')

def verificar_senha(plain_senha: str, hashed_senha: str) -> bool:
    """Verifica se a senha corresponde ao hash"""
    senha_bytes = plain_senha.encode('utf-8')
    hashed_bytes = hashed_senha.encode('utf-8')
    return bcrypt.checkpw(senha_bytes, hashed_bytes)

# Funções JWT
def criar_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria um token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verificar_token(token: str):
    """Verifica e decodifica o token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

@router.post("/register", response_model=UserResponse,
             status_code=status.HTTP_201_CREATED,
             summary="Registrar um novo usuário",
             description="Registra um novo usuário no sistema com os dados fornecidos.")
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já registrado.")
    
    senha_hashed = hash_senha(user_data.senha)
    novo_usuario = User(
        nome=user_data.nome,
        email=user_data.email,
        senha_hash=senha_hashed,
        data_nascimento=datetime.fromisoformat(user_data.data_nascimento).date(),
        genero=user_data.genero,
        created_at=datetime.utcnow(),
        is_active=True
    )    
    
    try: 
        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao registrar usuário.")
    
    return UserResponse(
        id=novo_usuario.id,
        nome=novo_usuario.nome,
        email=novo_usuario.email,
        data_nascimento=novo_usuario.data_nascimento.isoformat(),
        genero=novo_usuario.genero,
        created_at=novo_usuario.created_at.isoformat()
    )

@router.post("/login", response_model=LoginResponse,
             summary="Fazer login",
             description="Autentica o usuário e retorna um token JWT.")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Login do usuário:
    - **email**: Email cadastrado
    - **senha**: Senha do usuário

    Retorna um token JWT válido por 7 dias
    """
    # Buscar usuário por email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos."
        )

    # Verificar senha
    if not verificar_senha(credentials.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos."
        )

    # Verificar se usuário está ativo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário inativo. Entre em contato com o suporte."
        )

    # Criar token JWT
    access_token = criar_access_token(
        data={"sub": user.email, "user_id": user.id}
    )

    # Retornar token e dados do usuário
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            nome=user.nome,
            email=user.email,
            data_nascimento=user.data_nascimento.isoformat(),
            genero=user.genero,
            created_at=user.created_at.isoformat()
        )
    )

@router.get("/me", response_model=UserResponse,
            summary="Obter usuário logado",
            description="Retorna os dados do usuário autenticado.")
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Retorna os dados do usuário atualmente logado.
    Requer token JWT válido no header Authorization.
    """
    # Verificar token
    payload = verificar_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Buscar usuário
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado."
        )

    return UserResponse(
        id=user.id,
        nome=user.nome,
        email=user.email,
        data_nascimento=user.data_nascimento.isoformat(),
        genero=user.genero,
        created_at=user.created_at.isoformat()
    )