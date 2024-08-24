from sqlalchemy.orm import Session
from app.model.db import (User, Document, CapturedDocument, CapturedFile, SharedDocument, SharedDocumentAccessor)
from sqlalchemy.orm import joinedload
from typing import List, Any
from datetime import datetime
from app.utils import get_secret_token
from app.const import ErrorCode

class CentralCRUD:
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
    
    @classmethod
    def share_document(
        cls,
        db:Session, 
        document_id: str, 
        user_id: str, 
        is_shared:bool,
        share_id: str,
        open_to_all: bool,
        accessor_validity: datetime | None,
        validity: datetime | None = None,
        accessor_emails : List[str] | None = None) -> None:
        """Updates the is_shared attribute to received argument to indicate if it is shared
        or not.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document to be shared. This document is same as 
        the document root of the node in the Neo4j Database.
        user_id (str): Id of the user sharing the file.
        is_shared (bool): Boolean value to indicate if the document is in the sharing state.
        share_id (str): The id to distinguish the shared document.
        open_to_all (bool): Indicates whether the document is publicly shared or selectively shared.
        accessor_validity (datetime): The validity period for different users or email accounts. It is different from the global validity above. This accessor validity is less than or equal to the global validity.
        validity (datetime | None): Validity of the shared document.
        accessor_emails (List[str] | None): The list of emails to which the email is shared. 
        """
        document = db.query(Document).filter(Document.document_id == document_id).first()
        if document.user_id != user_id:
            return ErrorCode.UNAUTHORIZED
        document.is_shared = is_shared

        shared_document = SharedDocument(share_id=share_id, document_id=document_id, open_to_all=open_to_all, validity=validity)
        db.add(shared_document)

        if accessor_emails is not None:
            for email in accessor_emails:
                verification_token = get_secret_token(40)
                document_accessor =  SharedDocumentAccessor(email=email, share_id=share_id, verification_token=verification_token, validity=accessor_validity)
                db.add(document_accessor)

        db.commit()
        db.refresh(document)
        return ErrorCode.NOERROR

    @classmethod
    def accept_shared_document(
            cls,
            db: Session,
            email: str,
            share_id: str,
            user_id: str,
            verification_token: str,
            accept_time: datetime) -> int | datetime:
            """It verifies the token and accept the shared document.

            Args:
            db (Session): The database session object.
            email (str): The email of the accessor.
            user_id (str): Id of the user getting access to the file.
            is_shared (bool): Boolean value to indicate if the document is in the sharing state.
            share_id (str): The id to distinguish the shared document.
            verification_token (str): A long string used for verifying the user before giving access to the document or before being accepted.
            accept_time (datetime): The time when the user accepted the shared document.

            Returns:
            int | datetime: An integer representing the error code if there is an error. Otherwise, the 
            period or date of validity.
            """
            record = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.email == email).first()
            if record.validity < accept_time:
                return ErrorCode.FORBIDDEN
            if record.verification_token != verification_token or record.share_id != share_id:
                return ErrorCode.UNAUTHORIZED
            record.user_id = user_id
            record.verified = True
            db.commit()
            db.refresh(record)
            return record.validity

