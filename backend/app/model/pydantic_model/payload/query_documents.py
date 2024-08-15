from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
# Extract entities from text
class Entities(BaseModel):
    """Identifying information about entities."""

    names: List[str] = Field(
        ...,
        description="""All the entities such as person, organization, business entities and so on that "
        "appear in the text""",
    )