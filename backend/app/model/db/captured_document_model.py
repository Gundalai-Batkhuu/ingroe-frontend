from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class CapturedDocument(Base):
    """Model for the captured document table, where document_id references to the document_id column 
    of the document table. The files column is a list of dictionary containing the filename
    and the source of the file.
    """
    __tablename__ = "captured_documents"

    id = Column(Integer, primary_key=True)
    captured_document_id = Column(String, index=True, nullable=False, unique=True)
    document_id = Column(String, ForeignKey("documents.document_id"), index=True, nullable=False)
    query_ready = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp(), nullable=False)

    document = relationship("Document", back_populates="captured_document")
    captured_file = relationship("CapturedFile", back_populates="captured_document", cascade="all, delete-orphan")
