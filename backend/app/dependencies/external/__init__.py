"""Generates functions from the external dependencies.
"""

import importlib
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.dependencies.external.get_llm import LLM
    from app.dependencies.external.search_func import SearchFunction
    from app.dependencies.external.s3 import S3

__all__ = [
    "LLM",
    "SearchFunction",
    "S3"
]

_module_lookup = {
    "LLM": "app.dependencies.external.get_llm",
    "SearchFunction": "app.dependencies.external.search_func",
    "S3": "app.dependencies.external.s3"
}

def __getattr__(name: str) -> Any:
    if name in _module_lookup:
        module = importlib.import_module(_module_lookup[name])
        return getattr(module, name)
    raise AttributeError(f"module {__name__} has no attribute {name}")