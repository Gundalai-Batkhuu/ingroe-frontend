from sqlalchemy.orm import Session
from app.model.db import CapturedDocument
from typing import List, Dict

class CapturedDocumentCRUD:
    @classmethod
    def create_record(
        cls,
        db: Session, 
        document_id: str, 
        files: List[Dict[str, str]]
    ) -> None:
        """Creates a record in the captured document table with the relevant fields.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document root in the neo4j database.
        files (Optional[List[Dict[str, str]]]): A list of dictionary containing the file url and the name.
        """
        document = CapturedDocument(document_id=document_id, files=files, query_ready=False)
        db.add(document)
        db.commit()
        db.refresh(document)