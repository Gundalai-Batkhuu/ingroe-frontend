from enum import Enum

class ModelProvider(Enum):
    """Specifies the name of the model provider.
    """
    GROQ: str = "groq"
    OPENAI: str = "openai" 
    # BEDROCK: str = "bedrock"
    BEDROCK_HAIKU: str = "bedrock_haiku"
    BEDROCK_SONNET: str = "bedrock_sonnet"

class ServiceProvider(Enum):
    """Specifies the name of the service provider.
    """    
    AWS: str = "aws"