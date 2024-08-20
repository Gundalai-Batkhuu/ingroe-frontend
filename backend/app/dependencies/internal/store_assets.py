from typing import List, Dict
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import DocumentCRUD
from app.database import get_session
from app.scripts.db import CapturedDocumentCRUD

class StoreAssets:
    """Class containing methods to store the asset information to the database.
    """
    def __init__(
            self,
            user_id: str,
            document_root_id: str, 
            source_payload: DocumentSource
            ) -> None:
        """A constructor method to initialise the StoreAssets instance.

        Args:
        user_id (str): Id of the user.
        document_root_id (str): Id of the document root holding all the documents.
        source_payload (DocumentSource): The DocumentSource object containing the asset information.
        """
        self.user_id = user_id
        self.document_root_id = document_root_id
        self.vanilla_links = source_payload.vanilla_links
        self.error_links = source_payload.error_links
        self.file_links = source_payload.file_links 
        self.unsuppported_file_links = source_payload.unsupported_file_links
        self.files = source_payload.files

    def store(self, isUpdate: bool) -> None:
        """Stores the document asset information to the database.
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
                vanilla_links=self.vanilla_links,
                file_links=self.file_links,
                unsupported_file_links=self.unsuppported_file_links,
                files=self.files        
        )

    def _update_document(self) -> None:
        """Updates the assets in the database.
        """
        db = get_session()
        DocumentCRUD.update_document(
            db=db,
            document_id=self.document_root_id,
            vanilla_links=self.vanilla_links,
            file_links=self.file_links,
            unsupported_file_links=self.unsuppported_file_links,
            files=self.files  
            )   

    def store_captured_document(self, files: List[Dict[str, str]]) -> None:
        db = get_session()
        CapturedDocumentCRUD.create_record(
            db=db,
            document_id=self.document_root_id,
            files=files)