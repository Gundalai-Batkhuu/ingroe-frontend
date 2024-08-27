""""
The actions relevant to the documents. Such as searching the documents,
querying the documents, etc.
"""

import importlib
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.controller.doc_action.search import (
        Search,
    ) 
    from app.controller.doc_action.create_document import (
        Create,
        document_exists,
    )
    from app.controller.doc_action.store_document import (
        Store,
    )
    from app.controller.doc_action.query_document import (
        Query,
    )
    from app.controller.doc_action.delete_document import (
        Delete,
    )
    from app.controller.doc_action.capture_document import (
        Capture,
        file_exists
    )

__all__ = [
    "Search",
    "Create",
    "Store",
    "Query",
    "document_exists",
    "Delete",
    "Capture",
    "file_exists"
]

_module_lookup = {
    "Search": "app.controller.doc_action.search",
    "Create": "app.controller.doc_action.create_document",
    "Store": "app.controller.doc_action.store_document",
    "Query": "app.controller.doc_action.query_document",
    "document_exists": "app.controller.doc_action.create_document",
    "Delete": "app.controller.doc_action.delete_document",
    "Capture": "app.controller.doc_action.capture_document",
    "file_exists": "app.controller.doc_action.capture_document"
}

def __getattr__(name: str) -> Any:
    if name in _module_lookup:
        module = importlib.import_module(_module_lookup[name])
        return getattr(module, name)
    raise AttributeError(f"module {__name__} has no attribute {name}")