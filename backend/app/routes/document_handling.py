from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from app.model.pydantic_model import (ShareDocument, AcceptSharedDocument, ValidityUpdate, ScopedValidityUpdate)
from app.scripts.db import (CentralCRUD, SharedDocumentCRUD)
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse
from uuid import uuid4
from app.const import ErrorCode
from fastapi.encoders import jsonable_encoder
from app.controller.doc_action import document_exists

router = APIRouter(
    prefix="/handle",
    tags=["document"],
    responses={404: {"description": "Not found"}},
)

@router.post("/share-document")
def share_document(payload: ShareDocument, db: Session = Depends(get_db)):
    share_id = uuid4().hex
    CentralCRUD.share_document(db=db, document_id=payload.document_id, user_id=payload.user_id, is_shared=True, share_id=share_id, open_to_all=payload.open_access, validity=payload.validity, accessor_emails=payload.accessor_emails, accessor_validity=payload.validity)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": "Document shared to others!!",
            "share_id": share_id,
            "validity": payload.validity
            })
    )

@router.post("/accept-shared-document")
def accept_shared_document(payload: AcceptSharedDocument, db: Session = Depends(get_db)):
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

@router.post("/change-document-validity")
def change_document_validity(payload: ValidityUpdate, db: Session = Depends(get_db)):
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise HTTPException(status_code=400, detail="Document does not exist. Please provide a valid document id.")
    response = CentralCRUD.increase_validity(db=db, document_id=payload.document_id, updated_validity=payload.updated_validity, down_propagate=payload.down_propagate)
    response_status_code = response.get("status_code")
    response_message = response.get("msg")
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": response_message,
            "new_validity": payload.updated_validity
        })
    )

@router.post("/change-document-validity-for-user")
def change_document_validity_for_user(payload: ScopedValidityUpdate, db: Session = Depends(get_db)):
    if not document_exists(document_id=payload.document_id, user_id=payload.user_id):
        raise HTTPException(status_code=400, detail="Document does not exist. Please provide a valid document id.")
    response = CentralCRUD.increase_document_validity_for_user(db=db, document_id=payload.document_id, user_email=payload.user_email, updated_validity=payload.updated_validity)
    response_status_code = response.get("status_code")
    response_message = response.get("msg")
    if response_status_code != 200:
        raise HTTPException(status_code=response_status_code, detail=response_message)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "message": response_message,
            "new_validity": payload.updated_validity
        })
    )