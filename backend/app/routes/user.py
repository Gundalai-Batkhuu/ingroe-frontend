from fastapi import APIRouter, Depends
from typing import Dict
from app.model.pydantic_model import (User, DocumentStatus)
from app.scripts.db import (UserCRUD, CentralCRUD)
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def index() -> Dict[str,str]:
    return {"name": "hello from user"}

@router.post("/create")
def create_user(user: User, db: Session = Depends(get_db)):
    UserCRUD.create_user(db=db, name=user.name, email= user.email, user_id=user.user_id)
    return JSONResponse(
        status_code=200,
        content={
            "message": "User added to the database successfully!!", 
            "user_id": user.user_id,
            "user_name": user.name,
            "user_email": user.email
            }
    )
    
@router.get("/get-user-artifacts")
def get_user_artifacts(user_id: str, db: Session = Depends(get_db)):
    documents, shared_documents_loaned = CentralCRUD.get_all_artifacts_for_user(db=db, user_id=user_id)
    return JSONResponse(
        status_code=200,
        content={
            "user_id": user_id,
            "artefact_tree":documents,
            "shared_artifacts_loaned": shared_documents_loaned
            }
    )

@router.get("/get-shared-document-state")
def get_shared_document_state(payload:DocumentStatus, db: Session = Depends(get_db)):
    documents = CentralCRUD.get_shared_document_state(db=db, user_id=payload.user_id, document_id=payload.document_id)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder({
            "document_id": payload.document_id,
            "documents":documents,
            })
    )