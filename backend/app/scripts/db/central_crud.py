from sqlalchemy.orm import Session
from app.model.db import (User, Document, CapturedDocument, CapturedFile)
from sqlalchemy.orm import joinedload

class CentralCrud:
    @classmethod
    def get_all_artifacts_for_user(cls, db: Session, user_id: str) -> None:
        result = db.query(User).options(
        joinedload(User.document).joinedload(
            Document.captured_document
        ).joinedload(
            CapturedDocument.captured_file
        )
        ).filter(User.user_id == user_id).all()

        user_artifacts = {}
        documents = []
        captured_files = []

        for record in result:
            user_artifacts["user_id"] = record.user_id
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
                        # print(captured_file_record.file_url, captured_file_record.file_name)
                    cap_key = {
                        "doc_id": captured_record.document_id,
                        "captured_document_id": captured_record.captured_document_id,
                        "query_ready": captured_record.query_ready,
                        "captured_files": captured_files
                    }
                    captured_documents.append(cap_key)
                # print(document_record.document_id)    
                # print(captured_documents)
                doc_key = {
                    "document_id": document_record.document_id,
                    "document_name": document_record.document_alias,
                    "vanilla_links": document_record.vanilla_links,
                    "file_links": document_record.file_links,
                    "files": document_record.files,
                    "description": document_record.description,
                    "captured_documents": captured_documents
                    }
                # print(doc_key)
                documents.append(doc_key)
                print("\n")    
        print(user_artifacts)   
        # print(documents[0]) 
        # print("\n")
        # print(documents[1])
        # print("\n")
        # print(documents[2])