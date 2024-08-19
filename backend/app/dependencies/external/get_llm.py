from typing import Union
from langchain_groq import ChatGroq 
from langchain_openai import ChatOpenAI
from app.enum import ModelProvider

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
            model = "llama3-70b-8192"
            return self._get_groq(model)
        if model_provider == ModelProvider.OPENAI:
            model = "gpt-3.5-turbo-0125"
            return self._get_openai(model)        

    def _get_groq(self, model) -> ChatGroq:
        """Get the llm model from groq."""
        llm = ChatGroq(temperature=self.temperature, model=model) 
        return llm
    
    def _get_openai(self, model) -> ChatOpenAI:
        """Get the llm model of choice from OpenAI."""
        llm = ChatOpenAI(temperature=self.temperature, model_name=model)
        return llm    
        