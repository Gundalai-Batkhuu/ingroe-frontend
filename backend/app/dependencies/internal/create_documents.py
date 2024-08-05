from langchain_community.document_loaders import AsyncChromiumLoader
from typing import List, AsyncIterator, Sequence, Tuple, Any
from langchain_core.documents import Document
from langchain_community.document_transformers import Html2TextTransformer
from langchain_community.document_transformers import BeautifulSoupTransformer
import asyncio
import requests
from urllib.parse import urlparse
import mimetypes
from app.utils.utils import (get_root_directory, generate_unique_string, get_file_type_by_extension)
import os

class GetDocument:
    """Get the sequence of documents from the provided link or file.
    """
    allowed_file_types: List[str] = ["pdf", "md", "docx"]
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
    
    @classmethod
    def is_downloadable(cls, response: Any, url: str) -> bool:
        """Check if the provided url is a downloadable by either cjhecking the file extension, content 
        type, content disposition. 

        Args:
        response: A response object from the server.
        url: A string representing the link.

        Return:
        A boolean value indicating if the link is downloadable.
        """
        content_type = response.headers.get("Content-Type", "").lower()
        if "application/" in content_type or "binary/" in content_type:
            return True
        content_disposition = response.headers.get("Content-Disposition", "").lower()
        if "attachment" in content_disposition or "filename" in content_disposition:
            return True
        parsed_url = urlparse(url)
        file_extension = mimetypes.guess_type(parsed_url.path)[0]
        if file_extension and file_extension.startswith(("application/", "binary/")):
            return True
        
    @classmethod    
    def download_file(cls, url: str, file_path: str) -> None:
        """Download a file from a URL and save it to the specified path."""
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"File downloaded and saved to {file_path}")
        else:
            print("Failed to download file. HTTP Status Code:", response.status_code)

    @classmethod
    def get_file_path(cls, parent_folder: str, folder_name: str, file_extension: str) -> str:
        """Returns the file path where the downloaded file will reside.

        Args:
        parent_folder: Parent folder name.
        folder_name: Folder name for the downloaded file.
        file_extension: Extension of the downloaded file.

        Return:
        The complete path of where the downloaded file resides.
        """
        root = get_root_directory()
        folder_path = os.path.join(root, parent_folder, folder_name)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        file_name = generate_unique_string()
        file_path = os.path.join(folder_path, file_name)
        complete_path = f"{file_path}.{file_extension}"
        return complete_path  

    @classmethod
    def get_file_extension_from_headers(cls, response: Any) -> str:
        """Get the file extension based on the Content-Type header.
        
        Args:
        response: A response object from the server.

        Returns:
        A string representing the file extension.
        """
        content_type = response.headers.get("Content-Type", "")
        content_type_map = {
            "application/pdf": "pdf",
            "text/markdown": "md",
        }
        # Return the file extension or 'unknown' if not found
        return content_type_map.get(content_type, "unknown")
    
    @classmethod
    def get_file_extension(cls, response: Any, url: str) -> str:
        """Gives the file extension from the link. It tries to get the file extension from the header
        first and then only tries to retrieve from the file extension.

        Args:
        response: A response object from the server.
        url: A string representing the link.

        Returns:
        A string representing the file extension.
        """
        file_extension = cls.get_file_extension_from_headers(response)
        if file_extension == "unknown":
            file_extension = get_file_type_by_extension(url)
        return file_extension   

    @classmethod
    def handle_link(cls, url: str):
        """Check if the link points to a downloadable file. If so, download it.
        
        Args:
        url: A string representing the link.
        """
        try:
            response = requests.head(url, allow_redirects=True, timeout=5)
            is_downloadable = cls.is_downloadable(response, url)
            if is_downloadable:
                file_extension = cls.get_file_extension(response, url)
                if file_extension in cls.allowed_file_types:
                    file_path = cls.get_file_path("files", "usr", file_extension)
                    cls.download_file(url, file_path)    
            else:
                print("The link is a normal link with no download option.")
        except Exception as e:
            # raise error here if needed
            print(f"An error occurred: {e}")

if __name__ == "__main__":  
    # html = asyncio.run(GetDocument.get_document_from_link(["https://python.langchain.com/v0.1/docs/integrations/document_loaders/async_chromium/"]))
    # print(html)   
    GetDocument.handle_link("https://pepa.holla.cz/wp-content/uploads/2016/12/Introduction-to-React.pdf")