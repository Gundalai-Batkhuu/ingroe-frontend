from ..core import APIEndPoint
from app.model.pydantic_model import CreateDocument
from app.dependencies.internal import (GetDocument, StoreDocument, StoreAssets)
from fastapi import UploadFile
from langchain_core.documents import Document
from typing import Sequence, List, Tuple
from app.const import ReturnCode
from app.model.pydantic_model.payload import DocumentSource
from app.temp_test.graph import get_doc

class Create(APIEndPoint):
    # @classmethod
    # async def create_document_from_link(cls, document_payload: CreateDocument) -> Sequence[Document]:
    #     page_link = document_payload.link
    #     documents = await GetDocument.get_document_from_link([page_link])
    #     # print(documents)
    #     return documents

    @classmethod
    async def create_document_from_links(cls, page_links: List[str]) -> Sequence[Document]:
        documents = await GetDocument.get_document_from_links(page_links)
        # print(documents)
        return documents

    @classmethod
    async def create_document_from_file(cls, file: UploadFile, user_id: str, document_id: str) -> List[Document]:
        documents, file_map = await GetDocument.get_document_from_file(file, user_id, document_id)
        # print(documents)    
        return documents, file_map
    
    @classmethod
    async def create_documents_from_selection(cls, links: List[str], user_id: str) -> Tuple[Sequence[Document], DocumentSource]:
        vanilla_link = []
        unallowed_downloadable_links = []
        error_link = []
        file_link = []
        documents = []
        for link in links:
            response = GetDocument.handle_link(link, user_id)
            if isinstance(response, int):
                if response == ReturnCode.VANILLA_LINK:
                    vanilla_link.append(link)
                if response == ReturnCode.UNSUPPORTED_FILE:
                    unallowed_downloadable_links.append(link)
                if response == ReturnCode.ERROR:
                    error_link.append(link)   
            else:
                print("pdf files")
                documents += response
                file_link.append(link)
        print(vanilla_link)
        # documents_from_link = await cls.create_document_from_links(vanilla_link)
        documents_from_link = []
        # documents_from_link, source = get_doc()
        documents += documents_from_link
        source = DocumentSource(vanilla_links=vanilla_link, file_links=file_link, error_links=error_link, unsupported_file_links=unallowed_downloadable_links)
        return documents, source

def document_exists(document_id: str, user_id) -> bool:
    """A wrapper for node checker function.

    Args:
    document_id (str): The id of the document node or parent of the documents.

    Returns:
    bool: True or False depending on the node existence in the graph for an id.
    """
    return StoreDocument.check_if_node_exists_for_id(document_id, user_id)