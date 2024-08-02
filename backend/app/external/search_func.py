from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
from typing import List, Tuple, Dict, Optional
from app.model.pydantic_model.data_model import SearchResult
import math
import re

load_dotenv()

class SearchFunction:
    """Functions related to searching the query.
    """
    google_api_key = os.getenv("GOOGLE_API_KEY")
    google_cse_id = os.getenv("GOOGLE_CSE_ID")

    @classmethod
    async def _get_result_from_engine(cls, query: str, **kwargs) -> List[dict]:
        """Returns raw results based on a search query from the engine.

        Args:
        query: Query string.

        Returns:
        A list containing a dictionary of search result properties.
        """
        service = build("customsearch", "v1", developerKey=cls.google_api_key)
        res = service.cse().list(q=query, cx=cls.google_cse_id, **kwargs).execute()
        return res["items"]
    
    @classmethod
    def _get_num_of_api_calls(cls, num_of_results: int) -> int:
        """Determines the number of api calls to make based on the number of results
        that users want to get from a search query. Single call can fetch only 10 results max.

        Args:
        num_of_results: Indicates the number of search results that a user want to get.

        Returns:
        The number of calls to make.
        """
        if num_of_results > 10:
            calls_to_make = math.ceil(num_of_results / 10)
            return calls_to_make
        calls_to_make = 1
        return calls_to_make
    
    @classmethod
    async def _get_total_results(cls, query: str, num_of_results: int, api_calls: int) -> List[dict]:
        """Based on the number of api calls to make and the total results an user want,
        the results will be appended to return the total result.

        Args:
        num_of_results: Indicates the number of search results that a user want to get.
        query: Query string.
        api_calls: Number of api calls to make.

        Returns:
        A complete list containing a dictionary of search result properties.
        """
        start_item = 1
        result_count = 10
        items_to_return = []
        while api_calls > 0:
            results = await cls._get_result_from_engine(query, start=start_item, num=result_count)
            items_to_return.extend(results)
            api_calls -= 1
            start_item += 10
            remaining_results = num_of_results - start_item + 1
            if 0 < remaining_results < 10:
                result_count = remaining_results
        return items_to_return   

    @classmethod
    def _get_query_without_file(cls, query: str) -> str:
        """Provides a search query without a fitletype.

        Args:
        query: Query string.

        Returns:
        A query strig without the filetype.
        """
        return re.sub(r'\s*filetype:[^\s]+', "", query).strip()
    
    @classmethod
    def _get_divided_result_count(cls, num_of_result: int) -> Tuple[int, int]:
        """Divides the number of results that users wanna fetch into filetype results
        and normal page results.

        Args:
        num_of_results: Indicates the number of search results that a user want to get.

        Returns:
        A tuple containing the number of results for file type and non file type results.
        """
        count_non_file = math.ceil(num_of_result/2)
        count_file = num_of_result - count_non_file
        return count_non_file, count_file

    @classmethod
    async def _get_final_results(cls, query: str, num_of_results: int, api_calls: int, mix_result: Optional[bool]) -> List[dict]:
        """
        Provides a final result from the search operation. The final result is dictated by
        the number of api calls to make, type of results required whether it is mixed
        or homogenoeus.

        Args:
        num_of_results: Indicates the number of search results that a user want to get.
        query: Query string.
        api_calls: Number of api calls to make.
        mix_result: A boolean value to indicate if mix of file type and non file type is preferred.

        Returns:
        A complete list containing a dictionary of search result properties.
        """
        if mix_result == True:
            non_file_query = cls._get_query_without_file(query)
            count_non_file, count_file = cls._get_divided_result_count(num_of_results)
            non_file_result = await cls._get_result_from_engine(non_file_query, start=1, num=count_non_file)
            file_result = await cls._get_result_from_engine(query, start=1, num=count_file)
            non_file_result.extend(file_result)
            return non_file_result
        return await cls._get_total_results(query, num_of_results, api_calls)
    
    @classmethod
    async def get_result(cls, query: str, num_of_results: int, mix_result: Optional[bool]) -> List[SearchResult]:
        """Returns formatted results based on a search query. If exception or error occurs it
        returns an empty list.

        Args:
        query: Query string.
        num_of_results: Number of search results that users wanna fetch.

        Returns:
        A list containing a dictionary of search result properties
        """
        num_of_api_calls = cls._get_num_of_api_calls(num_of_results)
        results = await cls._get_final_results(query, num_of_results, num_of_api_calls, mix_result)
        print(f"length of search result is {len(results)}")
        formatted_results = []
        try:
            for result in results:
                thumbnail = None
                cse_thumbnail = result.get("pagemap", {}).get("cse_thumbnail", None)
                if cse_thumbnail: thumbnail = cse_thumbnail[0].get("src")
                link = result.get("link", None)
                snippet = result.get("snippet", None)
                html_snippet = result.get("htmlSnippet", None)
                title = result.get("title", None)
                condensed_result = SearchResult(title=title, link=link, thumbnail=thumbnail, snippet=snippet, html_snippet=html_snippet)
                formatted_results.append(condensed_result)
            return formatted_results
        except Exception as e:
            print(e)
            return [SearchResult()]