"""
Provides the modules for the pydantic model.
"""

from app.model.pydantic_model.data_model import (SearchQuery, SearchResult, QueryDocument, CreateDocument, User, DeleteDocument, DeleteCapturedFile, DeleteCapturedDocument, CreateDocumentCapture, DocumentInfo, ShareDocument, AcceptSharedDocument, ValidityUpdate, ScopedValidityUpdate, Access, ScopedAccess, DocumentStatus)

__all__ = [
    "SearchQuery",
    "SearchResult",
    "QueryDocument",
    "CreateDocument",
    "User",
    "DeleteDocument",
    "DeleteCapturedFile",
    "DeleteCapturedDocument",
    "CreateDocumentCapture",
    "DocumentInfo",
    "ShareDocument",
    "AcceptSharedDocument",
    "ValidityUpdate",
    "ScopedValidityUpdate",
    "Access",
    "ScopedAccess",
    "DocumentStatus"
]