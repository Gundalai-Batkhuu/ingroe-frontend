from app.dependencies.internal import GetDocument
import pytest
from unittest.mock import patch, AsyncMock
from langchain_core.documents import Document
from app.const import ReturnCode
from io import BytesIO
from fastapi import UploadFile
from app.dependencies.external import S3

# --- create_documents.py ---

@pytest.fixture
def variable_map():
    """Provides a dictionary of variable with a value."""
    map_variable = {
        "pdf_url": "https://expatsholidays.com/wp-content/uploads/2018/07/Travel-Guide-for-Nepal.pdf",
        "vanilla_url": "https://python.langchain.com/v0.1/docs/modules/data_connection/document_loaders/markdown/",
        "user_id": "123",
        "document_id": "ncncn",
        "xlsx_url": "https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls",
        "docx_url": "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_DOCX.docx",
        "doc_url": "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_DOC.doc",
        "csv_url": "https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv",
        "error_url": "https://dsfdsfddsfsfsfsfsdfsdf.com"
    }
    return map_variable

@pytest.fixture
def get_document():
    """Provides a Document object that mocks the real Document object.
    """
    document = [
        Document(
            metadata={
                'title': 'Elizabeth I',
                'summary': 'Elizabeth I 100 (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.',
                'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'
            },
            page_content='Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.'
        )
    ]
    return document

def create_upload_file(filename: str, content: bytes) -> UploadFile:
    """Create a mock upload file.

    Args:
    filename (str): The name of the mock upload file.
    content (bytes): The content of the file.

    Returns:
    UploadFile: The FastAPI UploadFile object.
    """
    file = BytesIO(content)
    return UploadFile(filename=filename, file=file)

@pytest.fixture
def get_file_tuple():
    """Returns the file map containing file url and file name. This acts as 
    a return value for a mock S3 upload.
    """
    file_url = "www.cvv.com"
    file_name = "default.pdf"
    return file_url, file_name

@pytest.fixture
def get_file_map():
    """Returns the file map containing file url and file name. This acts as 
    a return value for a mock S3 upload.
    """
    file_url = "www.cvv.com"
    file_name = "default.pdf"
    return {
        "file_url": file_url,
        "file_name": file_name
    }

@patch.object(GetDocument, "_download_file")
@patch.object(GetDocument, "create_documents_from_store")
def test_handle_link_for_supported_files(mock_create_documents_from_store, mock_download_file, variable_map, get_document):
    """Checks if the document is created using pdf, docx or doc for the given link.
    """
    mock_create_documents_from_store.return_value = get_document
    expected_result = get_document
    actual_result = GetDocument.handle_link(
        url=variable_map.get("pdf_url"),
        user_id=variable_map.get("user_id")
        )
    assert actual_result == expected_result

    actual_result2 = GetDocument.handle_link(
        url=variable_map.get("docx_url"),
        user_id=variable_map.get("user_id")
        )
    assert actual_result2 == expected_result

    assert mock_create_documents_from_store.call_count == 2
    # called_args = mock_create_documents_from_store.call_args_list[0][0]
    # assert called_args[0] == "pdf"

@pytest.mark.parametrize("url", [
    "https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls",
    "https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv",
    "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_DOC.doc"
])
@patch.object(GetDocument, "_download_file")
@patch.object(GetDocument, "create_documents_from_store")
def test_handle_link_for_unsupported_files(mock_create_documents_from_store, mock_download_file, url, variable_map, get_document):
    """Checks if unsupported file code i.e. 0 is returned for unsupported files like xlsx, csv, doc, etc.
    from the given link. Also it checks the calls to mock functions in this case are zero.
    """
    mock_create_documents_from_store.return_value = get_document
    expected_result = ReturnCode.UNSUPPORTED_FILE
    actual_result = GetDocument.handle_link(
        url=url,
        user_id=variable_map.get("user_id")
        )
    assert actual_result == expected_result

    assert mock_create_documents_from_store.call_count == 0
    assert mock_download_file.call_count == 0

