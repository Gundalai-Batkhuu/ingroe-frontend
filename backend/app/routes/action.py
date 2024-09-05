from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Optional, List
from app.model.pydantic_model import (SearchQuery, CreateDocument, QueryDocument, DeleteDocument, DeleteCapturedFile, DeleteCapturedDocument, CreateDocumentCapture, DocumentInfo)
from app.controller.doc_action import (Search, Create, Query, Store, document_exists, Delete, Capture, file_exists)
from pydantic import Field
from uuid import uuid4
from app.const import GraphLabel
from app.model.pydantic_model.payload import DocumentSource
from app.dependencies.internal import (StoreAssets, UpdateAssets)
from app.exceptions import (DocumentDoesNotExistError, SearchResultRetrievalError, DocumentCreationError, DocumentStorageError, DocumentDeletionError, DocumentCaptureError)
from fastapi.encoders import jsonable_encoder
from loguru import logger
from sqlalchemy.orm import Session
from app.database import get_db

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
    try:
        results = await Search.search_documents(payload)
        return JSONResponse(
            status_code=200,
            content=jsonable_encoder({
                "results": results
                })
        )
    except SearchResultRetrievalError:
        raise
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error occurred while fetching search results.")

@router.post("/create-document-selection")
async def create_document_selection(payload: CreateDocument, db: Session = Depends(get_db)):
    try:
        print(payload.document_id)
        documents, source = await Create.create_documents_from_selection(payload.links, payload.user_id)
        print("received documents")
        parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": payload.document_id}
        Store.store_document(documents, parent_node, payload.user_id)
        storer = StoreAssets(user_id=payload.user_id, document_root_id=payload.document_id, document_alias=payload.document_alias, source_payload=source, description=payload.description, db=db)
        storer.store(False)
        return JSONResponse(
            status_code=200,
            content={
                "message": "Documents from provided sources stored successfully!!", 
                "unsupported_file_links": source.unsupported_file_links,
                "error_links": source.error_links,
                "document_id": payload.document_id
                }
        )
    except DocumentCreationError:
        raise
    except DocumentStorageError:
        raise    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while creating the documents.")

@router.post("/create-document-manually")
async def create_document_manually(link: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), user_id: str = Form(...), document_id: Optional[str] = Form(None), document_alias: Optional[str] = Form(""), description: Optional[str] = Form(""), db: Session = Depends(get_db)):
    try:
        update_required = False
        if link is None and file is None:
            raise HTTPException(status_code=400, detail="You must provide either a link or file.")
        if document_id is not None:
            if not document_exists(document_id, user_id, db):
                raise DocumentDoesNotExistError(message=f"The supplied document id {document_id} does not exist", name="Invalid Document Id")
            update_required = True
        else:
            document_id = uuid4().hex  
        parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": document_id}
        if file is not None and link is not None:    
            combined_documents, source = await Create.create_documents_from_both_links_and_files(file, [link], user_id, document_id)
            Store.store_document(combined_documents, parent_node, user_id)
            storer = StoreAssets(user_id=user_id, document_root_id=document_id, document_alias=document_alias, source_payload=source, description=description, db=db)
            storer.store(update_required)
            return JSONResponse(
            status_code=200,
            content={
                "message": "Documents from provided sources stored successfully!!",
                "unsupported_file_links": source.unsupported_file_links,
                "error_links": source.error_links,
                "unscrapable_links": source.unscrapable_links,
                "document_id": document_id
                }
        )
        if file: 
            print("from file")
            documents, file_map = await Create.create_document_from_file(file, user_id, document_id) 
            source = _get_source_payload_from_file_map(file_map)
            print("source done")
        else: 
            print("from link")
            documents, source = await Create.create_documents_from_selection([link], user_id)
        Store.store_document(documents, parent_node, user_id)  
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, document_alias=document_alias, source_payload=source, description=description, db=db)
        storer.store(update_required) 
        return JSONResponse(
            status_code=200,
            content={
                "message": "Documents from provided sources stored successfully!!",
                "unsupported_file_links": source.unsupported_file_links,
                "error_links": source.error_links,
                "unscrapable_links": source.unscrapable_links,
                "document_id": document_id
                }
        )
    except DocumentCreationError:
        raise
    except DocumentStorageError:
        raise
    except DocumentDoesNotExistError:
        raise
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while creating the documents.")

@router.post("/query-document")
async def query_document(payload: QueryDocument):
    response = await Query.query_document(payload.query, payload.document_id)
    return JSONResponse(
        status_code=200,
        content={
            "document_id": payload.document_id,
            "query": payload.query,
            "response": response
            }
    )

