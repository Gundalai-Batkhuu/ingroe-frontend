class APIError(Exception):
    """Base exception class for the api"""
    def __init__(self, message: str = "Service is unavailable", name: str = "Doc"):
        self.message = message
        self.name = name
        super().__init__(self.message, self.name)

class DocumentDoesNotExistError(APIError):
    """Exception raised when the document is not found for a particular id"""
    pass      

class SearchResultRetrievalError(APIError):
    """Exception raised during the search result retrieval"""
    pass

class DocumentCreationError(APIError):
    """Exception raised while creating the documents"""
    pass

class DocumentStorageError(APIError):
    """Exception raised when storing documents in databases whether it's graph or relational"""
    pass