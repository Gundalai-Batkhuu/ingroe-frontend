from pydantic import BaseModel
from typing import List, Dict

class DocumentSource(BaseModel):
    """Data model for search result that is returned from the search query.
    """
    vanilla_links: List[str] = []
    unsupported_file_links: List[str] = []
    error_links: List[str] = []
    file_links: List[str] = []
    files: List[Dict[str, str]] = []