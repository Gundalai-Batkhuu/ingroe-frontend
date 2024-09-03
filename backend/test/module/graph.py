from __future__ import annotations

from typing import List, Union

from langchain_core.documents import Document
from langchain_core.load.serializable import Serializable
from langchain_core.pydantic_v1 import Field
from app.model.pydantic_model.payload import DocumentSource


class Node(Serializable):
    """Represents a node in a graph with associated properties.

    Attributes:
        id (Union[str, int]): A unique identifier for the node.
        type (str): The type or label of the node, default is "Node".
        properties (dict): Additional properties and metadata associated with the node.
    """

    id: Union[str, int]
    type: str = "Node"
    properties: dict = Field(default_factory=dict)


class Relationship(Serializable):
    """Represents a directed relationship between two nodes in a graph.

    Attributes:
        source (Node): The source node of the relationship.
        target (Node): The target node of the relationship.
        type (str): The type of the relationship.
        properties (dict): Additional properties associated with the relationship.
    """

    source: Node
    target: Node
    type: str
    properties: dict = Field(default_factory=dict)


class GraphDocument(Serializable):
    """Represents a graph document consisting of nodes and relationships.

    Attributes:
        nodes (List[Node]): A list of nodes in the graph.
        relationships (List[Relationship]): A list of relationships in the graph.
        source (Document): The document from which the graph information is derived.
    """

    nodes: List[Node]
    relationships: List[Relationship]
    source: Document

graph_documents = [GraphDocument(nodes=[Node(id='Langchain', type='Project'), Node(id='Langsmith', type='Project')],
relationships=[Relationship(source=Node(id='Langchain', type='Project'), target=Node(id='Langsmith', type='Project'), type='RELATED_PROJECT')],
source=Document(metadata={'source': 'https://www.abc.com', 'id': '1'}, page_content='xxxxxx'))] 

graph_documents_v2 = [GraphDocument(nodes=[Node(id='StackOverflow', type='Group'), Node(id='Stackman', type='Project')],
relationships=[Relationship(source=Node(id='StackOverflow', type='Group'), target=Node(id='Stackboy', type='Project'), type='RELATED_PROJECT')],
source=Document(metadata={'source': 'https://www.xyz.com', 'id': '100'}, page_content='yyyyy'))]

graph_documents_v3 = [GraphDocument(nodes=[Node(id='StackOverflow', type='Group'), Node(id='Stackwoman', type='Project')],
relationships=[Relationship(source=Node(id='StackOverflow', type='Group'), target=Node(id='Stackgirl', type='Project'), type='RELATED_PROJECT')],
source=Document(metadata={'source': 'https://www.12q.com', 'id': '110'}, page_content='yyyyy'))]

graph_documents_v4 = [GraphDocument(nodes=[Node(id='StackOverflow', type='Group'), Node(id='Stackwoman', type='Project')],
relationships=[Relationship(source=Node(id='StackOverflow', type='Group'), target=Node(id='Stackgirl', type='Project'), type='RELATED_PROJECT')],
source=Document(metadata={'source': 'https://www.12q111.com', 'id': '130'}, page_content='yyyyy')),
GraphDocument(nodes=[Node(id='StackOverflow', type='Group'), Node(id='Stackmiddle', type='Project')],
relationships=[Relationship(source=Node(id='StackOverflow', type='Group'), target=Node(id='Stackgirl', type='Project'), type='RELATED_PROJECT')],
source=Document(metadata={'source': 'https://www.12q1.com', 'id': '120'}, page_content='yyyyy'))]

document = [
    Document(
        metadata={
            'title': 'Elizabeth I',
            'summary': 'Elizabeth I 100 (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.',
            'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'
        },
        page_content='Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.'
    )
]

new_document = [
    Document(
        metadata={
            'title': 'George Washington',
            'summary': 'George Washington (February 22, 1732 – December 14, 1799) was the first President of the United States, serving from 1789 to 1797. He is often called the "Father of His Country" for his pivotal role in the founding of the United States.',
            'source': 'https://en.wikipedia.org/wiki/George_Washington'
        },
        page_content='George Washington (February 22, 1732 – December 14, 1799) was the first President of the United States, serving from 1789 to 1797. He is often called the "Father of His Country" for his pivotal role in the founding of the United States.'
    )
]

def get_doc():
    source = DocumentSource(vanilla_links=["vanilla_link"], file_links=["file_link"], error_links=["error_link"], unsupported_file_links=["unallowed_downloadable_links"])
    return document, source

def get_doc_from_file():
    file_map = {"file_url": "www.test.com", "file_name": "test.pdf"}
    return new_document, file_map