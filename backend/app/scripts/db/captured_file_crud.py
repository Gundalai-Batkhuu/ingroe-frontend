from sqlalchemy.orm import Session
from app.model.db import CapturedFile
from typing import List, Dict

class CapturedFileCRUD:
    @classmethod
    def create_record(
        cls,
        db: Session, 
        file_id: str,
        captured_document_id: str,
        file_url: str, 
        file_name: str
    ) -> None:
        """Creates a record in the captured file table with the relevant fields.

        Args:
        db (Session): The database session object.
        file_id (str): The id of the captured file.
        captured_document_id (str): The id of the captured document.
        file_url (str): The url of the file in storage.
        file_name (str): The name of the file in the storage.
        """
        document = CapturedFile(file_id=file_id, captured_document_id=captured_document_id, file_url=file_url, file_name=file_name)
        db.add(document)
        db.commit()
        db.refresh(document)

    @classmethod
    def delete_record(cls, db: Session, file_id: str, captured_document_id: str) -> None:  
        """Deletes a record from the captured file table based on the file_id.

        Args:
        db (Session): The database session object.
        file_id (str): The id of the captured file.
        captured_document_id (str): The id of the captured document.
        """ 
        document = db.query(CapturedFile).filter(
            CapturedFile.file_id == file_id, CapturedFile.captured_document_id == captured_document_id
            ).first()
        db.delete(document)
        db.commit()

    @classmethod
    def file_exists_for_a_name(cls, db: Session, file_id: str, captured_document_id: str, file_name: str) -> None:
        """Checks if the file exists under a user account.

        Args:
        db (Session): The database session object.
        file_id (str): The id of the captured file.
        captured_document_id (str): The id of the captured document.
        file_name (str): The name of the file in the storage.

        Returns:
        bool: True if document exists and False if it does not.
        """
        document_exists = db.query(CapturedFile).filter(
            CapturedFile.file_id == file_id,
            CapturedFile.captured_document_id == captured_document_id,
            CapturedFile.file_name == file_name
        ).first()
        return document_exists is not None      