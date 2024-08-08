from fastapi import APIRouter
from typing import Dict
from ..model.pydantic_model.data_model import SearchQuery
from ..controller.doc_action.search import Search

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def index() -> Dict[str,str]:
    return {"name": "hello"}

@router.post("/search-document")
async def search(query_object: SearchQuery):
    results = await Search.search_documents(query_object)
    # return query_object
    return results