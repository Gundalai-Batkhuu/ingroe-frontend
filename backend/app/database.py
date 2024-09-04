from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from sqlalchemy.orm import declarative_base

load_dotenv()

database_url = os.getenv("DATABASE_URL")
use_cloud_db = os.getenv("USE_CLOUD_DB")
if use_cloud_db == True:
    engine = create_engine(database_url, connect_args={
    "sslmode": "require"})
else:
    engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base: DeclarativeMeta = declarative_base()

def get_db():
    """Provides the database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Intisalise the database with the necessary table creation.
    We import all the models from which tables are to be produced and create all.
    """
    from app.model.db import (User, Document, CapturedDocument, CapturedFile, SharedDocument, SharedDocumentAccessor, APIKey)
    Base.metadata.create_all(bind=engine)  
    print("database initialised")      

def get_session():
    """Directly returns a database session."""
    return SessionLocal()