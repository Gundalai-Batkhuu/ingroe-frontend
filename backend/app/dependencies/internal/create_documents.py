from langchain_community.document_loaders import AsyncChromiumLoader
from typing import List, AsyncIterator, Sequence
from langchain_core.documents import Document
from langchain_community.document_transformers import Html2TextTransformer
from langchain_community.document_transformers import BeautifulSoupTransformer
import asyncio

class GetDocument:
    """Get the sequence of documents from the provided link or file.
    """
    @classmethod
    async def _get_html_document_from_link(cls, links: List[str]) -> AsyncIterator[Document]:
        """Scrapes the given link or page and provide the sequence of documents.

        Args:
        link: A string of page urls.

        Return:
        A list or sequence of Document object
        """
        loader = AsyncChromiumLoader(links, user_agent="MyAppUserAgent")
        html = await loader.aload()
        return html
    
    @classmethod
    async def get_document_from_link(cls, links: List[str]) -> Sequence[Document]:
        """Scrapes the given link or page and provide the sequence of documents.

        Args:
        link: A string of page urls.

        Return:
        A list or sequence of Document object
        """
        # transformer = Html2TextTransformer()
        transformer = BeautifulSoupTransformer()
        html = await cls._get_html_document_from_link(links)
        transformed_docs = transformer.transform_documents(html, tags_to_extract=["span", "p", "li", "div", "a"]) #atransform_documents is not implemented yet
        return transformed_docs

# if __name__ == "__main__":  
#     html = asyncio.run(GetDocument.get_document_from_link(["https://python.langchain.com/v0.1/docs/integrations/document_loaders/async_chromium/"]))
#     print(html)   