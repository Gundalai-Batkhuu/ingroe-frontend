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
from app.controller.doc_action import document_exists

# this makes a real call to the neo4j database to check the result
# we need to have the database running, plus the id might change in the development phase
# as we are deleting the old data when needed. So, look at these factors first if the test fails.
def test_document_exists_for_right_id():
    document_id = "7dbcc9ede1a24c5fb26d37fcf8da8fb7"
    actual_result = document_exists(document_id)
    assert actual_result == True

def test_document_exists_for_false_id():
    document_id = "123abc"
    actual_result = document_exists(document_id)
    assert actual_result == False   