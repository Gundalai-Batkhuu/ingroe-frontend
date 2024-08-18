from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Optional, List
from app.model.pydantic_model import (SearchQuery, CreateDocument, QueryDocument)
from app.controller.doc_action import (Search, Create, Query, Store, document_exists)
from pydantic import Field
from uuid import uuid4
from app.const import GraphLabel
from app.model.pydantic_model.payload import DocumentSource
from app.dependencies.internal import StoreAssets

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
#     documents = await Create.create_document_from_links(payload)
#     parent_id = payload.document_id
#     parent_label = "Owner"
#     parent_node = {"label": parent_label, "id": parent_id}
#     Store.store_document(documents, parent_node)
#     return payload

@router.post("/create-document-selection")
async def create_document_selection(payload: CreateDocument):
    print(payload.document_id)
    documents, source = await Create.create_documents_from_selection(payload.links, payload.user_id)
    print("received documents")
    # print(len(documents[:10]))
    # return documents
    parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": payload.document_id}
    print(parent_node)
    # Store.store_document(documents, parent_node, payload.user_id)
    storer = StoreAssets(user_id=payload.user_id, document_root_id=payload.document_id, source_payload=source)
    storer.store()
    return JSONResponse(
        status_code=200,
        content={
            "message": "Documents from provided sources stored successfully!!", 
            "unsupported_file_links": source.unsupported_file_links,
            "error_links": source.error_links
            }
    )

@router.post("/create-document-manually")
async def create_document_manually(link: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), user_id: str = Form(...), document_id: Optional[str] = Form(None)):
    print(file)
    if link is None and file is None:
        raise HTTPException(status_code=400, detail="You must provide either a link or file.")
    if document_id is not None:
        pass
        # if not document_exists(document_id, user_id):
        #     raise HTTPException(status_code=400, detail="The supplied document id does not exist. Please provide the right id or leave blank.")
    else:
        document_id = uuid4().hex  
    parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": document_id}
    if file is not None and link is not None:
        # document = "both"
        # print(document)
        # document_from_file = get_doc_from_file()
        # document_from_link, source = get_doc()
        # combined_documents = document_from_file + document_from_link
        # print(combined_documents)
        documents_from_file, file_map = await Create.create_document_from_file(file, user_id, document_id) # we need to get file path from this function
        # # documents_from_link = await Create.create_document_from_links([link])
        documents_from_link, source = await Create.create_documents_from_selection([link], user_id)
        source.files = [file_map]
        combined_documents = documents_from_file + documents_from_link
        Store.store_document(combined_documents, parent_node, user_id)
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, source_payload=source)
        storer.store()
        return JSONResponse(
        status_code=200,
        content={"message": "Documents from provided sources stored successfully!!"}
    )
    if file: 
        print("from file")
        # documents = get_doc_from_file()
        documents, file_map = await Create.create_document_from_file(file, user_id, document_id) 
        source = _get_source_payload_from_file_map(file_map)
        print("source done")
    else: 
        print("from link")
        # documents, source = get_doc()
        # documents = await Create.create_document_from_links([link])
        documents, source = await Create.create_documents_from_selection([link], user_id)
    # Store.store_document(documents, parent_node, user_id)  
    storer = StoreAssets(user_id=user_id, document_root_id=document_id, source_payload=source)
    storer.store() 
    return JSONResponse(
        status_code=200,
        content={"message": "Documents from provided sources stored successfully!!"}
    )

def _get_source_payload_from_file_map(file_map: Dict[str,str]) -> DocumentSource:
    """Provides a source payload from the file map.

    Args:
    file_map (Dict[str, str]): A dictionary containing a file url and file name.

    Returns: 
    DocumentSource: A DocumentSource object containing the files attribute that stores the file_map.
    """
    source_payload = DocumentSource()
    source_payload.files = [file_map]
    return source_payload

# @router.post("/create-document-from-file")
# async def create_document_from_file(file: UploadFile, user_id: str = File(...)):
#     await Create.create_document_from_file(file, user_id)
#     return file.filename

@router.post("/query-document")
async def query_document(payload: QueryDocument):
    response = await Query.query_document(payload.query, payload.document_id)
    return response

@router.post("/query-document-quick")
async def query_document_quick(payload: QueryDocument):
    response = await Query.query_document_quick(payload.query, payload.document_id)
    return response

# for passing the links and files as a list, we need change the types of the function first
# and then for links, we use await Create.create_document_from_links(links) and
# for file we loop over each file, create a document and after the document is created,
# we append to the previous one and finally store the document. 