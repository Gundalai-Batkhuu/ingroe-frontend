from langchain_community.graphs import Neo4jGraph
from typing import Union, Dict, List
from langchain_community.graphs.graph_document import GraphDocument
from hashlib import md5

BASE_ENTITY_LABEL = "__Entity__"

include_docs_query = (
    "MERGE (d:Document {id:$document.metadata.id}) "
    "SET d.text = $document.page_content "
    "SET d.parent_id = $parent_id "
    "SET d += $document.metadata "
    "WITH d "
)

def _get_create_and_attach_query(parent_label: str) -> str:
    # we use the param to pass the parent id cause this makes Neo4j to handle the type conversion correctly
    return (
        f"MERGE (parent:{parent_label} {{id: $parent_id}}) "
        "MERGE (d:Document {id: $doc_id}) "
        "SET d += $doc_properties "
        "MERGE (parent)-[:OWNS]->(d)"
    )

def _get_node_import_query(baseEntityLabel: bool, include_source: bool) -> str:
    if baseEntityLabel:
        return (
            f"{include_docs_query if include_source else ''}"
            "UNWIND $data AS row "
            f"MERGE (source:`{BASE_ENTITY_LABEL}` {{id: CASE WHEN $parent_id IS NOT NULL THEN row.id + '-' + $parent_id ELSE row.id END}}) "
            "SET source += row.properties "
            f"{'MERGE (d)-[:MENTIONS]->(source) ' if include_source else ''}"
            "WITH source, row "
            "CALL apoc.create.addLabels( source, [row.type] ) YIELD node "
            "RETURN distinct 'done' AS result"
        )
    else:
        return (
            f"{include_docs_query if include_source else ''}"
            "UNWIND $data AS row "
            "CALL apoc.merge.node([row.type], {id: row.id}, "
            "row.properties, {}) YIELD node "
            f"{'MERGE (d)-[:MENTIONS]->(node) ' if include_source else ''}"
            "RETURN distinct 'done' AS result"
        )
    
def _get_rel_import_query(baseEntityLabel: bool) -> str:
    if baseEntityLabel:
        return (
            "UNWIND $data AS row "
            f"MERGE (source:`{BASE_ENTITY_LABEL}` {{id: CASE WHEN $parent_id IS NOT NULL THEN row.source + '-' + $parent_id ELSE row.source END}}) "
            f"MERGE (target:`{BASE_ENTITY_LABEL}` {{id: CASE WHEN $parent_id IS NOT NULL THEN row.target + '-' + $parent_id ELSE row.target END}}) "
            "WITH source, target, row "
            "CALL apoc.merge.relationship(source, row.type, "
            "{}, row.properties, target) YIELD rel "
            "RETURN distinct 'done'"
        )
    else:
        return (
            "UNWIND $data AS row "
            "CALL apoc.merge.node([row.source_label], {id: row.source},"
            "{}, {}) YIELD node as source "
            "CALL apoc.merge.node([row.target_label], {id: row.target},"
            "{}, {}) YIELD node as target "
            "CALL apoc.merge.relationship(source, row.type, "
            "{}, row.properties, target) YIELD rel "
            "RETURN distinct 'done'"
        )   

def _remove_backticks(text: str) -> str:
    return text.replace("`", "")     

class Neo4JCustomGraph(Neo4jGraph):
        """This is the extended class from the langchain Neo4JGraph class. It adds additional functionality to the existing method such as creating a parent child relationship used for isolating the document.
        """
        def add_graph_documents(
            self,
            graph_documents: List[GraphDocument],
            parent_node: Dict[str, Union[str, int]] | None = None,
            include_source: bool = False,
            baseEntityLabel: bool = False,
        ) -> None:
            """
            This method constructs nodes and relationships in the graph based on the
            provided GraphDocument objects.

            Parameters:
            - graph_documents (List[GraphDocument]): A list of GraphDocument objects
            that contain the nodes and relationships to be added to the graph. Each
            GraphDocument should encapsulate the structure of part of the graph,
            including nodes, relationships, and the source document information.
            - parent_node (Dict[str, Union[str, int]]): A dictionary containing label and 
            id for the parent node.
            - include_source (bool, optional): If True, stores the source document
            and links it to nodes in the graph using the MENTIONS relationship.
            This is useful for tracing back the origin of data. Merges source
            documents based on the `id` property from the source document metadata
            if available; otherwise it calculates the MD5 hash of `page_content`
            for merging process. Defaults to False.
            - baseEntityLabel (bool, optional): If True, each newly created node
            gets a secondary __Entity__ label, which is indexed and improves import
            speed and performance. Defaults to False.
            """
            if parent_node is not None:
                if "label" not in parent_node or "id" not in parent_node:
                    raise ValueError("Parent node must contain 'label' and 'id' keys.")
        
            if baseEntityLabel:  # Check if constraint already exists
                constraint_exists = any(
                    [
                        el["labelsOrTypes"] == [BASE_ENTITY_LABEL]
                        and el["properties"] == ["id"]
                        for el in self.structured_schema.get("metadata", {}).get(
                            "constraint", []
                        )
                    ]
                )

                if not constraint_exists:
                    # Create constraint
                    self.query(
                        f"CREATE CONSTRAINT IF NOT EXISTS FOR (b:{BASE_ENTITY_LABEL}) "
                        "REQUIRE b.id IS UNIQUE;"
                    )
                    self.refresh_schema()  # Refresh constraint information

            node_import_query = _get_node_import_query(baseEntityLabel, include_source)
            rel_import_query = _get_rel_import_query(baseEntityLabel)
            for document in graph_documents:
                if not document.source.metadata.get("id"):
                    document.source.metadata["id"] = md5(
                        document.source.page_content.encode("utf-8")
                    ).hexdigest()

                if parent_node is not None:
                    create_and_attach_query = _get_create_and_attach_query(parent_node.get("label"))
                    self.query(
                        create_and_attach_query,
                        {
                            "parent_id": parent_node.get("id"),
                            "doc_id": document.source.metadata["id"],
                            "doc_properties": document.source.metadata
                        }
                    )    

                # Remove backticks from node types
                for node in document.nodes:
                    node.type = _remove_backticks(node.type)
                # Import nodes
                self.query(
                    node_import_query,
                    {
                        "data": [el.__dict__ for el in document.nodes],
                        "document": document.source.__dict__,
                        "parent_id": parent_node["id"] if parent_node else None,
                    },
                )
                # Import relationships
                self.query(
                    rel_import_query,
                    {
                        "data": [
                            {
                                "source": el.source.id,
                                "source_label": _remove_backticks(el.source.type),
                                "target": el.target.id,
                                "target_label": _remove_backticks(el.target.type),
                                "type": _remove_backticks(
                                    el.type.replace(" ", "_").upper()
                                ),
                                "properties": el.properties,
                            }
                            for el in document.relationships
                        ],
                        "parent_id": parent_node["id"] if parent_node else None,
                    },
                )