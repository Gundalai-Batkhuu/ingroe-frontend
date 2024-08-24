from sqlalchemy.orm import Session
from app.model.db import SharedDocument
from typing import List, Dict, Optional
from datetime import datetime

class SharedDocumentCRUD:
    """Class that contains method to interact with the shared document model or shared document table.
    """
    @classmethod
    def create_document(
        cls, 
        db: Session,
        share_id: str, 
        document_id: str, 
        open_to_all: bool,
        validity: datetime | None = None) -> None:
        """Creates a record in the document table with the relevant fields.

        Args:
        db (Session): The database session object.
        share_id (str): The id to distinguish the shared document.
        document_id (str): The id of the document to be shared. This document is same as 
        the document root of the node in the Neo4j Database.
        open_to_all (bool): Indicates whether the document is publicly shared or selectively shared.
        validity (datetime | None): Validity of the shared document.
        """
        document = SharedDocument(share_id=share_id, document_id=document_id, open_to_all=open_to_all, validity=validity)
        db.add(document)
        db.commit()
        db.refresh(document)