from typing import Union
from langchain_groq import ChatGroq 
from langchain_openai import ChatOpenAI

class LLM():
    """Provides an option to select the type of llm model.

    Parameters:
    model (str): The name of model to be used.
    temperature (Union[float, int]): The parameter to specify the temperature to control randomness
    of the output token from the model.
    """
    def __init__(
            self,
            model: str,
            temperature: Union[float, int] = 0,
        ):
        """If temperature is outside the range of 0 and 1, it throws an error."""
        if not (0 <= temperature <= 1):
            raise ValueError("The temperature must be between 0 and 1 inclusive.")  
        self.temperature = temperature  
        self.model = model

    def get_groq(self) -> ChatGroq:
        """Get the llm model from groq."""
        llm = ChatGroq(temperature=self.temperature, model=self.model) 
        return llm
    
    def get_openai(self) -> ChatOpenAI:
        """Get the llm model of choice from OpenAI."""
        llm = ChatOpenAI(temperature=self.temperature, model_name=self.model)
        return llm
        