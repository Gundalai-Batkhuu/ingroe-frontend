from ..core import APIEndPoint
from fastapi import UploadFile
from app.dependencies.internal import CaptureDocument
from app.dependencies.internal import (StoreAssets, DeleteAssets)
from app.model.pydantic_model.payload import DocumentSource
from typing import List

class Capture(APIEndPoint):
    @classmethod
    async def capture_document(cls, file: UploadFile, user_id: str, document_id: str, document_update: bool, captured_document_id: str, file_id: str):
        # file_map = await CaptureDocument.capture_document(file, user_id, document_id)
        file_map = {"file_url":"www.xyz.com", "file_name":"new.txt"}
        source_payload = DocumentSource()
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, source_payload=source_payload)
        if document_update:
            # further check if there is a capture
            storer.store_captured_document(captured_document_id=captured_document_id, file_id=file_id, file_map=file_map)
        else:
            storer.store(isUpdate=False)
            storer.store_captured_document(captured_document_id=captured_document_id, file_id=file_id, file_map=file_map)
        return file_map 

    @classmethod
    async def update_document(cls, file: UploadFile, user_id: str, document_id: str):
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
               