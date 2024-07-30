from fastapi import APIRouter
from typing import Dict
from ..model.pydantic_model.data_model import SearchQuery

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def index() -> Dict[str,str]:
    return {"name": "hello"}

@router.post("/search-document")
async def search(query: SearchQuery):
    return query