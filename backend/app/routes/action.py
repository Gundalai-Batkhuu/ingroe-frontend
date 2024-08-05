from fastapi import APIRouter
from typing import Dict
from app.model.pydantic_model.data_model import (SearchQuery, CreateDocument)
from app.controller.doc_action.search import Search
from app.controller.doc_action.create_document import Create

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def index() -> Dict[str,str]:
    return {"name": "hello"}

@router.post("/search-query")
async def search(payload: SearchQuery):
    results = await Search.search_documents(payload)
    return results

@router.post("/create-document")
async def create_document(payload: CreateDocument):
    Create.create_document(payload)
    return payload