@router.post("/query-document-quick")
async def query_document_quick(payload: QueryDocument):
    response = await Query.query_document_quick(payload.query, payload.document_id)
    return JSONResponse(
        status_code=200,
        content={
            "document_id": payload.document_id,
            "query": payload.query,
            "response": response
            }
    )

@router.delete("/delete-document")
async def delete_document(payload: DeleteDocument, db: Session = Depends(get_db)):
    try:
        await Delete.delete_document(payload.document_id, payload.user_id, db)
        return JSONResponse(
            status_code=200,
            content={"message": "Documents from provided sources deleted successfully!!"}
        )
    except DocumentDeletionError:
        raise
    except Exception as e:
        logger.error(e)
        raise DocumentDeletionError(message="Error occurred while deletion!", name="Document deletion")

@router.post("/capture-document")
async def capture_document(file: UploadFile, user_id: str = Form(...), document_id: Optional[str] = Form(None), document_alias: Optional[str] = Form(""), description: Optional[str] = Form(""), db: Session = Depends(get_db)):
    try:
        document_update = False
        if document_id is not None:
            if not document_exists(document_id, user_id, db):
                raise DocumentDoesNotExistError(message=f"The supplied document id {document_id} does not exist", name="Invalid Id")
            document_update = True
        else:
            document_id = uuid4().hex 
        captured_document_id = uuid4().hex   
        file_id = uuid4().hex 
        file_map = await Capture.capture_document(file, user_id, document_id, document_update, captured_document_id, file_id, document_alias, description, db)
        return JSONResponse(
            status_code=200,
            content={
                "message": "Documents from provided sources captured successfully!!", 
                "user_id": user_id,
                "document_id": document_id,
                "captured_document_id": captured_document_id,
                "file_id": file_id,
                "file_map": file_map
                }
        )
    except DocumentDoesNotExistError:
        raise
    except DocumentCaptureError:
        raise
    except DocumentStorageError:
        raise
    except Exception as e:
        logger.error(e)
        raise DocumentCaptureError(message="Error while capturing the document", name="Document Capture")

@router.patch("/update-captured-document")
async def update_capture_document(file: UploadFile, user_id: str = Form(...), document_id: str = Form(...), file_id: str = Form(...), captured_document_id: str = Form(...), db: Session = Depends(get_db)):
    try:
        if not file_exists(file_id, captured_document_id, file.filename, db):
            raise DocumentDoesNotExistError(message=f"The supplied file id {file_id} does not exist", name="Invalid File Id")
        file_map = await Capture.update_document(file, user_id, document_id, file_id)
        return JSONResponse(
            status_code=200,
            content={
                "document_id": document_id,
                "captured_document_id": captured_document_id,
                "file_id": file_id,
                "response": file_map
                }
        )
    except DocumentDoesNotExistError:
        raise
    except DocumentCaptureError:
        raise
    except Exception as e:
        logger.error(e)
        raise DocumentCaptureError(message="Error while updating the captured the document", name="Document Capture")

@router.delete("/delete-captured-file")
async def delete_captured_file(payload: DeleteCapturedFile):
    await Capture.delete_captured_file(payload.captured_document_id, payload.file_ids)
    return JSONResponse(
        status_code=200,
        content={
            "message": "Provided captured file has been deleted successfully!!", 
            }
    )

@router.delete("/delete-captured-document")
async def delete_captured_document(payload: DeleteCapturedDocument):
    await Capture.delete_captured_document(payload.document_id, payload.captured_document_id)
    return JSONResponse(
        status_code=200,
        content={
            "message": "Provided captured document has been deleted successfully!!", 
            }
    )

@router.post("/create-document-from-captured-document")
async def create_document_from_captured_document(payload: CreateDocumentCapture):
    if not document_exists(payload.document_id, payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {document_id} does not exist", name="Invalid Document Id")
    document_id = payload.document_id
    documents = await Create.create_documents_from_captured_document(links=payload.links) 
    parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": document_id}
    Store.store_document(documents, parent_node, payload.user_id)  
    return JSONResponse(
        status_code=200,
        content={
            "message": "Documents from provided sources created successfully!!", 
            "user_id": payload.user_id,
            "document_id": document_id
            }
    )

@router.patch("/update-document-info")
async def update_document_info(payload: DocumentInfo):
    if not document_exists(payload.document_id, payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    UpdateAssets.update_document_info(payload.document_id, payload.document_alias, payload.description)
    return JSONResponse(
        status_code=200,
        content={
            "message": "Documents info updated successfully!!", 
            "user_id": payload.user_id,
            "document_id": payload.document_id
            }
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

# for passing the links and files as a list, we need change the types of the function first
# and then for links, we use await Create.create_document_from_links(links) and
# for file we loop over each file, create a document and after the document is created,
# we append to the previous one and finally store the document. 