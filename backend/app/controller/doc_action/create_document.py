from ..core import APIEndPoint
from app.model.pydantic_model.data_model import CreateDocument
from app.dependencies.internal import (GetDocument, StoreDocument)
from fastapi import UploadFile
from langchain_core.documents import Document
from typing import Sequence, List

class Create(APIEndPoint):
    # @classmethod
    # async def create_document_from_link(cls, document_payload: CreateDocument) -> Sequence[Document]:
    #     page_link = document_payload.link
    #     documents = await GetDocument.get_document_from_link([page_link])
    #     # print(documents)
    #     return documents

    @classmethod
    async def create_document_from_link(cls, page_links: List[str]) -> Sequence[Document]:
        documents = await GetDocument.get_document_from_link(page_links)
        # print(documents)
        return documents

    @classmethod
    async def create_document_from_file(cls, file: UploadFile, user_id: str):
        documents = await GetDocument.get_document_from_file(file, user_id)
        # print(documents)    
        return documents

def document_exists(document_id: str) -> bool:
    """A wrapper for node checker function.

    Args:
    document_id (str): The id of the document node or parent of the documents.

    Returns:
    bool: True or False depending on the node existence in the graph for an id.
    """
    return StoreDocument.check_if_node_exists_for_id(document_id)