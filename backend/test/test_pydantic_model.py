import pytest
from pydantic import ValidationError
from app.model.pydantic_model.data_model import SearchQuery

def test_country_not_none_css_false():
    """Test that the model raises an error if country is provided and country_specific_search is False."""
    with pytest.raises(ValueError) as excinfo:
        SearchQuery(query="hello", country_specific_search=False, country="Australia") 
    assert "If 'country' is provided, 'country_specific_search' must be True." in str(excinfo.value)

def test_country_none_css_true():
    """Test that the model raises an error if country is not provided and country_specific_search is True."""
    with pytest.raises(ValueError) as excinfo:
        SearchQuery(query="hello", country_specific_search=True) 
    assert "If 'country' is None, 'country_specific_search' must be False." in str(excinfo.value)

def test_before_after_date():
    """
    Test if both after and before date is set.
    """     
    with pytest.raises(ValueError) as excinfo:
        SearchQuery(query="hello", country_specific_search=True, country="Australia", before=2015, after=2010) 
    assert "Cannot have before and after date set for a search query." in str(excinfo.value)    