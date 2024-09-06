from app.dependencies.internal.customised import Neo4JCustomGraph
from app.exceptions import DocumentDeletionError
from loguru import logger

class DeleteDocument:
    """Class that deletes the document from the neo4j database.
    """
    @classmethod
    def _get_graph(cls) -> Neo4JCustomGraph:
        """Provides a Neo4jGraph instance.

        Returns:
        Neo4jGraph: A Neo4jGraph instance.
        """
        graph = Neo4JCustomGraph()
        return graph 
    
    @classmethod
    def delete_document_from_graph(cls, document_id: str) -> None:
        """Deletes a sub graph of document from Neo4j.

        Args:
        document_id (str): Id of the document root or the node that contains all the other nodes or entities.
        """
        try:
            graph = cls._get_graph()
            delete_query = (
                f"MATCH (document_root {{id:$document_id}})-[*0..]->(n) "
                "DETACH DELETE (n)"
            )
            graph.query(delete_query, {"document_id": document_id})
        except Exception as e:
            logger.error(e)
            raise DocumentDeletionError(message="Error while deleting the documents from the graph database", name="Graph")
