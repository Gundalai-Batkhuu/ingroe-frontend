import pytest
from .db.test_database import override_get_db
from app.dependencies.internal import (StoreAssets, DeleteAssets)
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import (UserCRUD, DocumentCRUD, CapturedDocumentCRUD, CapturedFileCRUD)
from app.model.db import Document

@pytest.fixture(scope="module")
def source():
    """Fixture that provides the source payload.
    """
    source = DocumentSource(vanilla_links=["vanilla_link"], file_links=["file_link"], error_links=["error_link"], unsupported_file_links=["unallowed_downloadable_links"])
    return source 

def create_user(db):
    """Creates a user record in the user table.

    Args:
    db: A database session object.
    """
    UserCRUD.create_user(db=db, name="test user", email="test2@gmail.com", user_id="test_user_456") 

def create_other_records(db, document_id, captured_document_id, file_id, file_name):
    """Creates document, captured document, captured file records in the respective table.
    """
    user_id = "test_123"
    DocumentCRUD.create_document(
                db=db, 
                document_id=document_id,
                user_id=user_id,
                document_alias="test doc",
                vanilla_links=[],
                file_links=[],
                unsupported_file_links=[],
                files=[],  
                description="test doc description"     
        )
    CapturedDocumentCRUD.create_record(db, captured_document_id, document_id)
    CapturedFileCRUD.create_record(db, file_id, captured_document_id, "www.xyz.com", file_name)    

def test_store_create_document(test_db, source):
    """Tests the creation of document. If the creation fails then an exception would be returned which results in the failure of the test.
    """
    db_generator = override_get_db()
    db = next(db_generator)
    try:
        create_user(db)
        user_id = "test_user_456"
        document_id = "test_create_document_123"
        document_alias = "test document"
        description = "test description"
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, document_alias=document_alias, source_payload=source, description=description, db=db)
        storer.store(False)
    except Exception as e:
        pytest.fail(f"Test failed due to unexpected exception: {e}")  
    finally:
        db_generator.close()    

def test_store_update_document(test_db, source):
    """Tests the updation of document. If the updation fails then an exception would be returned which results in the failure of the test.
    """
    db_generator = override_get_db()
    db = next(db_generator)
    try:
        user_id = "test_user_456"
        document_id = "test_create_document_123"
        document_alias = "test document updated"
        description = "test description updated"
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, document_alias=document_alias, source_payload=source, description=description, db=db)
        storer.store(True)
    except Exception as e:
        pytest.fail(f"Test failed due to unexpected exception: {e}")  
    finally:
        db_generator.close()           

def test_delete_captured_file(test_db):
    """Tests the deletion of captured file. If the deletion fails then an exception would be returned which results in the failure of the test."""
    db_generator = override_get_db()
    db = next(db_generator)
    try:
        document_id = "test_create_document_ccnn"
        captured_document_id = "test_captured_document_ccnn"
        file_id = "test_file_123_ccnn"
        file_name = "test_file.txt"
        create_other_records(db, document_id, captured_document_id, file_id, file_name)
        DeleteAssets.delete_captured_file(file_id, captured_document_id, db)
    finally:
        db_generator.close() 

def test_update_document_info(test_db):
    """Tests the updation of document. If the updation fails then an exception would be returned which results in the failure of the test."""
    db_generator = override_get_db()
    db = next(db_generator)
    try:
        document_id = "test_create_document_ccnn"
        DocumentCRUD.update_document_info(db, document_id, "test document updated", "test description updated")
        document = db.query(Document).filter(Document.document_id == document_id).first() 
        assert document.document_alias == "test document updated"
        assert document.description == "test description updated"       
    finally:
        db_generator.close()    