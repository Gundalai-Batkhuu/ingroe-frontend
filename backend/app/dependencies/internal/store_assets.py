from typing import List
from app.model.pydantic_model.payload import DocumentSource

class StoreAssets:
    def __init__(
            self,
            user_id: str,
            document_root_id: str, 
            source_payload: DocumentSource
            ):
        self.user_id = user_id
        self.document_root_id = document_root_id
        self.vanilla_links = source_payload.vanilla_links
        self.error_links = source_payload.error_links
        self.file_links = source_payload.file_links 
        self.file_paths = source_payload.file_paths
        self.unsuppported_file_links = source_payload.unsupported_file_links

    def store(self):
        # store the source in the database. 
        print(self.file_paths)   
        pass
  