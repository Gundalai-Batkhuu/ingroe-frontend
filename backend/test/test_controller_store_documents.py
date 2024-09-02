from app.controller.doc_action import Store
from app.dependencies.internal import StoreDocument
from unittest.mock import patch
import pytest
from .module.graph import document, graph_documents
from app.const import GraphLabel
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings

@pytest.fixture(scope="module")
def neo4j_test_db():
    """Fixture to clean the Neo4j database.
    """
    print("Operating on Neo4j")
    yield
    print("Cleaning the Neo4j")
    delete_query = ("MATCH (n) DETACH DELETE (n)")
    Neo4jVector(embedding=OpenAIEmbeddings()).query(query=delete_query)

@patch.object(StoreDocument, "_get_graph_documents")
def test_store_documents_in_graph_db(mock_get_graph_documents, neo4j_test_db):
    """Test if the documents are stored in the database correctly or not.
    """
    document_id = "document_123"
    user_id = "test_123"
    parent_node = {"label": GraphLabel.DOCUMENT_ROOT, "id": document_id}
    mock_get_graph_documents.return_value = graph_documents
    Store.store_document(documents=document, parent_node=parent_node, user_id=user_id)
    actual_value = StoreDocument.check_if_node_exists_for_id(document_id=document_id, user_id=user_id)
    assert actual_value == True