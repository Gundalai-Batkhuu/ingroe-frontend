from fastapi import APIRouter, File, UploadFile
from typing import Dict
from app.model.pydantic_model.data_model import (SearchQuery, CreateDocument, QueryDocument)
from app.controller.doc_action import (Search, Create, Query, Store)

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
    documents = await Create.create_document(payload)
    parent_id = payload.document_id
    parent_label = "Owner"
    parent_node = {"label": parent_label, "id": parent_id}
    Store.store_document(documents, parent_node)
    return payload

@router.post("/create-document-from-file")
async def create_document_from_file(file: UploadFile, user_id: str = File(...)):
    await Create.create_document_from_file(file, user_id)
    return file.filename

@router.post("/query-document")
async def query_document(payload: QueryDocument):
    response = await Query.query_document(payload.query, payload.document_id)
    return response