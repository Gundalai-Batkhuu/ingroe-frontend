import os
import hashlib
from app.scripts.db import APIKeyCRUD
from sqlalchemy.orm import Session
from app.const import Status

class APIKeyManager:
    """Class that manages the operations related to api keys.
    """
    def __init__(self, db: Session):
        """Constructor for the class.

        Args:
        db (Session): The database session object.
        """
        self.db = db

    def create_api_key(self, user_id: str) -> str:
        """Creates the api key for a user.

        Args:
        user_id (str): The id of the user creating the api key.

        Returns:
        str: The api key.
        """
        api_key = os.urandom(24).hex()
        salt = os.urandom(16).hex()
        key_hash = self._hash_key(api_key, salt)
        APIKeyCRUD.create_api_key(db=self.db, user_id=user_id, key_hash=key_hash, key_salt=salt)
        return api_key

    def _hash_key(self, key: str, salt: str) -> str:
        """Creates a hashed key from the key string and the security string called salt.

        Args:
        key (str): The string to hash.
        salt (str): Security string used in hashing.

        Returns:
        str: The hashed key.
        """
        return hashlib.sha256((key + salt).encode()).hexdigest()  

    def validate_api_key(self, api_key: str, user_id: str) -> int:
        """Validates the api key against a record in the api key table for a user.

        Args:
        api_key (str): The api key to validate.
        user_id (str): The id of the user validating the api key.

        Returns:
        int: Integer that signifies the validity and invalidity of the credentials.
        """
        api_records = APIKeyCRUD.get_api_records(db=self.db, user_id=user_id)
        if len(api_records) == 0:
            return Status.INVALID
        for record in api_records:
            salt = record.key_salt
            if self._hash_key(api_key, salt) == record.key_hash:
                return Status.VALID
        return Status.INVALID    
