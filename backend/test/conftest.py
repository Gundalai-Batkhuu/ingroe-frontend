import pytest
from app.main import app
from .db.test_database import override_get_db, test_engine, override_get_session
from app.database import Base, get_db
from app.scripts.db import (UserCRUD, DocumentCRUD, CapturedFileCRUD, CapturedDocumentCRUD)

def create_records():
    """Creates user, document, captured document, captured file records in the respective table.
    """
    db = override_get_session()
    document_id = "test_document_123"
    user_id = "test_123"
    file_id = "test_file_123"
    captured_document_id = "test_capture_123" 
    file_name = "test_file.txt"
    UserCRUD.create_user(db=db, name="test user", email="test@gmail.com", user_id=user_id)
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
    db.close()

# Fixture to override dependencies and set up the test database
@pytest.fixture(scope="session")
def test_db():
    """A fixture to set up the database and tear down the database upon task completion.
    """
    print("setting up db from conf")
    Base.metadata.create_all(bind=test_engine)
    app.dependency_overrides[get_db] = override_get_db
    create_records()
    yield
    print("tearing down db from conf")
    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()