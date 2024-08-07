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
    )
    from app.controller.doc_action.store_document import (
        Store,
    )

__all__ = [
    "Search",
    "Create",
    "Store"
]

_module_lookup = {
    "Search": "app.controller.doc_action.search",
    "Create": "app.controller.doc_action.create_document",
    "Store": "app.controller.doc_action.store_document"
}

def __getattr__(name: str) -> Any:
    if name in _module_lookup:
        module = importlib.import_module(_module_lookup[name])
        return getattr(module, name)
    raise AttributeError(f"module {__name__} has no attribute {name}")