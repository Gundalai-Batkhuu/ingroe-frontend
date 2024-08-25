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

class ModelDetails:
    """Provides the model id for a provider.
    """   
    BEDROCK_CLAUDE_HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 
    BEDROCK_CLAUDE_SONNET = "anthropic.claude-3-sonnet-20240229-v1:0"  

class FileType:
    """Contains the file types.
    """      
    PDF: str = "pdf"
    TXT: str = "txt"

class ErrorCode:
    """Contains the error code for different errors.
    """    
    FORBIDDEN = 403
    UNAUTHORIZED = 401
    NOERROR = 200
    BADREQUEST = 400