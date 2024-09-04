from app.controller.doc_action.search import Search
from app.model.pydantic_model import SearchQuery
import pytest

# --- doc_action -> search.py ---
@pytest.fixture
def query_object():
    """Get a class containing the search query.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, search_type="strict")
    return query_object

def test_get_final_search_query_site():
    """Test if the search string has an expected format if the site address is provided.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, site="ato.gov.au")
    expected_query = "site:*.ato.gov.au tax return"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'"

def test_get_final_search_query_strict(query_object: SearchQuery):
    """Test if the search string has an expected format if the search type is strict.
    """
    expected_query = "site:*.gov.au tax return"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'" 

def test_get_final_search_query_medium():
    """Test if the search string has an expected format if the search type is medium.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, search_type="medium")
    expected_query = "site:*.edu.au tax return"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'" 

def test_get_final_search_query_open():
    """Test if the search string has an expected format if the search type is open.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, search_type="open")
    expected_query = "tax return"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'" 

def test_get_final_search_query_us():
    """Test if the search string has an expected format if the country is United States.
    """
    query_object = SearchQuery(query="tax return", country="United States", country_specific_search=True)
    expected_query = "site:*.gov tax return"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'"

def test_get_final_search_query_time():
    """Test if the search string has an expected format if time related field is provided.
    """
    query_object = SearchQuery(query="tax return", country="United States", country_specific_search=True, before=2015)
    expected_query = "site:*.gov tax return BEFORE:2015"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'"

def test_get_final_search_query_file():
    """Test if the search string has an expected format if file is provided.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, file_type="pdf")
    expected_query = "site:*.gov.au tax return filetype:pdf"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'"

def test_get_final_search_query_all():
    """Test if the search string has an expected format if all fields that can change the 
    query is passed to create a query object.
    """
    query_object = SearchQuery(query="tax return", country="Australia", country_specific_search=True, file_type="pdf", after=2019)
    expected_query = "site:*.gov.au tax return AFTER:2019 filetype:pdf"
    actual_query = Search.get_final_search_query(query_object=query_object)
    assert actual_query == expected_query, f"Expected '{expected_query}' but got '{actual_query}'"        

# --- doc_action -> create_document.py ---
from app.controller.doc_action import document_exists, Create
from .db.test_database import override_get_session
from unittest.mock import patch
from app.dependencies.internal import GetDocument
from .module.graph import document, file_map
from app.model.pydantic_model.payload import DocumentSource
from io import BytesIO
from fastapi import UploadFile

@pytest.fixture
def id_map():
    """Provides a dictionary that maps to various ids."""
    id_map = {
        "correct_document_id": "test_document_123",
        "correct_user_id": "test_123",
        "incorrect_document_id": "123abc",
        "incorrect_user_id": "zzz"
    }
    return id_map

def test_document_exists_for_right_ids(id_map, test_db):
    """Test if the document exists if we supply the correct document_id and the user_id.
    """
    db = override_get_session()
    try:
        document_id = id_map.get("correct_document_id")
        user_id = id_map.get("correct_user_id")
        actual_result = document_exists(document_id, user_id, db)
        assert actual_result == True
    finally:
        db.close()

def test_document_exists_for_false_document_id(id_map, test_db):
    """Test if the document exists if we supply the incorrect document_id and the right user_id.
    """
    db = override_get_session()
    try:
        document_id = id_map.get("incorrect_document_id")
        user_id = id_map.get("correct_user_id")
        actual_result = document_exists(document_id, user_id, db)
        assert actual_result == False  
    finally:
        db.close()    

def test_document_exists_for_false_user_id(id_map, test_db):
    """Test if the document exists if we supply the correct document_id and incorrect user_id.
    """
    db = override_get_session()
    try:
        document_id = id_map.get("correct_document_id")
        user_id = id_map.get("incorrect_user_id")
        actual_result = document_exists(document_id, user_id, db)
        assert actual_result == False
    finally:
        db.close()           

def test_document_exists_for_both_false_ids(id_map, test_db):
    """Test if the document exists if we supply false ids for both document and user.
    """
    db = override_get_session()
    try:
        document_id = id_map.get("incorrect_document_id")
        user_id = id_map.get("incorrect_user_id")
        actual_result = document_exists(document_id, user_id, db)
        assert actual_result == False         
    finally:
        db.close() 

@pytest.fixture()
def get_links():
    """Fixture to provide links."""
    links = ["https://python.langchain.com/v0.1/docs/modules/data_connection/document_loaders/markdown/",
"https://python.langchain.com/v0.2/docs/integrations/document_loaders/async_chromium/",
"https://python.langchain.com/v0.1/docs/modules/data_connection/document_loaders/"]
    return links

@pytest.mark.asyncio
@patch.object(GetDocument, "handle_link")
@patch.object(Create, "create_document_from_links")
async def test_create_documents_from_selection(mock_create_document_from_links ,mock_handle_link, get_links):
    """Test if the documents are created from links."""
    mock_handle_link.return_value = 2
    mock_create_document_from_links.return_value = document
    expected_source = DocumentSource(vanilla_links=get_links, file_links=[], error_links=[], unscrapable_links=[], unsupported_file_links=[])
    docs, source = await Create.create_documents_from_selection(get_links, "test_123")
    assert docs == document
    assert source == expected_source

def create_upload_file(filename: str, content: bytes) -> UploadFile:
    """Create a mock upload file.

    Args:
    filename (str): The name of the mock upload file.
    content (bytes): The content of the file.

    Returns:
    UploadFile: The FastAPI UploadFile object.
    """
    file = BytesIO(content)
    return UploadFile(filename=filename, file=file)

@pytest.mark.asyncio
@patch.object(GetDocument, "get_document_from_file")   
async def test_create_document_from_file(mock_get_document_from_file):
    """Test if the document is created from a file.
    """
    mock_get_document_from_file.return_value = document, file_map
    file = create_upload_file("filename", b"dummy content")
    actual_document, actual_file_map = await Create.create_document_from_file(file=file, user_id="test_123", document_id="test_doc_123")
    assert actual_document == document
    assert actual_file_map == file_map

@pytest.mark.asyncio
@patch.object(Create, "create_document_from_file")
@patch.object(Create, "create_documents_from_selection")
async def test_create_documents_from_both_links_and_files(mock_create_documents_from_selection, mock_create_document_from_file, get_links):
    """Test the document creation from both files and links.
    """
    source = DocumentSource(vanilla_links=get_links, file_links=[], error_links=[], unscrapable_links=[], unsupported_file_links=[])
    mock_create_document_from_file.return_value = document, file_map
    mock_create_documents_from_selection.return_value = document, source
    file = create_upload_file("filename", b"dummy content")
    expected_source = DocumentSource(vanilla_links=get_links, file_links=[], error_links=[], unscrapable_links=[], unsupported_file_links=[], files=[file_map])
    expected_documents = document + document
    actual_documents, actual_source = await Create.create_documents_from_both_links_and_files(file, get_links,"test_123", "test_doc_123")
    assert actual_documents == expected_documents
    assert actual_source == expected_source
