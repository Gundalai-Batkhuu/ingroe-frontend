from sqlalchemy.orm import Session
from app.model.db import CapturedDocument
from typing import List, Dict

class CapturedDocumentCRUD:
    @classmethod
    def create_record(
        cls,
        db: Session, 
        captured_document_id: str,
        document_id: str, 
    ) -> None:
        """Creates a record in the captured document table with the relevant fields.

        Args:
        db (Session): The database session object.
        captured_document_id (str): The id of the captured document.
        document_id (str): The id of the document root in the neo4j database.
        files (Optional[List[Dict[str, str]]]): A list of dictionary containing the file url and the name.
        """
        document = CapturedDocument(captured_document_id=captured_document_id, document_id=document_id, query_ready=False)
        db.add(document)
        db.commit()
        db.refresh(document)

    @classmethod
    def delete_record(cls, db: Session, captured_document_id: str, document_id: str) -> None:  
        """Deletes a record from the captured document table based on the captured_document_id.

        Args:
        db (Session): The database session object.
        captured_document_id (str): The id of the captured document.
        document_id (str): The id of the document root in the neo4j database.
        """ 
        document = db.query(CapturedDocument).filter(
            CapturedDocument.captured_document_id == captured_document_id,
            CapturedDocument.document_id == document_id
            ).first()
        db.delete(document)
        db.commit()    