from typing import Union
from langchain_groq import ChatGroq 
from langchain_openai import ChatOpenAI
from app.enum import ModelProvider
from langchain_aws import ChatBedrock
from dotenv import load_dotenv
import os
from app.const import ModelDetails

load_dotenv()

os.environ["AWS_ACCESS_KEY_ID"] = os.getenv("AWS_ACCESS_KEY_ID")
os.environ["AWS_SECRET_ACCESS_KEY"] = os.getenv("AWS_SECRET_ACCESS_KEY")
os.environ["AWS_DEFAULT_REGION"] = os.getenv("AWS_REGION_SYD")

class LLM:
    """Provides an option to select the type of llm model.

    Parameters:
    model (str): The name of model to be used.
    temperature (Union[float, int]): The parameter to specify the temperature to control randomness
    of the output token from the model.
    """
    def __init__(
            self,
            temperature: Union[float, int] = 0,
        ):
        """If temperature is outside the range of 0 and 1, it throws an error."""
        if not (0 <= temperature <= 1):
            raise ValueError("The temperature must be between 0 and 1 inclusive.")  
        self.temperature = temperature  

    def get_model(self, model_provider: str) -> ChatGroq | ChatOpenAI:
        """Provides the llm model based on the chosen model provider.

        Args:
        model_provider (str): The name of the model provider. e.g. openai

        Returns:
        ChatGroq | ChatOpenAI: The llm model either from groq or openai.
        """
        if model_provider == ModelProvider.GROQ:
            model = ModelDetails.GROQ_LLAMA_70B
            return self._get_groq(model)
        if model_provider == ModelProvider.OPENAI:
            model = ModelDetails.OPENAI_GPT_TURBO
            return self._get_openai(model)   
        if model_provider == ModelProvider.BEDROCK_HAIKU:
            model = ModelDetails.BEDROCK_CLAUDE_HAIKU
            return self._get_bedrock(model)   
        if model_provider == ModelProvider.BEDROCK_SONNET:
            model = ModelDetails.BEDROCK_CLAUDE_SONNET
            return self._get_bedrock(model)  

    def _get_groq(self, model: str) -> ChatGroq:
        """Get the llm model from groq.
        
        Args: 
        model (str): The model id.

        Returns:
        ChatGroq: ChatGroq instance.
        """
        llm = ChatGroq(temperature=self.temperature, model=model) 
        return llm
    
    def _get_openai(self, model: str) -> ChatOpenAI:
        """Get the llm model of choice from OpenAI.
        
        Args: 
        model (str): The model id.

        Returns:
        ChatOpenAI: ChatOpenAI instance.
        """
        llm = ChatOpenAI(temperature=self.temperature, model_name=model)
        return llm    
    
    def _get_bedrock(self, model: str) -> ChatBedrock:
        """Get the llm model of choice from bedrock.
        
        Args: 
        model (str): The model id.

        Returns:
        ChatBedrock: ChatBedrock instance.
        """
        llm = ChatBedrock(
            model_id=model,
            model_kwargs=dict(temperature=self.temperature),
        )
        return llm
        