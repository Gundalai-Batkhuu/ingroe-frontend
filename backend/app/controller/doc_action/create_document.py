from ..core import APIEndPoint
from app.model.pydantic_model.data_model import CreateDocument
from app.dependencies.internal import GetDocument
from fastapi import UploadFile

class Create(APIEndPoint):
    @classmethod
    async def create_document(cls, document_payload: CreateDocument):
        page_link = document_payload.link
        documents = await GetDocument.get_document_from_link([page_link])
        print(documents)

    @classmethod
    async def create_document_from_file(cls, file: UploadFile, user_id: str):
        documents = await GetDocument.get_document_from_file(file, user_id)
        print(documents)    
