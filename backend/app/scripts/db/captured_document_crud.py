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
        document = CapturedDocument(document_id=document_id, files=files, query_ready=False)
        db.add(document)
        db.commit()
        db.refresh(document)