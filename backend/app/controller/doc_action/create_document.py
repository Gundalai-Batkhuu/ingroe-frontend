from ..core import APIEndPoint
from app.model.pydantic_model.data_model import CreateDocument
from app.dependencies.internal.create_documents import GetDocument

class Create(APIEndPoint):
    @classmethod
    async def create_document(cls, document_payload: CreateDocument):
        page_link = document_payload.link
        documents = await GetDocument.get_document_from_link([page_link])
        print(documents)
