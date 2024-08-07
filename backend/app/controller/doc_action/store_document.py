from ..core import APIEndPoint
from typing import List, Sequence
from langchain_core.documents import Document
from app.dependencies.internal.store_documents import StoreDocument

class Store(APIEndPoint):
    @classmethod
    def store_document(cls, documents: Sequence[Document]):
        StoreDocument.store_documents_in_graph_db(documents)
