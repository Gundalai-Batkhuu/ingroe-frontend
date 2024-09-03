import pytest
from .db.test_database import override_get_db
from app.dependencies.internal import StoreAssets
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import UserCRUD

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
