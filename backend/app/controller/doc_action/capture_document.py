from ..core import APIEndPoint
from fastapi import UploadFile
from app.dependencies.internal import CaptureDocument
from app.dependencies.internal import (StoreAssets, DeleteAssets)
from app.model.pydantic_model.payload import DocumentSource
from typing import List
from sqlalchemy.orm import Session
from app.exceptions import (DocumentCaptureError, DocumentStorageError)

class Capture(APIEndPoint):
    @classmethod
    async def capture_document(cls, file: UploadFile, user_id: str, document_id: str, document_update: bool, captured_document_id: str, file_id: str, document_alias: str, description: str, db: Session):
        try:
            file_map = await CaptureDocument.capture_document(file, user_id, document_id)
            # file_map = {"file_url":"www.xyz.com", "file_name":"new.txt"}
            source_payload = DocumentSource()
            storer = StoreAssets(user_id=user_id, document_root_id=document_id, source_payload=source_payload, document_alias=document_alias, description=description, db=db)
            if document_update:
                # further check if there is a capture
                storer.store_captured_document(captured_document_id=captured_document_id, file_id=file_id, file_map=file_map, db=db)
            else:
                storer.store(isUpdate=False)
                storer.store_captured_document(captured_document_id=captured_document_id, file_id=file_id, file_map=file_map, db=db)
            return file_map 
        except Exception:
            raise

    @classmethod
    async def update_document(cls, file: UploadFile, user_id: str, document_id: str, file_id: str):
        # file_map = await CaptureDocument.update_document(file, user_id, document_id)
        file_map = {"file_url":"www.xyz.com", "file_name":"new.txt"}
        return file_map
    
    @classmethod
    async def delete_captured_file(cls, captured_document_id: str, file_ids: List[str]):
        for file_id in file_ids:
            DeleteAssets.delete_captured_file(file_id, captured_document_id)

    @classmethod
    async def delete_captured_document(cls, document_id: str, captured_document_id: str):
        print("deleting")  
        DeleteAssets.delete_captured_document(document_id, captured_document_id)      
               
def file_exists(file_id: str, captured_document_id: str, file_name: str, db: Session) -> bool:
    """Checks if the file exists or not in the database for a particular file name.

    Args:
    file_id (str): The id of the captured file.
    captured_document_id (str): The id of the captured document in the captured document table.
    file_name (str): The name of the file.
    db (Session): The database session object.

    Returns:
    bool: True or False depending on the node existence in the graph for an id.
    """
    from app.scripts.db import CapturedFileCRUD

    status = CapturedFileCRUD.file_exists_for_a_name(db, file_id, captured_document_id, file_name)  
    return status            