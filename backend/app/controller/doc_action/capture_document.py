from ..core import APIEndPoint
from fastapi import UploadFile
from app.dependencies.internal import CaptureDocument

class Capture(APIEndPoint):
    @classmethod
    async def capture_document(cls, file: UploadFile, user_id: str, document_id: str):
        await CaptureDocument.capture_document(file, user_id, document_id)