from unittest.mock import patch, AsyncMock
import pytest
from app.dependencies.external.search_func import SearchFunction
from app.model.pydantic_model.data_model import SearchResult 

@pytest.fixture
def get_dictionary():
    """Get a dictionary that contains the properties returned by the mock call.
    """
    list_of_dictionaries = [
    {"title":"Title", "link":"www.xyz.com", "snippet":"page snippet", "htmlSnippet":"page <b>snippet</b>", "pagemap":{"cse_thumbnail":[{"src":"www.xyz.com/src"}]}, "formattedUrl":"www.formatted.com"},
     {"title":"Title2", "link":"www.abc.com", "snippet":"page snippet2", "htmlSnippet":"page <b>snippet2</b>", "pagemap":{"no_cse_thumbanil":"random"}, "formattedUrl":"www.formatted2.com"}
    ]
    return list_of_dictionaries

@pytest.fixture
def get_expected_result():
    """Get the expected result from a function that formats the mock call result.
    """
    expected_result = [
        SearchResult(title="Title", link="www.xyz.com", snippet="page snippet", html_snippet="page <b>snippet</b>", thumbnail="www.xyz.com/src"),
        SearchResult(title="Title2", link="www.abc.com", snippet="page snippet2", html_snippet="page <b>snippet2</b>", thumbnail=None),
    ]
    return expected_result

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result(mock_get_result_from_engine, get_dictionary, get_expected_result):
    """Test to check the right query object is received.
    """

    # mock response from get_result_from_engine
    mock_get_result_from_engine.return_value = get_dictionary
    expected_result = get_expected_result

    query = "test"
    actual_result = await SearchFunction.get_result(query, 5, False)
    assert actual_result == expected_result
    mock_get_result_from_engine.assert_awaited_once_with(query, start=1, num=5) # Assert mock is called with the correct arguments. assert_called_once_with(query) is also doing the same

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result_multiple_api_calls(mock_get_result_from_engine, get_dictionary, get_expected_result):
    """Test to check if the right query object is received. This is for the scenario when 
    the number of api calls is more than 1. This happens when the number of results users wanna 
    retrieve is greater than 10.
    """
    mock_get_result_from_engine.return_value = get_dictionary
    call_result = get_expected_result
    expected_result = call_result + call_result
    query = "test"
    actual_result = await SearchFunction.get_result(query, 12, False)
    assert actual_result == expected_result

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result_missing_keys(mock_get_result_from_engine):
    """Test to check a condition when there is missing propertlies like
    missing links, pagemaps, titles, snippets and htmlSnippets
    """
    list_of_dictionaries = [
    {"title":"Title", "snippet":"page snippet", "htmlSnippet":"page <b>snippet</b>", "pagemap":{"cse_thumbnail":[{"src":"www.xyz.com/src"}]}, "formattedUrl":"www.formatted.com"},
    {"title":"Title2", "link":"www.abc.com", "snippet":"page snippet2", "htmlSnippet":"page <b>snippet2</b>", "formattedUrl":"www.formatted2.com"},
    {"link":"www.abc.com", "snippet":"page snippet2", "htmlSnippet":"page <b>snippet2</b>", "formattedUrl":"www.formatted2.com"},
    {"formattedUrl":"www.formatted2.com"},
    ]

    mock_get_result_from_engine.return_value = list_of_dictionaries
    expected_result = [
        SearchResult(title="Title", link=None, snippet="page snippet", html_snippet="page <b>snippet</b>", thumbnail="www.xyz.com/src"),
        SearchResult(title="Title2", link="www.abc.com", snippet="page snippet2", html_snippet="page <b>snippet2</b>", thumbnail=None),
        SearchResult(title=None, link="www.abc.com", snippet="page snippet2", html_snippet="page <b>snippet2</b>", thumbnail=None),
        SearchResult(title=None, link=None, snippet=None, html_snippet=None, thumbnail=None),
    ]
    query = "test"
    actual_result = await SearchFunction.get_result(query, 5, False)
    assert actual_result == expected_result
    mock_get_result_from_engine.assert_awaited_once_with(query, start=1, num=5)

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result_mix_results(mock_get_result_from_engine, get_dictionary, get_expected_result):
    """Test to check if the right query object is received. This is for the scenario when users
    want to receive a mix of results containing file based and non file based results.
    """
    mock_get_result_from_engine.return_value = get_dictionary
    call_result = get_expected_result
    expected_result = call_result + call_result
    query = "test"
    actual_result = await SearchFunction.get_result(query, 12, True)
    assert actual_result == expected_result   

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result_num_of_result_is_10(mock_get_result_from_engine, get_dictionary, get_expected_result):
    """Test to check if the number of results wanted is 10. In this case, the call to the mock 
    function must receive 10 as a number of results. This will mainly check if the mock call is 
    made with the right argument.
    """
    mock_get_result_from_engine.return_value = get_dictionary
    expected_result = get_expected_result
    query = "test"
    actual_result = await SearchFunction.get_result(query, 10, False)
    assert actual_result == expected_result     
    mock_get_result_from_engine.assert_awaited_once_with(query, start=1, num=10) 