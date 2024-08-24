from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Integer, func
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class SharedDocumentAccessor(Base):
    """Model for the shared document accessor table. Attributes such as verified checks if the recipient has verifies its email to access the document. Access open keeps track of access given by the 
    owner. If the owner blocks the access to an existing email, then access open becomes false. Is alive 
    keeps track of whether the document is deleted by the user after verification. Verification token is
    used to verify if the link after sharing is valid or not. Verification code is a five digit
    code, that verifies if the same code is entered or not. Validity is checked if the document is still
    accessible or expired.
    """
    __tablename__ = "shared_document_accessors"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    share_id = Column(String, ForeignKey("shared_documents.share_id"), index=True, nullable=False)
    user_id = Column(String, nullable=True)
    verified = Column(Boolean, server_default="False")
    access_open = Column(Boolean, server_default="True")
    is_alive = Column(Boolean, server_default="True")
    verification_token = Column(String)
    verification_code = Column(Integer)
    validity = Column(DateTime(timezone=True), nullable=True)
    shared_at = Column(DateTime(timezone=True), server_default=func.current_timestamp(), nullable=False)

    shared_document = relationship("SharedDocument", back_populates="shared_document_accessor")
