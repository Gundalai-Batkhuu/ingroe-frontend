from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, JSON, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Document(Base):
    """Model for the document table, where user_id references to the user_id column 
    of the user table. The files column is a list of dictionary containing the filename
    and the source of the file. Vanilla_links and file_links hold array data.
    """
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    document_id = Column(String, index=True, nullable=False, unique=True)
    user_id = Column(String, ForeignKey("users.user_id"), index=True, nullable=False)
    document_alias = Column(String, nullable=True)
    vanilla_links = Column(ARRAY(String), nullable=True)
    file_links = Column(ARRAY(String), nullable=True)
    unsupported_file_links = Column(ARRAY(String), nullable=True)
    files = Column(JSON, nullable=True) 
    description = Column(String, nullable=True)
    is_shared = Column(Boolean, server_default="False")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="document")
    captured_document = relationship("CapturedDocument", back_populates="document", cascade="all, delete-orphan")
    shared_document = relationship("SharedDocument", back_populates="document", cascade="all, delete-orphan")
