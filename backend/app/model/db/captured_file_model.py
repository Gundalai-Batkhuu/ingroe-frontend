from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class CapturedFile(Base):
    """Model for the captured document table, where document_id references to the document_id column 
    of the document table. The files column is a list of dictionary containing the filename
    and the source of the file.
    """
    __tablename__ = "captured_files"

    id = Column(Integer, primary_key=True)
    file_id = Column(String, index=True, nullable=False, unique=True)
    captured_document_id = Column(String, ForeignKey("captured_documents.captured_document_id"), index=True, nullable=False)
    file_url = Column(String, nullable=False) 
    file_name = Column(String, nullable=False)

    captured_document = relationship("CapturedDocument", back_populates="captured_file")
