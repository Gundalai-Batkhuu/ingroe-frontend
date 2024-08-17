from typing import List
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import DocumentCRUD
from sqlalchemy.orm import Session
from app.database import get_session
from fastapi import Depends

class StoreAssets:
    def __init__(
            self,
            user_id: str,
            document_root_id: str, 
            source_payload: DocumentSource
            ):
        self.user_id = user_id
        self.document_root_id = document_root_id
        self.vanilla_links = source_payload.vanilla_links
        self.error_links = source_payload.error_links
        self.file_links = source_payload.file_links 
        self.unsuppported_file_links = source_payload.unsupported_file_links
        self.files = source_payload.files

    def store(self):
        db = get_session()
        # store the source in the database.    
        DocumentCRUD.create_document(
            db=db, 
            document_id=self.document_root_id,
            user_id=self.user_id,
            vanilla_links=self.vanilla_links,
            file_links=self.file_links,
            unsupported_file_links=self.unsuppported_file_links,
            files=self.files
        )
        pass
  