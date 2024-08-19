class GraphLabel:
    """Constants used in the graph.
    """
    DOCUMENT_ROOT: str = "Document_Root" 
    USER: str = "User"
    USER_DOCUMENT_RELATIONSHIP : str = "Created"

class ReturnCode:
    """Constants used for specifying the return type in document creation operation.
    """
    VANILLA_LINK: int = 2
    UNSUPPORTED_FILE: int = 0  
    ERROR: int = -1

class NameClass:
    """Constants representing plain strings.
    """
    S3_BUCKET_NAME: str = "lai-app-dev"    