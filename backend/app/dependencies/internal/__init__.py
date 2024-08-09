""""
Entrypoint to access the internal dependencies.
"""

import importlib
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.dependencies.internal.create_documents import (
        GetDocument
    ) 
    from app.dependencies.internal.store_documents import (
        StoreDocument
    )
    from app.dependencies.internal.query_documents import (
        QueryDocument
    )

__all__ = [
    "GetDocument",
    "StoreDocument",
    "QueryDocument"
]

_module_lookup = {
    "GetDocument": "app.dependencies.internal.create_documents",
    "StoreDocument": "app.dependencies.internal.store_documents",
    "QueryDocument": "app.dependencies.internal.query_documents"
}

def __getattr__(name: str) -> Any:
    if name in _module_lookup:
        module = importlib.import_module(_module_lookup[name])
        return getattr(module, name)
    raise AttributeError(f"module {__name__} has no attribute {name}")