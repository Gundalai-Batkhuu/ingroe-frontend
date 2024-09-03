from ..core import APIEndPoint
from typing import List, Sequence
from langchain_core.documents import Document
from app.dependencies.internal import StoreDocument
from typing import Dict
from app.exceptions import DocumentStorageError
from loguru import logger

class Store(APIEndPoint):
    @classmethod
    def store_document(cls, documents: Sequence[Document], parent_node: Dict[str, str], user_id: str):
        try:
            StoreDocument.store_documents_in_graph_db(documents, parent_node, user_id)
        except DocumentStorageError:
            raise
        except Exception as e:
            logger.error(e)
            raise DocumentStorageError(message="Error while storing the documents in graph db", name="Graph DB Storage")
