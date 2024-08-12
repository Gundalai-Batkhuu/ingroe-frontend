from langchain_community.document_loaders import AsyncChromiumLoader
from typing import List, AsyncIterator, Sequence, Tuple, Any, Literal, Optional
from langchain_core.documents import Document
from langchain_community.document_transformers import Html2TextTransformer
from langchain_community.document_transformers import BeautifulSoupTransformer
import asyncio
import requests
from urllib.parse import urlparse
import mimetypes
from app.utils.utils import (get_root_directory, generate_unique_string, get_file_type_by_extension, get_current_directory)
import os
from langchain_community.document_loaders import (PyPDFLoader, UnstructuredMarkdownLoader, Docx2txtLoader)
from fastapi import UploadFile

class GetDocument:
    """Get the sequence of documents from the provided link or file.
    """
    allowed_file_types: List[str] = ["pdf", "docx"]
    additional_allowed_files: List[str] = ["md"]
    content_type_map = {
            "application/pdf": "pdf",
            "text/markdown": "md",
        }
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
    async def get_document_from_links(cls, links: List[str]) -> Sequence[Document]:
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
    def _is_downloadable(cls, response: Any, url: str) -> bool:
        """Check if the provided url is a downloadable by either checking the file extension, content 
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
        if "attachment" in content_disposition:
            return True
        parsed_url = urlparse(url)
        file_extension = mimetypes.guess_type(parsed_url.path)[0]
        if file_extension and file_extension.startswith(("application/", "binary/")):
            return True
        return False
        
    @classmethod    
    def _download_file(cls, url: str, file_path: str) -> None:
        """Download a file from a URL and save it to the specified path.

        Args:
        url: A string representing the link.
        file_path: The path where the downloaded file resides.
        """
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"File downloaded and saved to {file_path}")
        else:
            print("Failed to download file. HTTP Status Code:", response.status_code)

    @classmethod
    def _get_file_path(cls, parent_folder: str, folder_name: str, file_extension: str) -> str:
        """Returns the file path where the downloaded file will reside.

        Args:
        parent_folder: Parent folder name.
        folder_name: Folder name for the downloaded file based on the user id which is unique.
        file_extension: Extension of the downloaded file.

        Return:
        The complete path where the downloaded file resides.
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
    def _get_file_extension_from_headers(cls, response: Any) -> str:
        """Get the file extension based on the Content-Type header.
        
        Args:
        response: A response object from the server.

        Returns:
        A string representing the file extension.
        """
        content_type = response.headers.get("Content-Type", "")
        # Return the file extension or 'unknown' if not found
        return cls.content_type_map.get(content_type, "unknown")
    
    @classmethod
    def _get_file_extension(cls, path: str, response: Optional[Any] = None, file: Optional[UploadFile] = None) -> str:
        """Gives the file extension from the link. It tries to get the file extension from the header
        first and then only tries to retrieve from the file extension.

        Args:
        response: A response object from the server.
        path: A string representing the link or the file name.
        file: Uploaded file by the client.

        Returns:
        A string representing the file extension.
        """
        file_extension = "unknown"
        if response is not None:
            file_extension = cls._get_file_extension_from_headers(response)
        if file is not None:
            file_extension = cls._get_file_extension_from_file(file)    
        if file_extension == "unknown":
            file_extension = get_file_type_by_extension(path)
        return file_extension 

    @classmethod
    def _get_file_extension_from_file(cls, file: UploadFile) -> str:
        """Get the file extension based on the Content-Type from the file.
        
        Args:
        file: Uploaded file by the client.

        Returns:
        A string representing the file extension.
        """
        content_type = file.content_type
        return cls.content_type_map.get(content_type, "unknown")

    @classmethod
    def handle_link(cls, url: str, user_id: str) -> List[Document] | int:
        """Check if the link points to a downloadable file. If so, download it.
        
        Args:
        url: A string representing the link.
        user_id: Id of the user passing the link.

        Returns:
        List[Document] | int: A list of documents created from the file type detected 
        or -1 if the link is a normal link without downloadables
        or 0 if the downloadable file is not allowed to download
        or 2 if error occurs.
        """
        try:
            response = requests.head(url, allow_redirects=True, timeout=5)
            is_downloadable = cls._is_downloadable(response, url)
            if is_downloadable:
                file_extension = cls._get_file_extension(path=url, response=response)
                if file_extension in cls.allowed_file_types:
                    file_path = cls._get_file_path("files", user_id, file_extension)
                    cls._download_file(url, file_path)
                    return cls.create_documents_from_store(file_extension, file_path) 
                else:
                    return 0  
            else:
                return -1
        except Exception as e:
            # raise error here if needed
            print(f"An error occurred: {e}")
            return 2

    @classmethod
    def create_documents_from_store(cls, file_extension: str, file_path: str) -> List[Document]:
        """Create documents from the stored file.

        Args:
        file_extension: Extension of the downloaded file.
        file_path: The path where the downloaded file resides.

        Returns:
        List[Document]: A list of documents created from the specified file.
        """
        if file_extension == "pdf":
            return cls.get_documents_from_pdf(file_path)
        if file_extension == "md":
            cls.get_document_from_md(file_path)
            return
        if file_extension == "docx":
            cls.get_document_from_docx(file_path)
            return

    @classmethod
    def get_documents_from_pdf(cls, file_path: str) -> List[Document]:
        """Creates document from pdf file.

        Args:
        file_path: The path where the downloaded file resides.

        Returns:
        List[Document]: A list of documents created from the pdf file.
        """
        loader = PyPDFLoader(file_path)
        return loader.load_and_split()

    @classmethod
    def get_document_from_md(cls, file_path: str) -> List[Document]:
        """Creates document from markdown file.

        Args:
        file_path: The path where the downloaded file resides.

        Returns:
        List[Document]: A list of documents created from the markdown file.
        """
        loader = UnstructuredMarkdownLoader(file_path)
        return loader.load()

    @classmethod
    def get_document_from_docx(cls, file_path: str) -> List[Document]:
        """Creates document from docx or word file.

        Args:
        file_path: The path where the downloaded file resides.

        Returns:
        List[Document]: A list of documents created from the docx or word file.
        """
        loader = Docx2txtLoader(file_path)
        return loader.load()

    @classmethod
    async def _upload_file(cls, file_path: str, uploaded_file: UploadFile) -> None:
        """Stores the uploaded file in the designated file path.

        Args:
        file_path: The path where the uploaded file resides.
        file: Uploaded file by the client.
        """
        with open(file_path, "wb") as file:
            content = await uploaded_file.read()
            file.write(content)
        print(f"File uploaded and saved to {file_path}")

    @classmethod
    async def get_document_from_file(cls, file: UploadFile, user_id: str) -> List[Document] | int:
        """Creates a sequence of document from the uploaded file.

        Args:
        file: Uploaded file by the client.
        user_id: Id of the user uploading the file.

        Returns:
        Sequence[Document] | int: A list or sequence of documents or -1 if the file is
        outside of the downloadable file types.
        """
        full_allowed_list = cls.allowed_file_types + cls.additional_allowed_files
        file_extension = cls._get_file_extension(path=file.filename, file=file)
        if file_extension in full_allowed_list:
            file_path = cls._get_file_path("files", user_id, file_extension)
            await cls._upload_file(file_path, file)
            return cls.create_documents_from_store(file_extension, file_path)
        else: 
            return -1  

if __name__ == "__main__":  
    # html = asyncio.run(GetDocument.get_document_from_link(["https://python.langchain.com/v0.1/docs/integrations/document_loaders/async_chromium/"]))
    # print(html)   
    GetDocument.handle_link("https://bhutan.com.au/wp-content/uploads/2022/06/Nepal-on-a-budget-5-nts.pdf", "usr3")