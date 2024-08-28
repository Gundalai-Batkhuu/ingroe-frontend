import os
import hashlib
from app.scripts.db import APIKeyCRUD
from sqlalchemy.orm import Session

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