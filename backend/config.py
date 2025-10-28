"""
Configurações da aplicação Conecat.

Este módulo contém todas as configurações necessárias para o funcionamento
da aplicação, incluindo configurações de autenticação e banco de dados.
"""

import os
from datetime import timedelta

# Configurações JWT
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "sua-chave-secreta-super-segura-mude-em-producao"
)
"""str: Chave secreta para assinatura de tokens JWT. MUDE EM PRODUÇÃO!"""

ALGORITHM = "HS256"
"""str: Algoritmo de criptografia para tokens JWT."""

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias
"""int: Tempo de expiração dos tokens JWT em minutos (padrão: 7 dias)."""

# Configurações do banco de dados
DATABASE_URL = "sqlite:///./conecat.db"
"""str: URL de conexão com o banco de dados."""
