import pytest
from pydantic import ValidationError
from app.model.pydantic_model.data_model import SearchQuery

def test_country_specific_false():
    """Test that the model raises an error if country is provided and country_specific_search is False."""
    with pytest.raises(ValueError) as excinfo:
        SearchQuery(query="hello", country_specific_search=False, country="Australia") 
    assert "If 'country' is provided, 'country_specific_search' must be True." in str(excinfo.value)