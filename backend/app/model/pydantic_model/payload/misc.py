from pydantic import BaseModel
from typing import List, Dict

class DocumentSource(BaseModel):
    """Data model for document creation from files and links.
    """
    vanilla_links: List[str] = []
    unsupported_file_links: List[str] = []
    error_links: List[str] = []
    file_links: List[str] = []
    files: List[Dict[str, str]] = []      