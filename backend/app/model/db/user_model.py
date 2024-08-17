from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

class User(Base):
    """Model for the user table with id and created_at column populated with automatic values.
    The created_at column uses UTC timezont to indicate that the timestamp when the record
    was created.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    user_id = Column(String, index=True, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    document = relationship("Document", back_populates="user")