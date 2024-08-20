from langchain_community.document_loaders import AsyncChromiumLoader
from typing import List, AsyncIterator, Sequence, Tuple, Any, Literal, Optional, Dict
from langchain_core.documents import Document
from langchain_community.document_transformers import Html2TextTransformer
from langchain_community.document_transformers import BeautifulSoupTransformer
import asyncio
import requests
from urllib.parse import urlparse
import mimetypes
from app.utils import (get_root_directory, generate_unique_string, get_file_type_by_extension, get_current_directory, get_file_name_from_original_file_name)
import os
from langchain_community.document_loaders import (PyPDFLoader, UnstructuredMarkdownLoader, Docx2txtLoader)
from fastapi import UploadFile
from app.const import (ReturnCode, NameClass, ModelDetails, FileType)
from app.dependencies.external import S3
import base64
import aiofiles
import json
import boto3
from app.enum import ServiceProvider
import pytesseract
from pdf2image import convert_from_path
import os

class GetDocument:
    """Get the sequence of documents from the provided link or file.

    Params:
    allowed_file_types (List[str]): A list of allowed file extension or types.
    additional_allowe_files (List[str]): A list of extra allowed file extension or types.
    content_type_map (Dict[str,str]): A dictionary that maps content type with file extension or type.
    """
    allowed_file_types: List[str] = ["pdf", "docx"]
    additional_allowed_files: List[str] = ["md"]
    content_type_map: Dict[str,str] = {
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
    def _get_file_path(cls, parent_folder: str, file_extension: str) -> str:
        """Returns the file path where the downloaded file will reside.

        Args:
        parent_folder: Parent folder name.
        file_extension: Extension of the downloaded file.

        Return:
        The complete path where the downloaded file resides.
        """
        root = get_root_directory()
        # folder_path = os.path.join(root, parent_folder, folder_name)
        folder_path = os.path.join(root, parent_folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        file_name = generate_unique_string()
        file_path = os.path.join(folder_path, file_name)
        complete_path = f"{file_path}.{file_extension}"
        return complete_path  
    
    @classmethod
    def _clear_file(cls, file_path: str) -> None:
        """Removes the file from the specified file path.
        Args:
        file_path (str): The location of the file.
        """
        if os.path.isfile(file_path):
            os.remove(file_path)   

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
            file_extension = cls._get_file_extension_from_file(file, cls.content_type_map)    
        if file_extension == "unknown":
            file_extension = get_file_type_by_extension(path)
        return file_extension 

    @classmethod
    def _get_file_extension_from_file(cls, file: UploadFile, content_type_map: Dict[str,str]) -> str:
        """Get the file extension based on the Content-Type from the file.
        
        Args:
        file: Uploaded file by the client.

        Returns:
        A string representing the file extension.
        """
        content_type = file.content_type
        return content_type_map.get(content_type, "unknown")

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
            file_extension = cls._get_file_extension(path=url, response=response)
            if is_downloadable or file_extension != "":
                if file_extension in cls.allowed_file_types:
                    file_path = cls._get_file_path("files", file_extension)
                    cls._download_file(url, file_path) 
                    documents =  cls.create_documents_from_store(file_extension, file_path) 
                    cls._clear_file(file_path)
                    return documents
                else:
                    return ReturnCode.UNSUPPORTED_FILE 
            else:
                return ReturnCode.VANILLA_LINK
        except Exception as e:
            print(f"An error occurred: {e}")
            return ReturnCode.ERROR

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
    def _get_file_map(cls, file_url: str, file_name: str) -> Dict[str, str]:
        """Construct a file map or dictionary containing file url and file name.

        Args:
        file_url (str): The url of the file.
        file_name (str): The name of the file.

        Returns:
        Dict[str, str]: A dictionary containing file url and file name.
        """
        file_map = {
            "file_url": file_url,
            "file_name": file_name
        }    
        return file_map

    @classmethod
    async def get_document_from_file(cls, file: UploadFile, user_id: str, document_id: str) -> Tuple[List[Document], Dict[str, str]] | int:
        """Creates a list of documents from the uploaded file and stores the uploaded file to the 
        S3 storage.

        Args:
        file (UploadFile): Uploaded file by the client.
        user_id (str): Id of the user uploading the file.
        document_id (str): Id of the document root that holds all the document entities for a particular topic.

        Returns:
        Tuple[List[Document], Dict[str, str]] | int: A tuple containing a list of documents and file map or 0 if the file is outside of the downloadable file types.
        """
        full_allowed_list = cls.allowed_file_types + cls.additional_allowed_files
        file_extension = cls._get_file_extension(path=file.filename, file=file) 
        if file_extension in full_allowed_list:
            file_path = cls._get_file_path("files", file_extension)
            await cls._upload_file(file_path, file)
            documents = cls.create_documents_from_store(file_extension, file_path)
            file_url, file_name = S3.upload_to_s3_bucket(file_path, NameClass.S3_BUCKET_NAME, user_id, document_id, file.filename)
            # file_url = file_name = "www"
            cls._clear_file(file_path)
            file_map = cls._get_file_map(file_url, file_name)
            return documents, file_map
        else: 
            return ReturnCode.UNSUPPORTED_FILE  

class CaptureDocument:
    """Class to capture text from the images or scanned documents.

    Params:
    allowed_file_types (List[str]): A list of allowed file extension or types.
    content_type_map (Dict[str,str]): A dictionary that maps content type with file extension or type.
    max_token (int): The maximum number of tokens to generate from an llm.
    """
    allowed_file_types: List[str] = ["pdf", "jpeg", "png", "webp"]
    content_type_map: Dict[str,str] = {
            "application/pdf": "pdf",
            "image/jpeg": "jpeg",
            "image/png": "png",
            "image/webp": "webp"
        }
    max_token: int = 3000

    @classmethod
    async def _encode_image_to_base64(cls, image_path: str) -> str:
        """Encodes the image to base64 string asynchronously.

        Args:
        image_path (str): The path to the image file.

        Returns:
        str: Encode base64 string from the image.
        """
        async with aiofiles.open(image_path, "rb") as image_file:
            image_data = await image_file.read()
            encoded_image = base64.b64encode(image_data).decode("utf-8")
            return encoded_image   

    @classmethod
    def _get_body(cls, base64_image: str, max_tokens: int, prompt: str) -> str:
        """Provides the json string that is used to pass instruction and configuration to the 
        llm model from bedrock.

        Args:
        base64_image (str): Base64 encoded string of an image.
        max_tokens (int): The maximum token to generate from the llm.
        prompt (str): Instruction to the llm.

        Returns:
        str: A json string containing instruction and config for an llm.
        """
        body = json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": base64_image,
                                },
                            },
                            {"type": "text",
                            "text": prompt},
                        ],
                    }
                ],
            } 
        )
        return body
    
    @classmethod
    def _get_prompt(cls) -> str:
        """Provides the instruction to llm.

        Returns:
        str: Instruction to llm.
        """
        prompt = "Extract the text in this image as it is. Do not add extra information. Use <start> tag to indicate start and <end> to indicate end."
        return prompt

    @classmethod
    def _get_extracted_text(cls, body: str) -> str:
        """Provides the extracted text from the image.

        Args:
        body (str): A json string containing instruction and config.

        Return:
        str: A plain text extracted from the image.
        """
        from app.credentials import Credentials
        credentials = Credentials.get_credentials(ServiceProvider.AWS)
        runtime = boto3.client(
            "bedrock-runtime", 
            region_name=credentials.get("region"),
            aws_access_key_id=credentials.get("access_key"), 
            aws_secret_access_key=credentials.get("secret_key"))
        response = runtime.invoke_model(
            modelId=ModelDetails.BEDROCK_CLAUDE_HAIKU,
            body=body
        )
        response_body = json.loads(response.get("body").read())  
        return response_body["content"][0]["text"] 
    
    @classmethod
    def _extract_text_from_scanned_pdf(cls, pdf_path: str) -> str:
        """Extracts the text in the scanned pdf documents. It first converts pdf pages to images.
        Then it loops over the images created from each pdf page to extract text from the image.
        Finally, the extracted text is then joined with the existing extracted text to get the
        complete text.

        Args:
        pdf_path (str): The path to the pdf file.

        Returns:
        str: Plain text extracted from the pdf file.
        """
        images = convert_from_path(pdf_path)
        extracted_text = ""
        for _, image in enumerate(images):
            text = pytesseract.image_to_string(image) # a function can be created from this line to process other images
            extracted_text += text + "\n"
        return extracted_text
    
    @classmethod
    async def _save_text_to_file(cls, text: str, output_path: str) -> None:
        """Saves the provided text to a file location.

        Args:
        text (str): The text to write/save.
        output_path (str): The path where the written text/file resides.
        """
        async with aiofiles.open(output_path, "w") as file:
            await file.write(text)

    @classmethod
    def _store_text_file_to_S3(cls, user_id: str, document_id: str, file_path: str, original_file_name: str) -> Dict[str, str]:
        """Stores the .txt file to S3 bucket inside a captured folder of the document id
        sub folder.

        Args:
        user_id (str): The id of the user.
        document_id (str): The id of the document root node.
        file_path (str): The local path where the text file resides.
        original_file_name (str): The original file name containing both filename and extension.

        Returns:
        Dict[str,str]: A dictionary containing stored text file url and file name.
        """
        sub_folder = f"{document_id}/captured"
        file_name_without_extension = get_file_name_from_original_file_name(original_file_name)
        new_file_name = f"{file_name_without_extension}.{FileType.TXT}"
        file_url, file_name = S3.upload_to_s3_bucket(file_path, NameClass.S3_BUCKET_NAME, user_id, sub_folder, new_file_name)
        GetDocument._clear_file(file_path)
        file_map = GetDocument._get_file_map(file_url, file_name)
        return file_map
        
    @classmethod
    async def capture_document(cls, file: UploadFile, user_id: str, document_id: str) -> Dict[str,str]:
        """Performs necessary operations to capture the information from scanned documents or images.

        Args:
        file (UploadFile): The file uploaded by the user.
        user_id (str): The id of the user.
        document_id (str): The id of the root document that holds other document pieces.

        Returns:
        Dict[str,str]: A file map containing the source and name of the captured document.
        """
        file_extension = GetDocument._get_file_extension_from_file(file, cls.content_type_map)
        if file_extension in cls.allowed_file_types:
            file_path = GetDocument._get_file_path("files", file_extension)
            await GetDocument._upload_file(file_path, file)
            if file_extension == FileType.PDF:
                extracted_text = cls._extract_text_from_scanned_pdf(file_path)
            else: 
                base64_image = await cls._encode_image_to_base64(file_path)
                body = cls._get_body(base64_image, cls.max_token, cls._get_prompt())
                extracted_text = cls._get_extracted_text(body)
            GetDocument._clear_file(file_path)
            output_file_path = GetDocument._get_file_path("files", FileType.TXT)
            await cls._save_text_to_file(extracted_text, output_file_path)
            file_map = cls._store_text_file_to_S3(user_id, document_id, output_file_path, file.filename)
            return file_map

if __name__ == "__main__":  
    # html = asyncio.run(GetDocument.get_document_from_link(["https://python.langchain.com/v0.1/docs/integrations/document_loaders/async_chromium/"]))
    # print(html)   
    GetDocument.handle_link("https://bhutan.com.au/wp-content/uploads/2022/06/Nepal-on-a-budget-5-nts.pdf", "usr3")