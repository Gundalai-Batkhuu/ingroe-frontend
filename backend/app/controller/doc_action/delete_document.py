from ..core import APIEndPoint
from app.scripts.db import DocumentCRUD
from app.database import get_session
from app.dependencies.internal import DeleteDocument
from app.dependencies.external import S3
from app.const import NameClass
from typing import Optional

class Delete(APIEndPoint):
    """Class that deals with the deletion of documents.
    """
    @classmethod
    async def delete_document(cls, document_id: str, user_id: str) -> bool | None:
        """Deletes the document from neo4j database, postgres and S3 storage.

        Args:
        document_id (str): Id of the document root that holds all the document entities for a particular topic. 
        user_id (str): Id of the user uploading the file.

        Returns:
        bool | None: Returns true if document deletion is successful. False if document does not exist.
        None if error occured.
        """
        try:
            db = get_session()
            document_exists = DocumentCRUD.document_exists_for_user(document_id, user_id, db)
            if document_exists:
                # DeleteDocument.delete_document_from_graph(document_id)
                DocumentCRUD.delete_document(db, document_id)
                S3.delete_from_s3_bucket(NameClass.S3_BUCKET_NAME, user_id, document_id)
                return True
            return False
        except Exception as e:
            print(e)
            return None
