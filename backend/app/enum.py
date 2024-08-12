from enum import Enum

class ModelProvider(Enum):
    """Specifies the name of the model provider.
    """
    GROQ: str = "groq"
    OPENAI: str = "openai" 