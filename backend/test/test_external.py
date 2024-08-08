from unittest.mock import patch, AsyncMock
import pytest
from app.external.search_func import SearchFunction
from app.model.pydantic_model.data_model import SearchResult 

@pytest.mark.asyncio
@patch.object(SearchFunction, "_get_result_from_engine", new_callable=AsyncMock)
async def test_get_result(mock_get_result_from_engine):
    """Test to check the right query object is received.
    """
    list_of_dictionaries = [
    {"title":"Title", "link":"www.xyz.com", "snippet":"page snippet", "htmlSnippet":"page <b>snippet</b>", "pagemap":{"cse_thumbnail":[{"src":"www.xyz.com/src"}]}, "formattedUrl":"www.formatted.com"},
     {"title":"Title2", "link":"www.abc.com", "snippet":"page snippet2", "htmlSnippet":"page <b>snippet2</b>", "pagemap":{"no_cse_thumbanil":"random"}, "formattedUrl":"www.formatted2.com"}
    ]

    # mock response from get_result_from_engine
    mock_get_result_from_engine.return_value = list_of_dictionaries

    expected_result = [
        SearchResult(title="Title", link="www.xyz.com", snippet="page snippet", html_snippet="page <b>snippet</b>", thumbnail="www.xyz.com/src"),
        SearchResult(title="Title2", link="www.abc.com", snippet="page snippet2", html_snippet="page <b>snippet2</b>", thumbnail=None),
    ]

    query = "test"
    actual_result = await SearchFunction.get_result(query)
    assert actual_result == expected_result
    mock_get_result_from_engine.assert_awaited_once_with(query) # Assert mock is called with the correct arguments. assert_called_once_with(query) is also doing the same

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
    actual_result = await SearchFunction.get_result(query)
    assert actual_result == expected_result
    mock_get_result_from_engine.assert_awaited_once_with(query)