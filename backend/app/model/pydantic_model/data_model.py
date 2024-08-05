from pydantic import BaseModel, Field, model_validator
from typing import Any, Literal
from pydantic_extra_types.country import CountryShortName
from uuid import uuid4

class SearchQuery(BaseModel):
    """Data Model for searching documents.

    This model performs the validation of the body in the client request.
    """
    query: str
    country: CountryShortName | None = None
    country_specific_search: bool 
    search_type: Literal["strict", "medium", "open"] = "strict"
    file_type: str | None = None
    mix: bool = False
    results : int = Field(default=5, ge=1, le=20)
    before: int | None = None
    after: int | None = None
    site: str | None = None

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
    
class SearchResult(BaseModel):
    """Data model for search result that is returned from the search query.
    """
    title: str | None = None
    thumbnail: str | None = None
    snippet: str | None = None
    html_snippet: str | None = None
    link: str | None = None

class CreateDocument(BaseModel):
    """Data model for creating documents.

    It checks if the payload submitted conforms to the required format before
    creating documents.
    """    
    user_id: str
    document_id: str= Field(default_factory=lambda: uuid4().hex) # create automatic id
    link: str
    requires_asset_download: bool = False