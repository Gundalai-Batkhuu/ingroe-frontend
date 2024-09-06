from typing import List, Dict
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import DocumentCRUD
from app.database import get_db
from app.scripts.db import (CapturedDocumentCRUD, CapturedFileCRUD)
from loguru import logger
from app.exceptions import (DocumentStorageError, DocumentCaptureError)
from sqlalchemy.orm import Session

class StoreAssets:
    """Class containing methods to store the asset information to the database.
    """
    def __init__(
            self,
            user_id: str,
            document_root_id: str, 
            document_alias: str,
            source_payload: DocumentSource,
            description: str,
            db: Session
            ) -> None:
        """A constructor method to initialise the StoreAssets instance.

        Args:
        user_id (str): Id of the user.
        document_root_id (str): Id of the document root holding all the documents.
        document_alias (str): The name of the document.
        source_payload (DocumentSource): The DocumentSource object containing the asset information.
        description: A short description of the document.
        db (Session): Database session object.
        """
        self.user_id = user_id
        self.document_root_id = document_root_id
        self.document_alias = document_alias
        self.vanilla_links = source_payload.vanilla_links
        self.error_links = source_payload.error_links
        self.file_links = source_payload.file_links 
        self.unsuppported_file_links = source_payload.unsupported_file_links
        self.files = source_payload.files
        self.description = description
        self.db = db

    def store(self, isUpdate: bool) -> None:
        """Stores the document asset information to the database.

        Args:
        isUpdate (bool): A boolean value to indicate whether a create or update operation is required.
        """
        try:
            if isUpdate:
                self._update_document()
            else:   
                self._create_document() 
        except Exception as e:
            logger.error(e)
            raise DocumentStorageError(message="Error while storing the document information in the postgres database", name="Store document")        
            
    def _create_document(self) -> None:
        """Creates a document record containing the assets in the database.
        """
        DocumentCRUD.create_document(
                db=self.db, 
                document_id=self.document_root_id,
                user_id=self.user_id,
                document_alias=self.document_alias,
                vanilla_links=self.vanilla_links,
                file_links=self.file_links,
                unsupported_file_links=self.unsuppported_file_links,
                files=self.files,  
                description=self.description      
        )

    def _update_document(self) -> None:
        """Updates the assets in the database.
        """
        DocumentCRUD.update_document(
            db=self.db,
            document_id=self.document_root_id,
            vanilla_links=self.vanilla_links,
            document_alias=self.document_alias,
            file_links=self.file_links,
            unsupported_file_links=self.unsuppported_file_links,
            files=self.files,  
            description=self.description
            )   

    def store_captured_document(self, captured_document_id: str, file_id: str, file_map: Dict[str, str], db: Session) -> None:
        """Store or create a record that contains the details about the captured document
        such as source, file name, query ready status, etc.

        Args:
        captured_document_id (str): The id of the captured document.
        file_map (Dict[str, str]): A dictionary containing the information about the captured 
        document source and file name.
        db (Session): Database session object.
        """
        try:
            CapturedDocumentCRUD.create_record(
                db=db,
                captured_document_id=captured_document_id,
                document_id=self.document_root_id)
            CapturedFileCRUD.create_record(
                db=db,
                file_id=file_id,
                captured_document_id=captured_document_id,
                file_url=file_map.get("file_url"),
                file_name=file_map.get("file_name")
            )   
        except Exception as e:
            logger.error(e)
            raise DocumentCaptureError(message="Error occured while storing the captured document in relational database", name="Store capture document")

class DeleteAssets:
    """Deals with the deletion of assets from various tables.
    """
    @classmethod
    def delete_captured_file(cls, file_id: str, captured_document_id: str, db: Session) -> None:
        """Deletes a record from the captured file table based on the file_id.

        Args:
        file_id (str): The id of the captured file.
        captured_document_id (str): The id of the captured document.
        db (Session): The database session object.
        """ 
        CapturedFileCRUD.delete_record(db=db, file_id=file_id, captured_document_id=captured_document_id)

    @classmethod
    def delete_captured_document(cls, document_id: str, captured_document_id: str, db: Session) -> None:
        """Deletes a record from the captured document table based on the captured_document_id.

        Args:
        document_id (str): The id of the document root in the neo4j database.
        captured_document_id (str): The id of the captured document.
        db (Session): The database session object.
        """    
        CapturedDocumentCRUD.delete_record(db=db, document_id=document_id, captured_document_id=captured_document_id)

class UpdateAssets:
    """Deals with the updation of assets from various table.
    """
    @classmethod
    def update_document_info(cls, document_id: str, document_alias: str, description: str, db: Session) -> None:
        """Updates the document information in the database.

        Args:
        document_id (str): The id of the document root in the postgres database.
        document_alias (str): The alias of the document.
        description (str): A short description of the document.
        db (Session): The database session object.
        """
        DocumentCRUD.update_document_info(db=db, document_id=document_id, document_alias=document_alias, description=description)