from langchain_community.vectorstores import Neo4jVector
from typing import List, Dict, Any, Tuple
from langchain_core.documents import Document

BASE_ENTITY_LABEL = "__Entity__"
class ScopedNeo4jVector(Neo4jVector):
    """A child class of Neo4jVector to override few of the functions to implement scope based
    search to get the similar documents.

    E.g. If we want to retrieve the similarity only from the nodes that are a child of the node
    with some id. We can use this class to get that.
    """
    def scoped_similarity_search(
        self,
        query: str,
        primary_node_id: str,
        k: int = 4,
        params: Dict[str, Any] = {},
        **kwargs: Any
    ) -> List[Document]:
        """Run similarity search with Neo4jVector.

        Args:
            query (str): Query text to search for.
            primary_node_id (str): The id of node to scope the similarity search.
            k (int): Number of results to return. Defaults to 4.
            params (Dict[str, Any]): The search params for the index type.
                Defaults to empty dict.

        Returns:
            List of Documents most similar to the query.
        """
        embedding = self.embedding.embed_query(text=query)
        return self.scoped_similarity_search_by_vector(
            embedding=embedding,
            primary_node_id=primary_node_id,
            k=k,
            query=query,
            params=params,
            **kwargs,
        )

    def scoped_similarity_search_by_vector(
        self,
        embedding: List[float],
        primary_node_id: str,
        k: int = 4,
        params: Dict[str, Any] = {},
        **kwargs: Any
    ) -> List[Document]:
        """Return docs most similar to embedding vector.

        Args:
            embedding: Embedding to look up documents similar to.
            primary_node_id (str): The id of node to scope the similarity search.
            k: Number of Documents to return. Defaults to 4.
            params (Dict[str, Any]): The search params for the index type.
                Defaults to empty dict.

        Returns:
            List of Documents most similar to the query vector.
        """
        docs_and_scores = self.scoped_similarity_search_with_score_by_vector(
            embedding=embedding,
            primary_node_id=primary_node_id,
            k=k,
            params=params,
            **kwargs
        )
        return [doc for doc, _ in docs_and_scores]
    
    def scoped_similarity_search_with_score_by_vector(
        self,
        embedding: List[float],
        primary_node_id: str,
        k: int = 4,
        params: Dict[str, Any] = {},
        **kwargs: Any
    ) -> List[Tuple[Document, float]]:
        """
        Perform a similarity search in the Neo4j database using a
        given vector and return the top k similar documents with their scores.

        This method uses a Cypher query to find the top k documents that
        are most similar to a given embedding. The similarity is measured
        using a vector index in the Neo4j database. The results are returned
        as a list of tuples, each containing a Document object and
        its similarity score.

        Args:
            embedding (List[float]): The embedding vector to compare against.
            primary_node_id (str): The id of node to scope the similarity search.
            k (int, optional): The number of top similar documents to retrieve.
            params (Dict[str, Any]): The search params for the index type.
                Defaults to empty dict.

        Returns:
            List[Tuple[Document, float]]: A list of tuples, each containing
                                a Document object and its similarity score.
        """
        index_query = (
            f"MATCH (p {{id: $primary_node_id}})-[r]->(n:`{self.node_label}`) "
            f"WHERE n.`{self.embedding_node_property}` IS NOT NULL "
            f"CALL {{ "
            f"  WITH n "
            f"  CALL db.index.vector.queryNodes($index, $k, $embedding) "
            f"  YIELD node, score "
            f"  WHERE node = n "
            f"  RETURN node, score "
            f"}} "
            f"RETURN node.`{self.text_node_property}` AS text, score, "
            f"node {{.*, `{self.text_node_property}`: Null, "
            f"`{self.embedding_node_property}`: Null, id: Null }} AS metadata"
        )

        parameters = {
            "index": self.index_name,
            "primary_node_id": primary_node_id,
            "k": k,
            "embedding": embedding,
            **params,
        }

        results = self.query(index_query, params=parameters)
        docs_and_scores = [
            (
                Document(
                    page_content=result["text"],
                    metadata={k: v for k, v in result["metadata"].items() if v is not None},
                ),
                result["score"],
            )
            for result in results
        ]
        return docs_and_scores