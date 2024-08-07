from fastapi import APIRouter, File, UploadFile
from typing import Dict
from app.model.pydantic_model.data_model import (SearchQuery, CreateDocument)
from app.controller.doc_action import Search
from app.controller.doc_action import Create

router = APIRouter(
    prefix="/store",
    tags=["store"],
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
    await Create.create_document(payload)
    return payload

@router.post("/create-document-from-file")
async def create_document_from_file(file: UploadFile, user_id: str = File(...)):
    await Create.create_document_from_file(file, user_id)
    return file.filename