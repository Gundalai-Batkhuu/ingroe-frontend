from ..core import APIEndPoint
from app.model.pydantic_model.data_model import CreateDocument

class Create(APIEndPoint):
    @classmethod
    def create_document(cls, document_payload: CreateDocument):
        print(document_payload)
