from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Tuple
from app.model.pydantic_model import (ShareDocument, AcceptSharedDocument, ValidityUpdate, ScopedValidityUpdate, Access, ScopedAccess, DocumentStatus, DocumentSharingRemoval, AccessorUpdate, SwitchShareType, SharedDocumentSelection)
from app.scripts.db import (CentralCRUD, SharedDocumentCRUD)
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse
from uuid import uuid4
from app.const import ErrorCode
from fastapi.encoders import jsonable_encoder
from app.controller.doc_action import document_exists
from app.exceptions import (DocumentDoesNotExistError)

router = APIRouter(
    prefix="/handle",
    tags=["document"],
    responses={404: {"description": "Not found"}},
)

@router.post("/share-document")
def share_document(payload: ShareDocument, db: Session = Depends(get_db)):
    """Endpoint to share the document or knowledge base. The sharing can be customised such as whether to share publicly or to some users using their email id, validity and so on.
    """
    share_id = uuid4().hex
    response = CentralCRUD.share_document(db=db, document_id=payload.document_id, user_id=payload.user_id, is_shared=True, share_id=share_id, open_to_all=payload.open_access, validity=payload.validity, accessor_emails=payload.accessor_emails, accessor_validity=payload.validity)
    if response == ErrorCode.UNAUTHORIZED:
        raise HTTPException(status_code=401, detail="Authentication Error!")
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": "Document shared to others!!",
            "share_id": share_id,
            "validity": payload.validity
            })
    )

@router.patch("/accept-shared-document")
def accept_shared_document(payload: AcceptSharedDocument, db: Session = Depends(get_db)):
    """Endpoint to accept the shared document. It is used when a user gets a notification or message that a document has been shared to the user by someone. If the user chooses to accept the shared document, then this document can be used for querying by that user.
    """
    response = CentralCRUD.accept_shared_document(db=db, email=payload.email, share_id=payload.share_id, user_id=payload.user_id, verification_token=payload.verification_token, accept_time=payload.accept_time)
    if response == ErrorCode.FORBIDDEN:
        raise HTTPException(status_code=403, detail="Document cannot be accepted as the share time has expired.")
    if response == ErrorCode.UNAUTHORIZED:
        raise HTTPException(status_code=401, detail="Authentication Error!")
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": "Shared document added!!",
            "share_id": payload.share_id,
            "validity": response
            })
    )

@router.patch("/change-document-validity")
def change_document_validity(payload: ValidityUpdate, db: Session = Depends(get_db)):
    """Endpoint to change the validity of the shared document. Validity can only be increased from the existing validity. It cannot be decreased. This endpoint applies the new validity centrally i.e. the validity is not updated to the accessors unless down_propagate is set to True. Also, down propagation happens only when the document is shared privately.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.increase_validity(db=db, document_id=payload.document_id, updated_validity=payload.updated_validity, down_propagate=payload.down_propagate)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": response_message,
            "new_validity": payload.updated_validity
        })
    )

@router.patch("/change-document-validity-for-user")
def change_document_validity_for_user(payload: ScopedValidityUpdate, db: Session = Depends(get_db)):
    """Endpoint to change the validity of the document for a specific user. Like before, the validity can only be increased from the existing validity. It cannot be decreased.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.increase_document_validity_for_user(db=db, document_id=payload.document_id, user_email=payload.user_email, updated_validity=payload.updated_validity)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": response_message,
            "new_validity": payload.updated_validity
        })
    )

@router.patch("/block-document-access")
def block_document_access(payload: Access, db: Session = Depends(get_db)):
    """Endpoint to block the access of the document centrally.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.change_document_access(db=db, document_id=payload.document_id, access_change_reason=payload.access_change_reason, block_access=payload.block_access)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content={
            "message": response_message,
        }
    )

@router.patch("/block-document-access-for-user")
def block_document_access_for_user(payload: ScopedAccess, db: Session = Depends(get_db)):
    """Endpoint to block the access of the document for a specific user.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.change_document_access_user(db=db, share_id=payload.share_id, emails=payload.emails, access_change_reason=payload.access_change_reason, block_access=payload.block_access)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content={
            "message": response_message,
        }
    )

@router.delete("/remove-share-state")
def remove_share_state(payload: DocumentSharingRemoval, db: Session = Depends(get_db)):
    """Endpoint to remove the share state of the document. It makes the document private not accessible to anyone from the shared state. Below conditions need to be satisfied before making the document private:
    1. if there are no accessors for the document.
    2. if the document validity is not None i.e. the document is not public.
    3. if the document has its validity expired.
    If removal of sharing state needs to be executed before satisfying the above conditions, then the owner needs to notify the users or public with the deadline before deleting in such cases.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.remove_share_state(db=db, document_id=payload.document_id, current_timestamp=payload.current_timestamp)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content={
            "message": response_message,
        }
    )

@router.delete("/remove-shared-document-by-sharee")
def remove_shared_document_by_user(payload:DocumentStatus, db: Session = Depends(get_db)):
    """This is used to remove the shared document from the sharee account. The sharee is the user who has been chosen by the owner to grant access to its documents.
    """
    CentralCRUD.remove_shared_document_from_sharee_account(db=db, document_id=payload.document_id, user_id=payload.user_id)
    return JSONResponse(
        status_code=200,
        content={
            "message": "Document removed from user account",
        }
    )

@router.post("/add-new-accessor")
def add_new_accessor(payload: AccessorUpdate, db: Session = Depends(get_db)):
    """Endpoint to add a new accessor to the exsiting shared document.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.add_new_accessor(db=db, document_id=payload.document_id, share_id=payload.share_id, email=payload.accessor_email)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content={
            "message": response_message,
        }
    )

@router.patch("/allow-public-access")
def share_document_to_public(payload: SwitchShareType, db: Session = Depends(get_db)):
    """Endpoint to share the existing privately shared document to public. It only makes it public when the validity has expired or in the case when the validity has not expired, the user accessing this
    document must be zero. Otherwise, we cannot make the document public or wait till the desired
    condition is achieved.
    """
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise DocumentDoesNotExistError(message=f"The supplied document id {payload.document_id} does not exist", name="Invalid Document Id")
    response = CentralCRUD.share_document_to_public(db=db, document_id=payload.document_id, current_timestamp=payload.current_timestamp, validity=payload.validity)
    response_status_code, response_message = break_db_response_payload(response)
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content={
            "message": response_message,
        }
    )

@router.delete("/remove-all-expired-documents")
def remove_all_expired_documents(payload: SharedDocumentSelection, db: Session = Depends(get_db)):
    """It removes the expired documents from the user's shared document list. It only removes the document which has the validity set and the validity has expired. It does not touch the document with validity set to None. Documents with "None" validity means the document does not expires.
    """
    removal_count = CentralCRUD.remove_all_expired_documents(db=db, user_id=payload.user_id, current_timestamp=payload.current_timestamp)
    return JSONResponse(
        status_code=200,
        content={
            "message": "Removal of expired documents completed successfully!",
            "removed_document_count": removal_count
        }
    )

def break_db_response_payload(response: Dict[int,str]) -> Tuple[int,str]:
    """Returns the status code and message from the response.

    Args:
    response (Dict[int,str]): A dictionary containing the status code and message.

    Returns:
    Tuple[int,str]: A tuple of status code and message.
    """
    response_status_code = response.get("status_code")
    response_message = response.get("msg")
    return response_status_code, response_message