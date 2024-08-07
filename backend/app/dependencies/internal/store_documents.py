from langchain.text_splitter import TokenTextSplitter
from typing import Sequence, List
from langchain_core.documents import Document
from langchain_experimental.graph_transformers import LLMGraphTransformer
from app.dependencies.external.get_llm import LLM
from langchain_community.graphs.graph_document import GraphDocument
from app.temp_test.graph import get_graph_doc
# from ..internal.customised.neo4j_graph import Neo4jGraph
from app.dependencies.internal.customised import Neo4jGraph

class StoreDocument():
    """
    Stores the document in the Neo4j graph database.

    Parameters:
    groq_model (str): The model name to determine the llm model.
    openai_model (str): The name of OpenAI model.
    """
    groq_model : str = "llama3-70b-8192",
    openai_model : str = "gpt-3.5-turbo-0125"

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
        documents = cls._get_document_chunks(documents)
        llm = LLM(model=cls.groq_model, temperature=0)
        llm_transformer = LLMGraphTransformer(llm=llm)
        graph_documents = llm_transformer.convert_to_graph_documents(documents)
        return graph_documents
    
    @classmethod
    def store_documents_in_graph_db(cls, documents: Sequence[Document] | None):
        """Stores the graph documents in the database while attaching the new nodes to the existing parent node.

        Args:
        documents (Sequence[Document]): The list of document object containing information.

        """
        # graph_documents = cls._get_graph_documents(documents)
        graph_documents = get_graph_doc()
        print(graph_documents)
        graph = Neo4jGraph()
        graph.add_graph_documents(
            graph_documents,
            # parent_node={"label":"User", "id": "123"},
            parent_node_query="MATCH (parent:User {id:'123'})",
            baseEntityLabel=True,
            include_source=True
        )


if __name__ == "__main__":
    StoreDocument.store_documents_in_graph_db(None)
