from sqlalchemy.orm import Session
from app.model.db import (User, Document, CapturedDocument, CapturedFile, SharedDocument, SharedDocumentAccessor)
from sqlalchemy.orm import joinedload
from typing import List, Any, Dict, Tuple
from datetime import datetime
from app.utils import get_secret_token
from app.const import ErrorCode
from uuid import uuid4

class CentralCRUD:
    """Class that contains methods that operates on all or some of the models.
    """
    @classmethod
    def get_all_artifacts_for_user(cls, db: Session, user_id: str) -> Tuple[List[dict], List[dict]]:
        """Returns the document hierarchy or structure for a user id. Based on the user id,
        a dictionary of artifacts or a nested dictionary of artifacts are returned. It also 
        provides the list of documents that has been shared. Only the shared documents that has 
        been accepted will be returned. 

        Args:
        db (Session): The database session object.
        user_id (str): Id of the user accessing the artefacts.

        Returns:
        Tuple[List[dict], List[dict]]: A tuple containing a list of dictionary with artifacts and a 
        list of dictionary with shared artifacts.
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

        shared_records = db.query(SharedDocumentAccessor, SharedDocument, Document).join(SharedDocument, SharedDocumentAccessor.share_id == SharedDocument.share_id).join(Document, SharedDocument.document_id == Document.document_id).filter(SharedDocumentAccessor.user_id == user_id).all()
        shared_documents = []
        for record in shared_records:
            _, _, document = record
            shared_key = {
                 "document_alias": document.document_alias,
                 "document_id": document.document_id,
                 "description": document.description
            }
            shared_documents.append(shared_key)

        return documents, shared_documents  
    
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
        user, document = db.query(User, Document).filter(Document.document_id == document_id).join(Document, User.user_id == Document.user_id).first()
        if document.user_id != user_id:
            return ErrorCode.UNAUTHORIZED
        document.is_shared = is_shared

        shared_document = SharedDocument(share_id=share_id, document_id=document_id, open_to_all=open_to_all, validity=validity)
        db.add(shared_document)

        if accessor_emails is not None:
            if user.email in accessor_emails: accessor_emails.remove(user.email)
            for email in accessor_emails:
                verification_token = get_secret_token(40)
                document_accessor = SharedDocumentAccessor(email=email, share_id=share_id, verification_token=verification_token, validity=accessor_validity)
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
            record = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.email == email, SharedDocumentAccessor.share_id == share_id).first()
            if record.validity < accept_time:
                return ErrorCode.FORBIDDEN
            if record.verification_token != verification_token or record.share_id != share_id:
                return ErrorCode.UNAUTHORIZED
            record.user_id = user_id
            record.verified = True
            record.verification_token = ""
            db.commit()
            db.refresh(record)
            return record.validity
    
    @classmethod
    def increase_document_validity_for_user(cls, db: Session, document_id: str, user_email: str, updated_validity: datetime) -> Dict[int,str]:
        """Increases the validity of a shared document for a user.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is already being shared.
        user_email (str): The email id of the user for which the validity has been increased.
        updated_validity (datetime): The new validity of the document.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        # shared_document, document = db.query(SharedDocument, Document).join(Document, SharedDocument.document_id == Document.document_id).filter(Document.document_id == document_id).first()
        # accessor = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.email == user_email, SharedDocumentAccessor.share_id == shared_document.share_id).first()
        document, shared_document, accessor = db.query(Document, SharedDocument, SharedDocumentAccessor).join(SharedDocument, Document.id == SharedDocument.id).join(SharedDocumentAccessor, SharedDocumentAccessor.share_id == SharedDocument.share_id).filter(Document.document_id == document_id, SharedDocumentAccessor.email == user_email).first()
        if updated_validity <= accessor.validity:
            return {"status_code": ErrorCode.BADREQUEST, "msg": "New validity must be greater than the existing validity."} 
        accessor.validity = updated_validity
        central_validity = max(shared_document.validity, updated_validity)
        shared_document.validity = central_validity
        db.commit()
        db.refresh(accessor)
        db.refresh(shared_document)
        return {"status_code": ErrorCode.NOERROR, "msg": "Validity increased."} 
    
    @classmethod
    def increase_validity(cls, db: Session, document_id: str, updated_validity: datetime, down_propagate: bool) -> Dict[int,str]:
            """Increase the validity of the existing shared document. If the down propagate
            is true and the document provides selective access, then the validity is increased 
            for the accessors as well.

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
            if down_propagate and not document.open_to_all:
                 accessors = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.share_id == document.share_id).all()
                 for accessor in accessors:
                      accessor.validity = updated_validity
            db.commit()
            db.refresh(document)
            return {"status_code": ErrorCode.NOERROR, "msg": "Validity has increased."}


