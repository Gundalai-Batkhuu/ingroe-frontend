from app.dependencies.internal.customised import Neo4jGraph

class DeleteDocument:
    """Class that deletes the document from the neo4j database.
    """
    @classmethod
    def _get_graph(cls) -> Neo4jGraph:
        """Provides a Neo4jGraph instance.

        Returns:
        Neo4jGraph: A Neo4jGraph instance.
        """
        graph = Neo4jGraph()
        return graph 
    
    @classmethod
    def delete_document_from_graph(cls, document_id: str) -> None:
        """Deletes a sub graph of document from Neo4j.

        Args:
        document_id (str): Id of the document root or the node that contains all the other nodes or entities.
        """
        graph = cls._get_graph()
        delete_query = (
            f"MATCH (document_root {{id:$document_id}})-[*0..]->(n) "
            "DETACH DELETE (n)"
        )
        graph.query(delete_query, {"document_id": document_id})
