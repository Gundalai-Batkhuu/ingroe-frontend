from sqlalchemy.orm import Session, joinedload
from app.model.db import (User, Document, CapturedDocument, CapturedFile, SharedDocument, SharedDocumentAccessor)
from typing import List, Any, Dict, Tuple, Optional
from datetime import datetime, timezone
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
                    "is_shared": document_record.is_shared,
                    "captured_documents": captured_documents
                    }
                documents.append(doc_key)    

        shared_records = db.query(SharedDocumentAccessor, SharedDocument, Document).join(SharedDocument, SharedDocumentAccessor.share_id == SharedDocument.share_id).join(Document, SharedDocument.document_id == Document.document_id).filter(SharedDocumentAccessor.user_id == user_id, SharedDocumentAccessor.access_open == True).all()
        shared_documents_loaned = []
        for record in shared_records:
            _, _, document = record
            shared_key = {
                 "document_alias": document.document_alias,
                 "document_id": document.document_id,
                 "description": document.description
            }
            shared_documents_loaned.append(shared_key)

        return documents, shared_documents_loaned 
    
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

        shared_document = SharedDocument(share_id=share_id, document_id=document_id, open_to_all=open_to_all, validity=validity, user_count=len(accessor_emails))
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
            if record.validity is not None and record.validity < accept_time:
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
        if accessor.validity is not None and updated_validity <= accessor.validity:
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
            if document.validity is not None and updated_validity <= document.validity:
                return {"status_code": ErrorCode.BADREQUEST, "msg": "New validity must be greater than the existing validity."}
            document.validity = updated_validity
            if down_propagate and not document.open_to_all:
                accessors = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.share_id == document.share_id).all()
                for accessor in accessors:
                    accessor.validity = updated_validity
            db.commit()
            db.refresh(document)
            return {"status_code": ErrorCode.NOERROR, "msg": "Validity has increased."}
    
    @classmethod
    def change_document_access(cls, db:Session, document_id: str, access_change_reason: str, block_access: bool) -> Dict[int,str]:
        """Change the document access from open to close or close to open. It is used for changing
        the access at the top level. If the document is not shared publicly then, the access is
        blocked for all the accessors as well.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is already being shared.
        access_change_reason (str): The reason for changing the access.
        block_access (bool): A boolean value whether to close or open the access.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        document = db.query(SharedDocument).filter(SharedDocument.document_id == document_id).first()
        if document.access_open != block_access:
            return {"status_code": ErrorCode.BADREQUEST, "msg": "No change required"}
        document.access_open = not block_access
        access_change_time = datetime.now(timezone.utc)
        if block_access:
            document.access_blocked_at = access_change_time
            block_count = document.access_blocked_count
            document.access_blocked_count = block_count + 1
        else:
            document.access_opened_at = access_change_time
        document.access_change_reason = access_change_reason

        if not document.open_to_all:
            accessors = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.share_id == document.share_id).all() 
            for accessor in accessors:
                accessor.access_open = not block_access  
                if block_access:
                    accessor.access_blocked_at = access_change_time
                else:
                    accessor.access_opened_at = access_change_time
                accessor.access_change_reason = access_change_reason

        db.commit()
        db.refresh(document)                
        return {"status_code": ErrorCode.NOERROR, "msg": "Access changed."}
    
    @classmethod
    def change_document_access_user(cls, db:Session, share_id: str, emails: List[str], access_change_reason: str, block_access: bool) -> Dict[int,str]:
        """Changes the document access for users present in the email list. If the block
        access is true and access is already closed then nothing happens and vice-versa. 

        Args:
        db (Session): The database session object.
        share_id (str): The share id of the document that is being shared.
        emails (List[str]): The list of emails for which the access needs to be modified.
        access_change_reason (str): The reason for changing the access.
        block_access (bool): A boolean value whether to close or open the access.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        documents = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.share_id == share_id).all()
        if len(documents) == 0:
            return {"status_code": ErrorCode.NOERROR, "msg": "Document does not exists."}   
        for email in emails:
            for document in documents:
                if email == document.email:
                    if document.access_open != block_access: 
                        continue
                    document.access_open = not block_access
                    access_change_time = datetime.now(timezone.utc)
                    if block_access:
                        document.access_blocked_at = access_change_time
                        block_count = document.access_blocked_count
                        document.access_blocked_count = block_count + 1
                    else:
                        document.access_opened_at = access_change_time 
                    document.access_change_reason = access_change_reason 
        db.commit()             
        return {"status_code": ErrorCode.NOERROR, "msg": "Access changed."}   

    @classmethod
    def get_shared_document_state(cls, db: Session, user_id: str, document_id: str) -> List[dict]:
        """Provides the state of the document that has been shared.

        Args:
        db (Session): The database session object.
        user_id (str): The id of the user who owns the shared document.
        document_id (str): The id of the document that is already being shared.

        Returns:
        List[dict]: A list of dictionary that contains the shared document state.
        """
        result = db.query(Document).options(
        joinedload(Document.shared_document).joinedload(
            SharedDocument.shared_document_accessor)
        ).filter(Document.document_id == document_id, Document.user_id == user_id).all()
        for record in result:
            shared_documents = []
            for shared_record in record.shared_document:
                shared_accessors = []
                for accessor_record in shared_record.shared_document_accessor:
                    accessor_key = {
                        "accessor_email": accessor_record.email,
                        "accessor_user_id": accessor_record.user_id,
                        "access_accepted": accessor_record.verified,
                        "access_open": accessor_record.access_open,
                        "document_present": accessor_record.is_alive,
                        "access_validity": accessor_record.validity,
                        "shared_at": accessor_record.shared_at,
                        "access_blocked_at": accessor_record.access_blocked_at,
                        "access_opened_at": accessor_record.access_opened_at,
                    }
                    shared_accessors.append(accessor_key)
                shared_key = {
                    "share_id": shared_record.share_id,
                    "open_to_all": shared_record.open_to_all,
                    "validity": shared_record.validity,
                    "shared_at": shared_record.shared_at,
                    "access_open": shared_record.access_open,
                    "access_blocked_at": shared_record.access_blocked_at,
                    "access_opened_at": shared_record.access_opened_at,
                    "accessor_count": shared_record.user_count,
                    "accessor": shared_accessors
                }
                shared_documents.append(shared_key)
        return shared_documents   

    @classmethod
    def remove_share_state(cls, db: Session, document_id: str, current_timestamp: datetime) -> Dict[int,str]:
        """Removes the document from the shared table only if it satisfies all the below conditions:
         1. if there are no accessors for the document.
         2. if the document validity is not None i.e. the document is not public.
         3. if the document has its validity expired.
         Owner need to notify the users or public giving the deadline before deleting in such cases.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is already being shared.
        current_timestamp (datetime): The time when the request to remove from shared table is made.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        records = db.query(SharedDocument, SharedDocumentAccessor).outerjoin(SharedDocumentAccessor, SharedDocument.share_id == SharedDocumentAccessor.share_id).filter(SharedDocument.document_id == document_id).all()
        for record in records:
            shared_document, shared_accessor = record
            if shared_accessor is not None:
                return {"status_code": ErrorCode.BADREQUEST, "msg": "Document is still accessed by other users. Cannot remove from shared state."}
            if shared_document.validity is None:
                return {"status_code": ErrorCode.BADREQUEST, "msg": "Document is a public document. Cannot remove from shared state."}
            if shared_document.validity >= current_timestamp:
                return {"status_code": ErrorCode.BADREQUEST, "msg": "Document has validity. Cannot remove from shared state."}
            
            db.delete(shared_document)
            db.commit()
            return {"status_code": ErrorCode.NOERROR, "msg": "Document has been removed from sharing state."}  
        
    @classmethod
    def remove_shared_document_from_sharee_account(cls, db:Session, document_id: str, user_id: str) -> None:
        """Removes the shared document from the user account. The user is a sharee not the owner.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is already being shared.
        user_id (str): The id of the user who wants to remove the shared document as a sharee.
        """
        shared_document, accessor = db.query(SharedDocument, SharedDocumentAccessor).join(SharedDocumentAccessor, SharedDocument.share_id == SharedDocumentAccessor.share_id).filter(SharedDocument.document_id == document_id, SharedDocumentAccessor.user_id == user_id).first() 
        print(accessor.email)  
        total_users = shared_document.user_count
        shared_document.user_count = total_users - 1

        db.delete(accessor) 
        db.commit()
        
    @classmethod
    def add_new_accessor(cls, db: Session, document_id: str, share_id: str, email: str) -> Dict[int,str]:
        """Adds an accessor to the existing shared document.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is already being shared.
        share_id (str): The id that distinguishes shared document in the share document table.
        email (str): The email of the accessor.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        document = db.query(SharedDocument).filter(SharedDocument.document_id == document_id).first()
        if document.open_to_all == True:
            return {"status_code": ErrorCode.BADREQUEST, "msg": "Accessor cannot be added to the public document."}
        existing_count = document.user_count
        document.user_count = existing_count + 1
        verification_token = get_secret_token(40)
        document_accessor = SharedDocumentAccessor(email=email, share_id=share_id, verification_token=verification_token, validity=document.validity)
        db.add(document_accessor)
        db.commit()
        return {"status_code": ErrorCode.NOERROR, "msg": "Accessor added for the document."}
    
    @classmethod    
    def share_document_to_public(cls, db: Session, document_id: str, current_timestamp: datetime, validity: Optional[datetime]) -> Dict[int, str]:
        """Makes the privately shared document to public document. It only makes it public when the
        validity has expired or in case when the validity has not expired, the user accessing this
        document must be zero. Otherwise, we cannot make the document public or wait till the desired
        condition is achieved.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document that is being shared privately.
        current_timestamp (datetime): The time when the request to change access is made.
        validity (Optional[datetime]): New validity for the document fixed or infinite.

        Returns:
        Dict[int,str]: A dictionary containing the status code and the message.
        """
        shared_document = db.query(SharedDocument).filter(SharedDocument.document_id == document_id).first()
        if current_timestamp <= shared_document.validity:
            if shared_document.user_count != 0:
                return {"status_code": ErrorCode.BADREQUEST, "msg": "Document is still valid and is accessed by users. Cannot make it public if it's valid and accessed by users."}

        if shared_document.user_count > 0:
            records = db.query(SharedDocumentAccessor).filter(SharedDocumentAccessor.share_id == shared_document.share_id).all()
            for record in records:
                db.delete(record)
        shared_document.user_count = 0
        shared_document.open_to_all = True
        shared_document.validity = validity
        db.commit()
        db.refresh(shared_document)
        return {"status_code": ErrorCode.NOERROR, "msg": "Made the document public."}


        
        
