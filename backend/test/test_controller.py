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
from .db.test_database import override_get_session

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