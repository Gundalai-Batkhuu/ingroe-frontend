from sqlalchemy.orm import Session
from app.model.db import SharedDocument
from typing import List, Dict, Optional
from datetime import datetime
from app.const import ErrorCode

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

    @classmethod
    def increase_validity(cls, db: Session, document_id: str, updated_validity: datetime) -> Dict[int,str]:
            """Increase the validity of the existing shared document.

            Args:
            db (Session): The database session object.
            document_id (str): The id of the document that is already being shared.
            updated_validity (datetime): The new validity of the document.

            Returns:
            Dict[int,str]: A dictionary containing the status code and the message.
            """
            document = db.query(SharedDocument).filter(SharedDocument.document_id == document_id).first()
            if updated_validity <= document.validity:
                 return {"status_code": ErrorCode.BADREQUEST, "msg": "New validity must be greater than the existing validity."}
            document.validity = updated_validity
            db.commit()
            db.refresh(document)
            return {"status_code": ErrorCode.NOERROR, "msg": "Validity has increased."}