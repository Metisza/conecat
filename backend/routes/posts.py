from fastapi import APIRouter

router = APIRouter()

# TODO: implementar feed de posts (timeline)
# TODO: implementar criação de post
# TODO: implementar edição de post
# TODO: implementar exclusão de post
# TODO: implementar curtir post
# TODO: implementar visualização de post

@router.get("/")
async def list_posts():
    """Listar posts - A implementar"""
    return {"message": "Endpoint de posts - em desenvolvimento"}
