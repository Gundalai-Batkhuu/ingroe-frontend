from ..core import APIEndPoint
from app.dependencies.internal import QueryDocument

class Query(APIEndPoint):

    @classmethod
    async def query_document(cls, query: str, document_id: str) -> str:
        response = QueryDocument.query_document(query, parent_id=document_id)
        return response
