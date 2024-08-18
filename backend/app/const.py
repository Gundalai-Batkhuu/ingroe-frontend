class GraphLabel:
    """Constants used in the graph.
    """
    DOCUMENT_ROOT: str = "Document_Root" 
    USER: str = "User"
    USER_DOCUMENT_RELATIONSHIP : str = "Created"

class ReturnCode:
    VANILLA_LINK: int = 2
    UNSUPPORTED_FILE: int = 0  
    ERROR: int = -1

class NameClass:
    S3_BUCKET_NAME: str = "lai-app-dev"    