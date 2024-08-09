from ..core import APIEndPoint
from app.dependencies.internal import QueryDocument

class Query(APIEndPoint):

    @classmethod
    async def query_document(cls, query: str):
        QueryDocument.query_document("hello")
