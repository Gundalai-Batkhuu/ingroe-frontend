from langchain.text_splitter import TokenTextSplitter
from typing import Sequence, List, Dict, Union
from langchain_core.documents import Document
from langchain_experimental.graph_transformers import LLMGraphTransformer
from app.dependencies.external import LLM
from langchain_community.graphs.graph_document import GraphDocument
# from app.temp_test.graph import get_graph_doc
# from ..internal.customised.neo4j_graph import Neo4jGraph
from app.dependencies.internal.customised import Neo4JCustomGraph
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings
from app.enum import (ModelProvider,)
from app.const import GraphLabel
# from langchain_community.graphs import Neo4jGraph
from app.exceptions import DocumentStorageError
from loguru import logger

class StoreDocument:
    """
    Stores the document in the Neo4j graph database.
    """

    @classmethod
    def _get_document_chunks(cls, documents: Sequence[Document]) -> List[Document]:
        """Splits the given sequence of documents into chunks of the specified size.

        Args:
        documents (Sequence[Document]): The list of document object containing information.

        Returns:
        List[Document]: The chunks created from the document list.
        """
        text_splitter = TokenTextSplitter(chunk_size=512, chunk_overlap=24)
        split_documents = text_splitter.split_documents(documents)
        return split_documents
    
    @classmethod
    def _get_graph_documents(cls, documents: Sequence[Document]) -> List[GraphDocument]:
        """Convert the documents into graph documents containing nodes and relationships.

        Args:
        documents (Sequence[Document]): The list of document object containing information.

        Returns:
        List[GraphDocument]: The list of graph documents obtained from the documents.
        """
        try:
            documents = cls._get_document_chunks(documents)
            llm_selector = LLM(temperature=0)
            llm = llm_selector.get_model(ModelProvider.OPENAI)
            llm_transformer = LLMGraphTransformer(llm=llm)
            graph_documents = llm_transformer.convert_to_graph_documents(documents)
            return graph_documents
        except Exception as e:
            logger.error(e)
            raise DocumentStorageError(message="Error while creating the graph documents from documents", name="Graph Document Creation")
    
    @classmethod
    def store_documents_in_graph_db(cls, documents: Sequence[Document] | None, parent_node: Dict[str, Union[str, int]], user_id: str) -> None:
        """Stores the graph documents in the database while attaching the new nodes to the existing parent node.

        Args:
        documents (Sequence[Document]): The list of document object containing information.
        parent_node (Dict[str, Union[str, int]]): The dictionary containing parent label and parent id.
        """
        graph_documents = cls._get_graph_documents(documents)
        # graph_documents = get_graph_doc()
        print(graph_documents)
        graph = Neo4JCustomGraph()
        graph.add_graph_documents(
            graph_documents,
            parent_node=parent_node,
            baseEntityLabel=True,
            include_source=True
        )
        cls._create_indexes(graph)
        cls._create_vector_index()
        document_id = parent_node.get("id")
        cls._attach_document_to_user(user_id, document_id)

    @classmethod
    def _create_indexes(cls, graph: Neo4JCustomGraph) -> None:
        """Creates one full text index and one property index.
        Args (Neo4jGraph): Neo4jGraph instance. 
        """
        graph.query("CREATE FULLTEXT INDEX entity IF NOT EXISTS FOR (e:__Entity__) ON EACH [e.id]")
        graph.query("CREATE INDEX parent IF NOT EXISTS FOR (e:__Entity__) ON (e.parent_id)")
        root_entity = GraphLabel.DOCUMENT_ROOT
        graph.query(f"CREATE INDEX document_root IF NOT EXISTS FOR (d:{root_entity}) ON (d.id)")

    @classmethod
    def _create_vector_index(cls) -> None:
        """Creates a Neo4jVector from existing database where the strategy to use is both vector similarity and keyword matching. It specifies the Document node to be used and the text property of the nodes should be embedded and adds the embedding property to the document node.
        """
        vector_index = Neo4jVector.from_existing_graph(
        OpenAIEmbeddings(),
        search_type="hybrid",
        node_label="Document",
        text_node_properties=["text"],
        embedding_node_property="embedding"
    )
        
    @classmethod    
    def check_if_node_exists_for_id(cls, document_id: str, user_id: str) -> bool:
        """Checks if node exists for an id in the graph.

        Args:
        document_id (str): The id to be checked against the node id.

        Returns:
        bool: True or False based on the node existence in the graph for an id.
        """
        document_check_query = (
            f"MATCH (n {{id:$document_id}}) "
            "RETURN count(n) as count"
        )   
        document_check_result = Neo4jVector(embedding=OpenAIEmbeddings()).query(query=document_check_query, params={"document_id": document_id})
        count = document_check_result[0]["count"]
        if count != 1:
            return False
        print("reach whole check")
        complete_check_query = (
            f"MATCH (user:User {{id:$user_id}}), (d:Document_Root {{id:$document_id}}) "
            "WHERE EXISTS ((user) -[:Created]-> (d)) "
            "RETURN count(d) as count "
        )
        complete_check_result = Neo4jVector(embedding=OpenAIEmbeddings()).query(query=complete_check_query, params={"user_id": user_id,"document_id": document_id})
        count = complete_check_result[0]["count"]
        if count != 1:
            return False
        return True
    
    @classmethod
    def _attach_document_to_user(cls, user_id: str, document_id: str) -> None:
        """"Attaches the document root which owns all the document node for a particular
        document to the user id or the user.

        Args:
        user_id (str): The id of the node or the user to attach the document root.
        document_id (str): The id of the document root. 
        """
        attach_query = (
            f"MERGE (user:{GraphLabel.USER} {{id:$user_id}}) "
            "WITH user AS user "
            f"MATCH (document_root:{GraphLabel.DOCUMENT_ROOT} {{id:$document_id}}) "
            f"MERGE (user) -[:{GraphLabel.USER_DOCUMENT_RELATIONSHIP}]-> (document_root) "
        )
        Neo4jVector(embedding=OpenAIEmbeddings()).query(query=attach_query, params={"user_id": user_id, "document_id": document_id})

if __name__ == "__main__":
    documents = [Document(metadata={'title': 'Elizabeth I', 'summary': 'Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.', 'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'}, page_content='Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and his second wife, Anne Boleyn.')]
    # label = GraphLabel.DOCUMENT_ROOT
    # print(label)
    StoreDocument.store_documents_in_graph_db(documents=documents, parent_node={"label":GraphLabel.DOCUMENT_ROOT, "id": "456"})
