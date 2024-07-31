from pydantic import BaseModel, Field, model_validator
from typing import Any, Literal
from pydantic_extra_types.country import CountryShortName

class SearchQuery(BaseModel):
    """
    Data Model for searching documents.

    This model performs the validation of the body in the client request.
    """
    query: str
    country: CountryShortName | None = None
    country_specific_search: bool 
    search_type: Literal["strict", "medium", "open"] = "strict"
    pdf_only: bool = False
    mix: bool = False
    results : int = Field(default=5, ge=1, le=15)
    before: int | None = None
    after: int | None = None

    @model_validator(mode="after")
    @classmethod
    def check_country_specific(cls, values: Any) -> Any:
        """
        checks if the combination of country and country specific search is acceptable 

        raises Value Error if combination violates the expectation
        """
        country = values.country
        country_specific_search = values.country_specific_search

        # print(country, country_specific_search)
        
        if country is None and country_specific_search:
            raise ValueError("If 'country' is None, 'country_specific_search' must be False.")
        if country is not None and not country_specific_search:
            raise ValueError("If 'country' is provided, 'country_specific_search' must be True.")
        if values.before is not None and values.after is not None:
            raise ValueError("Cannot have before and after date set for a search query.")
        return values 