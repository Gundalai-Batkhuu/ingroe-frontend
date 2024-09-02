from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

print(os.path.abspath(os.curdir)) 
load_dotenv(dotenv_path="../.env.test")
test_database_url = os.getenv("TEST_DATABASE_URL")

test_engine = create_engine(test_database_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    """Provides the test database session.
    """
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()   

def override_get_session():
    """Directly returns a database session."""
    return TestingSessionLocal()