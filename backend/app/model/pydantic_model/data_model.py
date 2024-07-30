from pydantic import BaseModel

class SearchQuery(BaseModel):
    """
    Data Model for searching documents.

    This model performs the validation of the body in the client request.
    """
    query: str