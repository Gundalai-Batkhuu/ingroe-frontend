from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class SharedDocument(Base):
    """Model for the shared document table. It records the validity of the shared document 
    and shared type whether it is open to all or just some.
    """
    __tablename__ = "shared_documents"

    id = Column(Integer, primary_key=True)
    share_id = Column(String, index=True, nullable=False, unique=True)
    document_id = Column(String, ForeignKey("documents.document_id"), index=True, nullable=False)
    open_to_all = Column(Boolean, nullable=False)
    validity = Column(DateTime(timezone=True), nullable=True)
    access_open = Column(Boolean, server_default="True")
    access_blocked_at = Column(DateTime(timezone=True))
    access_opened_at = Column(DateTime(timezone=True))
    access_blocked_count = Column(Integer, server_default="0")
    access_change_reason = Column(String)
    sharing_termination_reason = Column(String)
    shared_at = Column(DateTime(timezone=True), server_default=func.current_timestamp(), nullable=False)

    document = relationship("Document", back_populates="shared_document")
    shared_document_accessor = relationship("SharedDocumentAccessor", back_populates="shared_document", cascade="all, delete-orphan")
