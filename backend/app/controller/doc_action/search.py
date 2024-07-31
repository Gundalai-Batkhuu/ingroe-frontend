from pydantic import BaseModel
from ..core import APIEndPoint
from ...model.pydantic_model.data_model import SearchQuery
import pycountry
from typing import Optional
from app.external.search_func import SearchFunction

class Search(APIEndPoint):
    # class_var: str = "xyz"

    @classmethod
    def _get_prefix(cls, country: Optional[str], search_type: str, site: Optional[str]) -> str:
        """Generates the prefix for the search query to narrow the search
        
        Args:
        country: The name of a country.
        search_type: The type of search to determine if we want to search for government sites,
        educational sites or open.

        Returns:
        A prefix which is a string.
        """
        prefix = "site:"
        if site is not None:
            return f"{prefix}*.{site} "
        if search_type == "strict":
            domain = "*.gov"
            if country != "United States": 
                country = pycountry.countries.lookup(country)
                country_code = country.alpha_2.lower()
                domain = f"{domain}.{country_code}"
            prefix = f"{prefix}{domain} "    
            return prefix
        if search_type == "medium":
            domain = "*.edu"
            if country != "United States": 
                country = pycountry.countries.lookup(country)
                country_code = country.alpha_2.lower()
                domain = f"{domain}.{country_code}"
            prefix = f"{prefix}{domain} "    
            return prefix
        return ""
    
    @classmethod
    def _get_time_suffix(cls, before: Optional[int], after: Optional[int]) -> str:
        """Generates a string that is used in search query to get result before or 
        after a period.

        Args:
        before: Year in integer or none, after: Year in integer or none

        Returns:
        A time suffix which can be attached to the search query.

        """
        suffix = ""
        if before is not None:
            suffix = f" BEFORE:{before}"
            return suffix
        if after is not None:
            suffix = f" AFTER:{after}"
            return suffix
        return suffix
    
    @classmethod
    def _get_file_suffix(cls, file_type: Optional[str]) -> str:
        """Generates a string containing a file type if it is provided by the client.
        
        Args:
        file_type: A string indicating a file type such as pdf, docs, etc.
    
        Returns:
        A string containing a file type or an empty string.
        """
        suffix = ""
        if file_type is not None:
            suffix = file_type
        return suffix    


    @classmethod
    def _process_input(cls, queryObject: SearchQuery) -> str:
        """Implementation of the base method to create a final search string.

        Args:
        queryObject: An object that contains all info about a query.

        Returns:
        A string that represents a complete search query.
        """
        prefix = cls._get_prefix(queryObject.country, queryObject.search_type, queryObject.site)
        time_suffix = cls._get_time_suffix(queryObject.before, queryObject.after)
        file_suffix = cls._get_file_suffix(queryObject.file_type)
        search_query = f"{prefix}{queryObject.query}{time_suffix} {file_suffix}"
        return search_query

    @classmethod
    async def search_documents(cls, queryObject: SearchQuery):
        search_query = cls._process_input(queryObject)
        print(search_query)
        results = await SearchFunction.get_result(search_query)
        return results