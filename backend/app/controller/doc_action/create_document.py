from ..core import APIEndPoint
from app.model.pydantic_model import CreateDocument
from app.dependencies.internal import (GetDocument, StoreDocument, StoreAssets)
from fastapi import UploadFile
from langchain_core.documents import Document
from typing import Sequence, List, Tuple
from app.const import ReturnCode
from app.model.pydantic_model.payload import DocumentSource
from app.temp_test.graph import get_doc
from app.exceptions import (DocumentCreationError, DocumentStorageError)
from loguru import logger

class Create(APIEndPoint):

    @classmethod
    async def create_document_from_links(cls, page_links: List[str]) -> Sequence[Document]:
        try:
            documents = await GetDocument.get_document_from_links(page_links)
            return documents
        except Exception as e:
            logger.error(e)
            raise DocumentCreationError(message="Error while creating documents from the links", name="Document Creation")

    @classmethod
    async def create_document_from_file(cls, file: UploadFile, user_id: str, document_id: str) -> List[Document]:
        try:
            documents, file_map = await GetDocument.get_document_from_file(file, user_id, document_id)  
            return documents, file_map
        except DocumentStorageError:
            raise
        except Exception as e:
            logger.error(e)
            raise DocumentCreationError(message="Error while creating documents from the files", name="Document Creation")
    
    @classmethod
    async def create_documents_from_selection(cls, links: List[str], user_id: str) -> Tuple[Sequence[Document], DocumentSource]:
        vanilla_link = []
        unallowed_downloadable_links = []
        error_link = []
        file_link = []
        documents = []
        unscrapable_link = []
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
        documents_from_link = await cls.create_document_from_links(vanilla_link)
        if len(documents_from_link) == 0: unscrapable_link.append(link)
        # documents_from_link = []
        # documents_from_link, source = get_doc()
        documents += documents_from_link
        source = DocumentSource(vanilla_links=vanilla_link, file_links=file_link, error_links=error_link, unsupported_file_links=unallowed_downloadable_links, unscrapable_links=unscrapable_link)
        return documents, source  

    @classmethod
    async def create_documents_from_captured_document(cls, links: List[str]):
        print(links)
        documents = []
        for link in links:
            document = GetDocument.create_documents_from_txt_links(link)
            documents += document  
        return documents 
    
    @classmethod
    async def create_documents_from_both_links_and_files(cls, file: UploadFile, links: List[str], user_id: str, document_id: str):
        documents_from_file, file_map = await cls.create_document_from_file(file, user_id, document_id)
        documents_from_link, source = await cls.create_documents_from_selection(links, user_id)
        source.files = [file_map]
        combined_documents = documents_from_file + documents_from_link
        return combined_documents, source

def document_exists(document_id: str, user_id: str) -> bool:
    """Checks if the document exists or not in the database.

    Args:
    document_id (str): The id of the document node or parent of the documents.
    user_id (str): The id of the user.

    Returns:
    bool: True or False depending on the node existence in the graph for an id.
    """
    from app.scripts.db import DocumentCRUD
    from app.database import get_db

    db_generator = get_db()
    db = next(db_generator)
    try:
        status = DocumentCRUD.document_exists_for_user(document_id, user_id, db)
        return status
    finally: 
        db_generator.close()
    # return StoreDocument.check_if_node_exists_for_id(document_id, user_id)