@patch.object(GetDocument, "_download_file")
@patch.object(GetDocument, "create_documents_from_store")
def test_handle_link_for_vanilla_links(mock_create_documents_from_store, mock_download_file, variable_map, get_document):
    """Checks if vanilla file code i.e. 2 is returned for the normal link.
    Also it checks the call to mock functions are zero.
    """
    mock_create_documents_from_store.return_value = get_document
    expected_result = ReturnCode.VANILLA_LINK
    actual_result = GetDocument.handle_link(
        url=variable_map.get("vanilla_url"),
        user_id=variable_map.get("user_id")
        )
    assert actual_result == expected_result

    assert mock_create_documents_from_store.call_count == 0
    assert mock_download_file.call_count == 0    

@patch.object(GetDocument, "_download_file")
@patch.object(GetDocument, "create_documents_from_store")
def test_handle_link_for_error_links(mock_create_documents_from_store, mock_download_file, variable_map, get_document):
    """Checks if error code i.e. -1 is returned for the error link.
    Also it checks the call to mock functions are zero.
    """
    mock_create_documents_from_store.return_value = get_document
    expected_result = ReturnCode.ERROR
    actual_result = GetDocument.handle_link(
        url=variable_map.get("error_url"),
        user_id=variable_map.get("user_id")
        )
    assert actual_result == expected_result

    assert mock_create_documents_from_store.call_count == 0
    assert mock_download_file.call_count == 0     

# parametererising the test to check for different unsupported file types.
@pytest.mark.asyncio
@pytest.mark.parametrize("filename", [
    "file_name.xlsx",
    "file_name.doc"
])
@patch.object(GetDocument, "_upload_file", new_callable=AsyncMock)
@patch.object(GetDocument, "create_documents_from_store")
@patch.object(S3, "upload_to_s3_bucket")
async def test_get_document_from_file_for_unsupported_files(mock_upload_to_s3_bucket, mock_create_documents_from_store, mock_upload_file, filename, variable_map, get_document, get_file_tuple):
    """Checks if unsupported file types are uploaded then the integer 0 is returned. 
    """
    mock_create_documents_from_store.return_value = get_document
    mock_upload_to_s3_bucket.return_value = get_file_tuple
    file = create_upload_file(filename, b"dummy content")
    user_id = variable_map.get("user_id")
    document_id = variable_map.get("document_id")
    expected_result = ReturnCode.UNSUPPORTED_FILE
    actual_result = await GetDocument.get_document_from_file(file=file, user_id=user_id, document_id=document_id)
    assert actual_result == expected_result
    assert mock_create_documents_from_store.call_count == 0
    assert mock_upload_to_s3_bucket.call_count == 0

@pytest.mark.asyncio
@pytest.mark.parametrize("filename", [
    "file_name.pdf",
    "file_name.md",
    "file_name.docx",
    "file_name.txt"
])
@patch.object(GetDocument, "_upload_file", new_callable=AsyncMock)
@patch.object(GetDocument, "create_documents_from_store")
@patch.object(S3, "upload_to_s3_bucket")
async def test_get_document_from_file_for_supported_files(mock_upload_to_s3_bucket, mock_create_documents_from_store, mock_upload_file, filename, variable_map, get_document, get_file_tuple, get_file_map):
    """Checks if supported file types are uploaded, then the document creation is performed
    from the file.
    """
    mock_create_documents_from_store.return_value = get_document
    mock_upload_to_s3_bucket.return_value = get_file_tuple
    file = create_upload_file(filename, b"dummy content")
    user_id = variable_map.get("user_id")
    document_id = variable_map.get("document_id")
    expected_result = get_document
    actual_result, file_map = await GetDocument.get_document_from_file(file=file, user_id=user_id, document_id=document_id)
    assert actual_result == expected_result
    assert file_map == get_file_map
    assert mock_create_documents_from_store.call_count == 1

