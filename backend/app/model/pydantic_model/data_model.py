from pydantic import BaseModel, Field, model_validator
from typing import Any, Literal, List
from pydantic_extra_types.country import CountryShortName
from uuid import uuid4
from datetime import datetime

class SearchQuery(BaseModel):
    """Data Model for searching documents.

    This model performs the validation of the body in the client request.
    """
    query: str
    country: CountryShortName | None = None
    country_specific_search: bool 
    search_type: Literal["strict", "medium", "open"] = "strict"
    file_type: Literal["pdf", "docx"] | None = None
    mix: bool = False
    results : int = Field(default=5, ge=1, le=12)
    before: int | None = None
    after: int | None = None
    site: str | None = None

    @model_validator(mode="after")
    @classmethod
    def post_validator(cls, values: Any) -> Any:
        """
        checks if the combination of values passed as inputs are acceptable.

        raises Value Error if combination violates the expectation.
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
        if values.results == 1 and values.mix:
            raise ValueError("Cannot provide mix results for a single result.")
        if values.file_type is None and values.mix:
            raise ValueError("Must provide a file type if mix result is required.")
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
    links: List[str]
    document_alias: str = ""
    description: str = ""

class QueryDocument(BaseModel):
    """Data model for querying the document.
    """
    query: str 
    document_id: str    

class User(BaseModel):
    """Data model for creating the user in the user table.
    """
    name: str
    email: str
    user_id: str   

class DeleteDocument(BaseModel):
    """Data Model for deleting the document from all applicable databases and storage.
    """
    document_id: str
    user_id: str  
    
class DeleteCapturedFile(BaseModel):
    """Data Model for deleting the captured file from the storage and database.
    """         
    captured_document_id: str 
    file_ids: List[str]

class DeleteCapturedDocument(BaseModel):
    """Data Model for deleting the captured document from the storage and database.
    """  
    document_id: str       
    captured_document_id: str  

class CreateDocumentCapture(CreateDocument):
    """Data model for creating documents from captured document.

    It overrides the document id property to force users to pass the id.
    """ 
    document_id: str 

class DocumentInfo(BaseModel):
    """Data model for performing operations related to document info.
    """ 
    user_id: str
    document_id: str
    document_alias: str = ""
    description: str = ""  

class ShareDocument(BaseModel):
    """Data model for sharing the document.
    """  
    user_id: str
    document_id: str
    open_access: bool 
    validity: datetime | None = None
    accessor_emails: List[str] | None = None

    @model_validator(mode="after")
    @classmethod
    def post_validator(cls, values: Any) -> Any:
        """
        checks if the combination of values passed as inputs are acceptable.
        raises Value Error if combination violates the expectation.
        """
        open_access = values.open_access
        accessor_emails = values.accessor_emails
        
        if open_access is True and accessor_emails is not None:
            raise ValueError("Open access must be false when email list is provided.")
        if open_access is False and accessor_emails is None:
            raise ValueError("Email list must be provided when open access is disabled.")
        return values 

class AcceptSharedDocument(BaseModel):
    """Data model for accepting the shared document.
    """   
    email: str
    share_id: str
    user_id: str
    verification_token: str
    accept_time: datetime

class ValidityUpdate(BaseModel):
    """Data model for updating the validity. Down propagate indicates if the visibility need to be
    increased for the accessors too if the document has open to all access as false.
    """
    user_id: str
    document_id: str
    updated_validity: datetime
    down_propagate: bool = False

class ScopedValidityUpdate(ValidityUpdate):
    """Data model for updating the validity for a single user.
    """   
    user_email: str

class Access(BaseModel):
    """Data model for changing the access. If block access is true then we need to block
    the access. If it is false, then we need to open the access.
    """  
    document_id: str
    user_id: str
    access_change_reason: str  
    block_access: bool

class ScopedAccess(Access):
    """Data model for changing the access permission of users or a user.
    """ 
    share_id: str
    emails: List[str]  

class DocumentStatus(BaseModel):
    """Data model for operations related to getting the document status.
    """    
    document_id: str
    user_id: str

class DocumentSharingRemoval(BaseModel):
    """Data model for operations related to removing the sharing of the document.
    """    
    document_id: str
    user_id: str 
    current_timestamp: datetime   

class AccessorUpdate(BaseModel):
    """Data model for updating the accessor for a shared document.
    """   
    share_id: str
    document_id: str
    user_id: str
    accessor_email: str 
    
