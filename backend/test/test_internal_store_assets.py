import pytest
from fastapi.testclient import TestClient
from app.main import app
from .db.test_database import override_get_db, test_engine
from app.database import Base, get_db
from app.dependencies.internal import StoreAssets
from app.model.pydantic_model.payload import DocumentSource
from app.scripts.db import UserCRUD

client = TestClient(app)

# Fixture to override dependencies and set up the test database
@pytest.fixture(scope="module")
def test_db():
    """A fixture to set up the database and tear down the database upon task completion.
    """
    Base.metadata.create_all(bind=test_engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()

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
    UserCRUD.create_user(db=db, name="test user", email="test@gmail.com", user_id="test_123")

def test_store_create_document(test_db, source):
    """Tests the creation of document. If the creation fails then an exception would be returned which results in the failure of the test.
    """
    db_generator = override_get_db()
    db = next(db_generator)
    try:
        create_user(db)
        user_id = "test_123"
        document_id = "test_document_123"
        document_alias = "test document"
        description = "test description"
        storer = StoreAssets(user_id=user_id, document_root_id=document_id, document_alias=document_alias, source_payload=source, description=description, db=db)
        storer.store(False)
    except Exception as e:
        pytest.fail(f"Test failed due to unexpected exception: {e}")  
    finally:
        db_generator.close()      
    

