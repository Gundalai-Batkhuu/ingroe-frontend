from sqlalchemy.orm import Session
from app.model.db import (User, Document, CapturedDocument, CapturedFile)
from sqlalchemy.orm import joinedload
from typing import List, Any

class CentralCrud:
    """Class that contains methods that operates on all or some of the models.
    """
    @classmethod
    def get_all_artifacts_for_user(cls, db: Session, user_id: str) -> List[dict]:
        """Returns the document hierarchy or structure for a user id. Based on the user id,
        a dictionary of artifacts or a nested dictionary of artifacts are returned.

        Args:
        db (Session): The database session object.
        user_id (str): Id of the user accessing the artefacts.

        Returns:
        List[dict]: A list of dictionary containing artifacts.
        """
        result = db.query(User).options(
        joinedload(User.document).joinedload(
            Document.captured_document
        ).joinedload(
            CapturedDocument.captured_file
        )
        ).filter(User.user_id == user_id).all()

        for record in result:
            documents = []
            for document_record in record.document:
                captured_documents = []
                for captured_record in document_record.captured_document:
                    captured_files = []
                    for captured_file_record in captured_record.captured_file:
                        cap_file_key = {
                            "file_url": captured_file_record.file_url,
                            "file_name": captured_file_record.file_name
                        }
                        captured_files.append(cap_file_key)
                    cap_key = {
                        "doc_id": captured_record.document_id,
                        "captured_document_id": captured_record.captured_document_id,
                        "query_ready": captured_record.query_ready,
                        "captured_files": captured_files
                    }
                    captured_documents.append(cap_key)
                doc_key = {
                    "document_id": document_record.document_id,
                    "document_name": document_record.document_alias,
                    "vanilla_links": document_record.vanilla_links,
                    "file_links": document_record.file_links,
                    "files": document_record.files,
                    "description": document_record.description,
                    "captured_documents": captured_documents
                    }
                documents.append(doc_key)     
        return documents