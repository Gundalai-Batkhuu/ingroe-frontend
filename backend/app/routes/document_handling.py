from fastapi import APIRouter, Depends
from typing import Dict
from app.model.pydantic_model import (ShareDocument)
from app.scripts.db import (UserCRUD, CentralCRUD)
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse
from uuid import uuid4
from app.utils import get_secret_token

router = APIRouter(
    prefix="/handle",
    tags=["document"],
    responses={404: {"description": "Not found"}},
)

@router.post("/share-document")
def share_document(payload: ShareDocument, db: Session = Depends(get_db)):
    share_id = uuid4().hex
    CentralCRUD.share_document(db=db, document_id=payload.document_id, user_id=payload.user_id, is_shared=True, share_id=share_id, open_to_all=payload.open_access, validity=payload.validity, accessor_emails=payload.accessor_emails, accessor_validity=payload.validity)
    return {"name": "hello from handling"}