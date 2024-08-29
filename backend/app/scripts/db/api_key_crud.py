from sqlalchemy.orm import Session
from app.model.db import APIKey

class APIKeyCRUD:
    """Class that contains method to interact with the api key model or api key table.
    """
    @classmethod
    def create_api_key(cls, db: Session, user_id: str, key_hash: str, key_salt: str) -> None:
        """Creates a record in the api key table with the required fields.

        Args:
        db (Session): The database session object.
        user_id (str): The id of the user creating the api key.
        key_hash (str): Hashed key created from a api key and salt.
        key_salt (str): The salt key to create the hashed key by combining with the api key.
        """
        api_record = APIKey(user_id=user_id, key_hash=key_hash, key_salt=key_salt)
        db.add(api_record)
        db.commit()
        db.refresh(api_record)

    @classmethod
    def get_api_records(cls, db: Session, user_id: str) -> list:
        """Returns the records from the api table if matched.

        Args:
        db (Session): The database session object.
        user_id (str): The id of the user fetching the records.

        Returns:
        list: A list of records from the api table.
        """
        api_records = db.query(APIKey).filter(APIKey.user_id == user_id).all()
        return api_records