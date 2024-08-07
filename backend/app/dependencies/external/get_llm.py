from typing import Union
from langchain_groq import ChatGroq 
from langchain_openai import ChatOpenAI

class LLM():
    def __init__(
            self,
            model: str,
            temperature: Union[float, int] = 0,
        ):
        if not (0 <= temperature <= 1):
            raise ValueError("The temperature must be between 0 and 1 inclusive.")  
        self.temperature = temperature  
        self.model = model

    def get_groq(self) -> ChatGroq:
        llm = ChatGroq(temperature=self.temperature, model=self.model) 
        return llm
    
    def get_openai(self) -> ChatOpenAI:
        llm = ChatOpenAI(temperature=self.temperature, model_name=self.model)
        return llm
        