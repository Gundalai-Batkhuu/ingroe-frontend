from sqlalchemy.orm import Session
from app.model.db import User

class UserCRUD:
    """Class that contains method to interact with the user model or user table.
    """
    @classmethod
    def create_user(cls, db: Session, name: str, email: str, user_id: str) -> None:
        """Creates a record in the user table with the required fields.
        """
        db_user = User(name=name, email=email, user_id=user_id)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        