from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
# Extract entities from text
class Entities(BaseModel):
    """Identifying information about entities."""

    names: List[str] = Field(
        ...,
        description="""All the person, organization, streets and entities related to geographical 
        information, financial information, time and dates, legal information, products or services, 
         medical information, events, cultural and media references, technical information and 
          miscellaneous information that appear in the text""",
    )