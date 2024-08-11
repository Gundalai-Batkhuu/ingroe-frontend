from langchain_community.vectorstores import Neo4jVector
from typing import List, Dict, Any, Tuple
from langchain_core.documents import Document
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_ENTITY_LABEL = "__Entity__"
class ScopedNeo4jVector(Neo4jVector):
    def scoped_similarity_search(
        self,
        query: str,
        primary_node_id: str,
        k: int = 4,
        params: Dict[str, Any] = {},
        **kwargs: Any
    ) -> List[Document]:
        logger.info(f"Starting scoped similarity search for query '{query}': with primary node ID: {primary_node_id}")
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
        # Check if the primary node exists
        check_query = "MATCH (d:Document {parent_id: $primary_node_id}) RETURN d"
        check_results = self.query(check_query, params={"primary_node_id": primary_node_id})
        if not check_results:
            logger.warning(f"No primary node found with id: {primary_node_id}")
            return []
        logger.info(f"Primary node found with id: {primary_node_id}")

        # Check if there are any child nodes with embeddings
        child_check_query = (
            f"MATCH (d:Document {{parent_id:$primary_node_id}})-[:MENTIONS]->(n:`{BASE_ENTITY_LABEL}`) "
            f"WHERE d.`{self.embedding_node_property}` IS NOT NULL "
            "RETURN count(n) as count"
        )
        child_check_results = self.query(child_check_query, params={"primary_node_id": primary_node_id})
        child_count = child_check_results[0]['count']
        if child_count == 0:
            logger.warning(f"No child nodes with embeddings found for primary node with id: {primary_node_id}")
            return []
        logger.info(f"Found {child_count} child nodes with embeddings for primary node with id: {primary_node_id}")

        # Proceed with the similarity search
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

        logger.info(f"Executing similarity search query with parameters: {parameters}")
        results = self.query(index_query, params=parameters)

        if not results:
            logger.warning("No results found in similarity search")
            return []

        logger.info(f"Found {len(results)} results in similarity search")
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