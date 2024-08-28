from fastapi import APIRouter, Depends
from typing import Dict
from app.model.pydantic_model import (UserIdMixin)
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.dependencies.internal.api import APIKeyManager

router = APIRouter(
    prefix="/api-keys",
    tags=["api_keys"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def index() -> Dict[str,str]:
    return {"name": "hello from api_keys"}

@router.post("/create-api-key")
def create_api_key(payload: UserIdMixin, db: Session = Depends(get_db)):
    api_key_manager = APIKeyManager(db=db)
    api_key = api_key_manager.create_api_key(payload.user_id)
    return JSONResponse(
        status_code=200,
        content={
            "message": "API key created!!", 
            "user_id": payload.user_id,
            "api_key": api_key
            }
    )