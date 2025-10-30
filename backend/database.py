"""
Configuração do banco de dados e modelos SQLAlchemy.

Este módulo contém a configuração da conexão com o banco de dados
e os modelos ORM para as tabelas.
"""

from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# URL de conexão com o banco de dados SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./conecat.db"

# Engine do SQLAlchemy com configuração específica para SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necessário para SQLite com FastAPI
)

# Factory de sessões do banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base para os modelos ORM
Base = declarative_base()


class User(Base):
    """
    Modelo de usuário do sistema.

    Attributes:
        id (int): Identificador único do usuário
        nome (str): Nome completo do usuário
        email (str): Email único do usuário (usado para login)
        senha_hash (str): Hash bcrypt da senha
        data_nascimento (date): Data de nascimento do usuário
        genero (str): Gênero do usuário (masc, fem, nb, outro)
        created_at (datetime): Data e hora de criação da conta
        is_active (bool): Indica se o usuário está ativo
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    genero = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


# Criar todas as tabelas no banco de dados
Base.metadata.create_all(bind=engine)


def get_db():
    """
    Dependency para obter sessão do banco de dados.

    Cria uma nova sessão do banco de dados para cada requisição
    e garante que ela seja fechada após o uso.

    Yields:
        Session: Sessão do SQLAlchemy

    Example:
        ```python
        @router.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
        ```
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()