from fastapi import APIRouter

router = APIRouter()

# TODO: implementar perfil do usuário logado
# TODO: implementar edição do perfil do usuário
# TODO: implementar listagem de usuários
# TODO: implementar visualização de perfil público do usuário

@router.get("/")
async def list_users():
    """Listar usuários - A implementar"""
    return {"message": "Endpoint de usuários - em desenvolvimento"}
