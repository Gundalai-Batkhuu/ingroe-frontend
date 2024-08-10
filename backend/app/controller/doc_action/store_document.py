from ..core import APIEndPoint
from typing import List, Sequence
from langchain_core.documents import Document
from app.dependencies.internal import StoreDocument
from typing import Dict

class Store(APIEndPoint):
    @classmethod
    def store_document(cls, documents: Sequence[Document], parent_node: Dict[str, str]):
        StoreDocument.store_documents_in_graph_db(documents, parent_node)
