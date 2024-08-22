from fastapi import APIRouter, Depends
from typing import Dict
from app.model.pydantic_model import User
from app.scripts.db import UserCRUD
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi.responses import JSONResponse

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
    return user