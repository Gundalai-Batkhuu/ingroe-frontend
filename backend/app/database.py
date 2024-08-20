from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
# DATABASE_URL = "postgresql+psycopg2://username:password@localhost/mydatabase"
database_url = os.getenv("DATABASE_URL")

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base: DeclarativeMeta = declarative_base()

def get_db():
    """Provides the database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Intisalise the database with the necessary table creation.
    We import all the models from which tables are to be produced and create all.
    """
    # Import all the models here to ensure they are registered properly
    from app.model.db import (User, Document, CapturedDocument)
    Base.metadata.create_all(bind=engine)  
    print("database initialised")      

def get_session():
    """Directly returns a database session."""
    return SessionLocal()