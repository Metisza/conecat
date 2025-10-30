"""
Schemas Pydantic para validação de dados.

Este módulo contém todos os modelos de dados (schemas) usados
para validação de requisições e respostas da API.
"""

from pydantic import BaseModel, EmailStr, Field, validator
from datetime import date
from typing import Optional


class UserRegister(BaseModel):
    """
    Schema para registro de novo usuário.

    Attributes:
        nome (str): Nome completo do usuário
        email (EmailStr): Email válido do usuário
        senha (str): Senha do usuário (mínimo 8 caracteres)
        confirm_senha (str): Confirmação da senha
        data_nascimento (str): Data de nascimento no formato ISO (YYYY-MM-DD)
        genero (str): Gênero (fem, masc, nb, outro)

    Validators:
        senhas_devem_ser_iguais: Valida se senha e confirm_senha são iguais
        validar_idade_minima: Valida se usuário tem pelo menos 13 anos
    """
    nome: str
    email: EmailStr
    senha: str
    confirm_senha: str
    data_nascimento: str
    genero: str

    @validator('confirm_senha')
    def senhas_devem_ser_iguais(cls, v, values):
        """
        Valida se a senha e confirmação são iguais.

        Args:
            v: Valor da confirmação de senha
            values: Dicionário com valores já validados

        Returns:
            str: O valor validado

        Raises:
            ValueError: Se as senhas não conferem
        """
        if 'senha' in values and v != values['senha']:
            raise ValueError('As senhas devem ser iguais.')
        return v

    @validator('data_nascimento')
    def validar_idade_minima(cls, v):
        """
        Valida se o usuário tem pelo menos 13 anos.

        Args:
            v: Data de nascimento no formato ISO string

        Returns:
            str: A data validada

        Raises:
            ValueError: Se usuário tem menos de 13 anos
        """
        nascimento = date.fromisoformat(v)
        hoje = date.today()
        idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
        if idade < 13:
            raise ValueError('Você deve ter pelo menos 13 anos para se registrar.')
        return v


class UserResponse(BaseModel):
    """
    Schema para resposta de dados do usuário (sem senha).

    Usado para retornar dados do usuário em respostas da API,
    excluindo informações sensíveis como senha.

    Attributes:
        id (int): ID único do usuário
        nome (str): Nome completo
        email (EmailStr): Email do usuário
        data_nascimento (str): Data de nascimento (ISO format)
        genero (str): Gênero do usuário
        created_at (str): Data de criação da conta (ISO format)
    """
    id: int
    nome: str
    email: EmailStr
    data_nascimento: str
    genero: str
    created_at: str

    class Config:
        from_attributes = True


class UserInDB(BaseModel):
    """
    Schema para usuário armazenado no banco de dados.

    Contém todos os campos do usuário, incluindo senha hash.
    Usado internamente, nunca retornado diretamente pela API.

    Attributes:
        id (int): ID único do usuário
        nome (str): Nome completo
        email (str): Email do usuário
        senha_hash (str): Hash bcrypt da senha
        data_nascimento (str): Data de nascimento
        genero (str): Gênero do usuário
        created_at (str): Data de criação da conta
        is_active (bool): Se o usuário está ativo
    """
    id: int
    nome: str
    email: str
    senha_hash: str
    data_nascimento: str
    genero: str
    created_at: str
    is_active: bool = True
