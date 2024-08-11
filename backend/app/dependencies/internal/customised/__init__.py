""""
Entrypoint to access customised modules.
"""

import importlib
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.dependencies.internal.customised.neo4j_graph import (
        Neo4jGraph,
    )
    from app.dependencies.internal.customised.neo4j_vector import (
        ScopedNeo4jVector
    )

__all__ = [
    "Neo4jGraph",
    "ScopedNeo4jVector"
]

_module_lookup = {
    "Neo4jGraph": "app.dependencies.internal.customised.neo4j_graph",
    "ScopedNeo4jVector": "app.dependencies.internal.customised.neo4j_vector"
}

def __getattr__(name: str) -> Any:
    if name in _module_lookup:
        module = importlib.import_module(_module_lookup[name])
        return getattr(module, name)
    raise AttributeError(f"module {__name__} has no attribute {name}")