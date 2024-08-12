from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Optional, List
from app.model.pydantic_model.data_model import (SearchQuery, CreateDocument, QueryDocument)
from app.controller.doc_action import (Search, Create, Query, Store, document_exists)
from pydantic import Field
from uuid import uuid4
from app.const import GraphLabel

from app.temp_test.graph import get_doc, get_doc_from_file

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

# @router.post("/create-document")
# async def create_document(payload: CreateDocument):
#     documents = await Create.create_document_from_link(payload)
#     parent_id = payload.document_id
#     parent_label = "Owner"
#     parent_node = {"label": parent_label, "id": parent_id}
#     Store.store_document(documents, parent_node)
#     return payload

@router.post("/create-document-manually")
async def create_document(link: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), user_id: str = Form(...), document_id: Optional[str] = Form(None)):
    if link is None and file is None:
        raise HTTPException(status_code=400, detail="You must provide either a link or file.")
    if document_id is not None:
        if not document_exists(document_id):
            raise HTTPException(status_code=400, detail="The supplied document id does not exist. Please provide the right id or leave blank.")
    else:
        document_id = uuid4().hex  
    parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": document_id}
    if file is not None and link is not None:
        # document = "both"
        # print(document)
        document_from_file = get_doc()
        document_from_link = get_doc_from_file()
        combined_documents = document_from_file + document_from_link
        # print(combined_documents)
        # documents_from_file = await Create.create_document_from_file(file, user_id)
        # documents_from_link = await Create.create_document_from_link([link])
        # combined_documents = documents_from_file + documents_from_link
        Store.store_document(combined_documents, parent_node)
        return link, user_id
    if file: 
        print("from file")
        # documents = "new"
        documents = get_doc_from_file()
        # documents = await Create.create_document_from_file(file, user_id)
    else: 
        print("from link")
        # documents = "old"
        documents = get_doc()
        # documents = await Create.create_document_from_link([link])
    Store.store_document(documents, parent_node)  
    # print(documents)  
    return JSONResponse(
        status_code=200,
        content={"message": "Documents from provided sources stored successfully!!"}
    )

@router.post("/create-document-from-file")
async def create_document_from_file(file: UploadFile, user_id: str = File(...)):
    await Create.create_document_from_file(file, user_id)
    return file.filename

@router.post("/query-document")
async def query_document(payload: QueryDocument):
    response = await Query.query_document(payload.query, payload.document_id)
    return response

# for passing the links and files as a list, we need change the types of the function first
# and then for links, we use await Create.create_document_from_link(links) and
# for file we loop over each file, create a document and after the document is created,
# we append to the previous one and finally store the document. 