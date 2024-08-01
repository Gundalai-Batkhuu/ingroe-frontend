from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
from typing import List
from app.model.pydantic_model.data_model import SearchResult

load_dotenv()

class SearchFunction:
    """Functions related to searching the query.
    """
    google_api_key = os.getenv("GOOGLE_API_KEY")
    google_cse_id = os.getenv("GOOGLE_CSE_ID")

    @classmethod
    async def _get_result_from_engine(cls, query: str) -> List[dict]:
        """Returns raw results based on a search query from the engine.

        Args:
        Query string.

        Returns:
        A list containing a dictionary of search result properties
        """
        service = build("customsearch", "v1", developerKey=cls.google_api_key)
        res = service.cse().list(q=query, cx=cls.google_cse_id).execute()
        return res["items"]
    
    @classmethod
    async def get_result(cls, query: str) -> List[SearchResult]:
        """Returns formatted results based on a search query. If exception or error occurs it
        returns an empty list.

        Args:
        Query string.

        Returns:
        A list containing a dictionary of search result properties
        """
        results = await cls._get_result_from_engine(query)
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