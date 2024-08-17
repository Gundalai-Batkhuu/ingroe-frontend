from sqlalchemy.orm import Session
from app.model.db import Document
from typing import List, Dict, Optional

class DocumentCRUD:
    """Class that contains method to interact with the document model or document table.
    """
    @classmethod
    def create_document(
        cls, 
        db: Session, 
        document_id: str, 
        user_id: str, 
        vanilla_links: List[str], 
        file_links: List[str], 
        unsupported_file_links: List[str], 
        files: Optional[List[Dict[str, str]]]) -> None:
        """Creates a record in the document table with the relevant fields.
        """
        db_document = Document(document_id=document_id, user_id=user_id, vanilla_links=vanilla_links, file_links=file_links, unsupported_file_links=unsupported_file_links, files=files)
        db.add(db_document)
        db.commit()
        db.refresh(db_document)

        