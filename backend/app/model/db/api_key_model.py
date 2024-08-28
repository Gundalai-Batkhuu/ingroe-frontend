from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from app.database import Base
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

class API(Base):
    """Model for the api key table containing api key hash and key salt. Salt is used for additional security.
    """
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.user_id"), index=True, unique=True, nullable=False)
    key_hash = Column(String, nullable=False)
    key_salt = Column(String, nullable=False)
    is_active = Column(Boolean, server_default="True")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    last_used_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="api_key")