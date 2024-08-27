from typing import List, Dict
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import DocumentCRUD
from app.database import get_session
from app.scripts.db import (CapturedDocumentCRUD, CapturedFileCRUD)

class StoreAssets:
    """Class containing methods to store the asset information to the database.
    """
    def __init__(
            self,
            user_id: str,
            document_root_id: str, 
            document_alias: str,
            source_payload: DocumentSource,
            description: str
            ) -> None:
        """A constructor method to initialise the StoreAssets instance.

        Args:
        user_id (str): Id of the user.
        document_root_id (str): Id of the document root holding all the documents.
        document_alias (str): The name of the document.
        source_payload (DocumentSource): The DocumentSource object containing the asset information.
        description: A short description of the document.
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

    def store(self, isUpdate: bool) -> None:
        """Stores the document asset information to the database.

        Args:
        isUpdate (bool): A boolean value to indicate whether a create or update operation is required.
        """
        if isUpdate:
            self._update_document()
        else:   
            self._create_document() 
            
    def _create_document(self) -> None:
        """Creates a document record containing the assets in the database.
        """
        db = get_session()
        DocumentCRUD.create_document(
                db=db, 
                document_id=self.document_root_id,
                user_id=self.user_id,
                document_alias=self.document_alias,
                vanilla_links=self.vanilla_links,
                file_links=self.file_links,
                unsupported_file_links=self.unsuppported_file_links,
                files=self.files,  
                description=self.description      
        )
        db.close()

    def _update_document(self) -> None:
        """Updates the assets in the database.
        """
        db = get_session()
        DocumentCRUD.update_document(
            db=db,
            document_id=self.document_root_id,
            vanilla_links=self.vanilla_links,
            document_alias=self.document_alias,
            file_links=self.file_links,
            unsupported_file_links=self.unsuppported_file_links,
            files=self.files,  
            description=self.description
            )   
        db.close()

    def store_captured_document(self, captured_document_id: str, file_id: str, file_map: Dict[str, str]) -> None:
        """Store or create a record that contains the details about the captured document
        such as source, file name, query ready status, etc.

        Args:
        captured_document_id (str): The id of the captured document.
        file_map (Dict[str, str]): A dictionary containing the information about the captured 
        document source and file name.
        """
        db = get_session()
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
        db.close()

class DeleteAssets:
    """Deals with the deletion of assets from various tables.
    """
    @classmethod
    def delete_captured_file(cls, file_id: str, captured_document_id: str) -> None:
        """Deletes a record from the captured file table based on the file_id.

        Args:
        file_id (str): The id of the captured file.
        captured_document_id (str): The id of the captured document.
        """ 
        db = get_session()
        CapturedFileCRUD.delete_record(db=db, file_id=file_id, captured_document_id=captured_document_id)
        db.close()

    @classmethod
    def delete_captured_document(cls, document_id: str, captured_document_id: str) -> None:
        """Deletes a record from the captured document table based on the captured_document_id.

        Args:
        document_id (str): The id of the document root in the neo4j database.
        captured_document_id (str): The id of the captured document.
        """    
        db = get_session()
        CapturedDocumentCRUD.delete_record(db=db, document_id=document_id, captured_document_id=captured_document_id)
        db.close()

class UpdateAssets:
    """Deals with the updation of assets from various table.
    """
    @classmethod
    def update_document_info(cls, document_id: str, document_alias: str, description: str) -> None:
        db = get_session()
        DocumentCRUD.update_document_info(db=db, document_id=document_id, document_alias=document_alias, description=description)
        db.close()