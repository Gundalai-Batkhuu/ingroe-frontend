from ..core import APIEndPoint
from fastapi import UploadFile
from app.dependencies.internal import CaptureDocument
from app.dependencies.internal import StoreAssets
from app.model.pydantic_model.payload import DocumentSource

class Capture(APIEndPoint):
    @classmethod
    async def capture_document(cls, file: UploadFile, user_id: str, document_id: str, document_exists: bool):
        file_map = await CaptureDocument.capture_document(file, user_id, document_id)
        source_payload = DocumentSource()
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, source_payload=source_payload)
        if document_exists:
            storer.store_captured_document(files=[file_map])
        else:
            storer.store(isUpdate=False)
            storer.store_captured_document(files=[file_map])
               