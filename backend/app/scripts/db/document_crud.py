from sqlalchemy.orm import Session
from app.model.db import Document
from typing import List, Dict, Optional

class DocumentCRUD:
    """Class that contains method to interact with the document model or document table.
    """
    @classmethod
    def create_document(
        cls, 
        db: Session, 
        document_id: str, 
        user_id: str, 
        vanilla_links: List[str], 
        file_links: List[str], 
        unsupported_file_links: List[str], 
        files: Optional[List[Dict[str, str]]]) -> None:
        """Creates a record in the document table with the relevant fields.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document root in the neo4j database.
        user_id (str): The id of the user.
        vanilla_links (List[str]): A list of normal links that points to a webpage.
        file_links (List[str]): A list of links pointing to the file.
        unsupported_file_links (List[str]): A list of file_links that are unsupported for document creation.
        files (Optional[List[Dict[str, str]]]): A list of dictionary containing the file url and the name.
        """
        document = Document(document_id=document_id, user_id=user_id, vanilla_links=vanilla_links, file_links=file_links, unsupported_file_links=unsupported_file_links, files=files)
        db.add(document)
        db.commit()
        db.refresh(document)

    @classmethod
    def update_document(
        cls, 
        db: Session, 
        document_id: str, 
        vanilla_links: List[str], 
        file_links: List[str], 
        unsupported_file_links: List[str], 
        files: Optional[List[Dict[str, str]]]) -> None:
            """Updates the existing document in the database by adding the new asset.

            Args:
            db (Session): The database session object.
            document_id (str): The id of the document root in the neo4j database.
            vanilla_links (List[str]): A list of normal links that points to a webpage.
            file_links (List[str]): A list of links pointing to the file.
            unsupported_file_links (List[str]): A list of file_links that are unsupported for document creation.
            files (Optional[List[Dict[str, str]]]): A list of dictionary containing the file url and the name.
            """
            document = db.query(Document).filter(Document.document_id == document_id).first()
            if len(vanilla_links) > 0:
                updated_vanilla_links = document.vanilla_links + vanilla_links
                document.vanilla_links = updated_vanilla_links
            if len(file_links) > 0:
                updated_file_links = document.file_links + file_links    
                document.file_links = updated_file_links
            if len(unsupported_file_links) > 0:
                updated_uns_file_links = document.unsupported_file_links + unsupported_file_links    
                document.unsupported_file_links = updated_uns_file_links
            if len(files) > 0:
                updated_files = document.files + files    
                document.files = updated_files
            db.commit()
            db.refresh(document)

    @classmethod
    def delete_document(cls, db: Session, document_id: str) -> None:
        """Deletes a document record from the database.

        Args:
        db (Session): The database session object.
        document_id (str): The id of the document root in the neo4j database.
        """
        document = db.query(Document).filter(Document.document_id == document_id).first() 
        db.delete(document)
        db.commit()

    @classmethod
    def document_exists_for_user(cls, document_id: str, user_id: str, db: Session) -> bool:
        """Checks if the document exists under a user account.

        Args:
        user_id (str): Id of the user uploading the file.
        document_id (str): The id of the document root in the neo4j database.
        db (Session): The database session object.

        Returns:
        bool: True if document exists and False if it does not.
        """
        document_exists = db.query(Document).filter(
            Document.document_id == document_id,
            Document.user_id == user_id
        ).first()
        return document_exists is not None    
    
        