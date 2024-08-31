from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from app.dependencies.external import LLM
 # from ..internal.customised.neo4j_graph import Neo4jGraph
from app.dependencies.internal.customised import Neo4jGraph
from app.model.pydantic_model.payload import Entities
from langchain_community.vectorstores.neo4j_vector import remove_lucene_chars
from typing import List, Tuple, Union, Dict, Any
from langchain_core.runnables import (RunnableBranch, RunnableLambda, RunnableParallel,
RunnablePassthrough)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq 
from langchain_openai import ChatOpenAI
from langchain_core.runnables import Runnable
from langchain_core.pydantic_v1 import (BaseModel)
from app.dependencies.internal.customised import ScopedNeo4jVector
from langchain_core.messages import AIMessage, HumanMessage
from app.enum import ModelProvider

class QueryDocument:
    """Class that contains the operations required to get response from the stored documents.
    E.g. calling query_document with the query and other required parameters will get you a response.
    The response is obtained from the content in the documents.
    """

    @classmethod
    def _get_llm(cls) -> ChatGroq | ChatOpenAI:
        """Provides the llm based on the model id passed.

        Returns:
        ChatGroq | ChatOpenAI: The llm model by either groq or openai.
        """
        llm_instance = LLM(temperature=0)
        llm = llm_instance.get_model(ModelProvider.GROQ)
        return llm

    @classmethod
    def _get_entity_extraction_prompt(cls) -> ChatPromptTemplate:
        """Provides the chat prompt template that extracts the entities from the text.
        Mainly used with extracting entities from the question.

        Return:
        ChatPromptTemplate: The template that is structured to extract entities.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "All the person, organization, streets and entities related to geography, finance, time and dates, legal sector, products or services, medical sector, events, cultural and media references, technical sector and miscellaneous information that appear in the text."
                ),
                (
                    "human",
                    "Use the given format to extract information from the following "
                    "input: {question}",
                ),
            ]
        )
        return prompt
    
    @classmethod
    def _get_entity_chain(cls) -> Runnable:
        """Provides the runnable that is used to generate entities.

        Returns:
        Runnable: A runnable chain than can be invoked to retrieve entities.
        """
        llm = cls._get_llm()
        prompt = cls._get_entity_extraction_prompt()
        entity_chain = prompt | llm.with_structured_output(Entities)
        return entity_chain
    
    @classmethod
    def _generate_full_text_query(cls, input: str) -> str:
        """This function creates and returns a full text query that is Lucene compatible. 

        Args:
        input (str): The query supplied by the user.

        Returns:
        str: The query that is Lucene compatible.
        """
        full_text_query = ""
        words = [el for el in remove_lucene_chars(input).split() if el]
        for word in words[:-1]:
            full_text_query += f" {word}~2 AND"
        full_text_query += f" {words[-1]}~2"
        return full_text_query.strip()
    
    @classmethod
    def _get_graph(cls) -> Neo4jGraph:
        """Provides a Neo4jGraph instance.

        Returns:
        Neo4jGraph: A Neo4jGraph instance.
        """
        graph = Neo4jGraph()
        return graph 
    
    @classmethod
    def _structured_retriever(cls, question: str, parent_id: str) -> str:
        """Returns an entity relationship string with each relationship between entities separated by a new line. It checks for bidirectional relationship as show by UNION ALL.

        Args:
        question (str): The query supplied by the user.
        parent_id: The id of the node that is also the root of all the nodes that we want to search for
        similarity and relationships.

        Returns:
        str: Bidirectional entity relationship string between entities.
        """
        entity_chain = cls._get_entity_chain()
        result = ""
        entities = entity_chain.invoke({"question": question})
        print(entities.names)
        graph = cls._get_graph()
        for entity in entities.names:
            entity = f"{entity}-{parent_id}"
            print(entity)
            response = graph.query(
                """CALL db.index.fulltext.queryNodes('entity', $query)
                YIELD node,score
                CALL (node) {
                WITH node
                MATCH (node)-[r:!MENTIONS]->(neighbor)
                RETURN node.id + ' - ' + type(r) + ' -> ' + neighbor.id AS output
                UNION ALL
                WITH node
                MATCH (node)<-[r:!MENTIONS]-(neighbor)
                RETURN neighbor.id + ' - ' + type(r) + ' -> ' +  node.id AS output
                }
                RETURN output LIMIT 50
                """,
                {"query": cls._generate_full_text_query(entity)},
            )
            result += "\n".join([el['output'] for el in response])
        return result
    
    @classmethod
    def _get_vector_index(cls) -> ScopedNeo4jVector:
        """Provide the existing vector index from the graph with scope.

        Returns:
        ScopedNeo4jVector: An instance of ScopedNeo4jVector, which is a child of Neo4jVector. 
        """
        from langchain_openai import OpenAIEmbeddings
        vector_index = ScopedNeo4jVector.from_existing_index(embedding=OpenAIEmbeddings(), index_name="vector", search_type="hybrid", keyword_index_name="keyword")
        return vector_index
    
    @classmethod
    def _format_structured_data(cls, parent_id: str, structured_data: str) -> str:
        """Formats the entity relationship strings to contain only entities and relationship.
        The parent_id is removed from the entity relationship string.

        Args: 
        parent_id (str): The id of the node that is included with the entity name to distinguish entities.
        structured_data (str): A series of entity relationship strings separated by a new line.

        Returns:
        str: A formatted entity relationship string without parent id.

        E.g. If we pass, Book-12eer44 -TEACH-> Student-12eer44, we get:
        Book -TEACH-> Student
        """
        string_to_replace = f"-{parent_id}"
        formatted_data = structured_data.replace(string_to_replace, "")
        return formatted_data

    @classmethod
    def _context_retriever(cls, question: str, parent_id: str) -> str:
        """Returns a string that is a combination of both the structured_data that shows relationship and unstructured data obtained from similarity search.

        Args:
        question (str): The query supplied by the user.
        parent_id (str): The root node to scope the similarity search and obtaining relationships.

        str: A string representating the combination of the relationship string and similarity
        search result string.
        """
        print(f"Search query: {question} {parent_id}")
        vector_index = cls._get_vector_index()
        structured_data = cls._structured_retriever(question, parent_id)
        formatted_structured_data = cls._format_structured_data(parent_id, structured_data)
        # print(formatted_structured_data)
        unstructured_data = [el.page_content for el in vector_index.scoped_similarity_search(question, parent_id, k=3)]
        # print(unstructured_data)
        # print(type(structured_data))
        if not formatted_structured_data and not unstructured_data: return ""
        # unstructured_data = [el.page_content for el in vector_index.similarity_search(question)]
        final_data = f"""Structured data:
                    {formatted_structured_data}
                    Unstructured data:
                    {"#Document ". join(unstructured_data)}
                        """
        # final_data = f"""
        #             Unstructured data:
        #             {"#Document ". join(unstructured_data)}
        #                 """
        # print(final_data)
        return final_data
    
    @classmethod
    def _context_from_vector_search(cls, question: str, parent_id: str) -> List[str]:
        """Provides the context based on the similarity results obtained from the vector search.

        Args:
        question (str): The query supplied by the user.
        parent_id (str): The root node to scope the similarity search and obtaining relationships.

        Returns:
        List[str]: The list of the string containing the relevnat documents that act as a context.
        """
        vector_index = cls._get_vector_index()
        context = [el.page_content for el in vector_index.scoped_similarity_search(question, parent_id, k=3)]
        print(context)
        return context
    
    @classmethod
    def _get_condensed_prompt(cls) -> PromptTemplate:
        """Based on the chat history, it creates a new prompt while rephrasing the question.

        Returns:
        PromptTemplate: The prompt template that condenses the question based on the chat history.
        """
        _template = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question,
        in its original language.
        Chat History:
        {chat_history}
        Follow Up Input: {question}
        Standalone question:"""
        condense_question_prompt = PromptTemplate.from_template(_template)
        return condense_question_prompt
    
    @classmethod
    def _format_chat_history(cls, chat_history: List[Tuple[str, str]]) -> List[Tuple[HumanMessage, AIMessage]]:
        """Converts the chat history containing a tuple of two strings to the array of human message and ai message.

        Args:
        chat_history (List[Tuple[str, str]]): A tuple containing both the human message and ai message.

        Returns:
        List[Tuple[HumanMessage, AIMessage]]: A list of chat history.
        """
        buffer = []
        for human, ai in chat_history:
            buffer.append(HumanMessage(content=human))
            buffer.append(AIMessage(content=ai))
        return buffer
    
    @classmethod
    def _get_search_query(cls, parent_id: str) -> RunnableBranch:
        """Based on the condition that chat_history is present, it either returns a RunnableBranch
        containing condensed question and parent id or just the original input.

        Args:
        parent_id (str): The root node containing all the nodes that is being searched/used.

        Returns:
        RunnableBranch: A runnable branch that decides to take an action based on the presence of
        chat_history key.
        """
        return RunnableBranch(
        # If input includes chat_history, we condense it with the follow-up question
        (
            RunnableLambda(lambda x: bool(x.get("chat_history"))).with_config(
                run_name="HasChatHistoryCheck"
            ),  # Condense follow-up question and chat into a standalone_question
            RunnablePassthrough.assign(
                chat_history=lambda x: cls._format_chat_history(x["chat_history"])
            )
            | cls._get_condensed_prompt()
            | cls._get_llm()
            | StrOutputParser()
            | (lambda condensed_question: {
                "question": condensed_question,
                "parent_id": parent_id,
            })
        ),
        # Else, we have no chat history, so just pass through the question
        RunnableLambda(lambda x : x),
    )
    
    @classmethod
    def _get_final_prompt(cls) -> ChatPromptTemplate:
        """Provides the final prompt to be used while generating the response.

        Returns:
        ChatPromptTemplate: The template used to create the final prompt.
        """
        template = """Answer the question based only on the following context:
        {context}
        If the context is empty, say answers can't be found in the selected document.

        Question: {question}
        Use natural language and be concise.
        Answer:"""
        prompt = ChatPromptTemplate.from_template(template)
        return prompt
    
    @classmethod
    def _get_chain(cls, parent_id: str) -> Runnable:
        """The final chain which is a Runnable.

        Args:
        parent_id (str): The root node containing all the nodes that is being searched/used.

        Returns:
        Runnable: Runnable that is used to generate the final response to the user's query.
        """
        search_query = cls._get_search_query(parent_id)
        chain = (
        RunnableParallel(
            {
                "context": search_query | RunnableLambda(lambda x: cls._context_retriever(x["question"], x["parent_id"])),
                "question": RunnablePassthrough(),
            }
        )
        | cls._get_final_prompt()
        | cls._get_llm()
        | StrOutputParser()
        )
        return chain
    
    @classmethod
    def _get_quick_chain(cls, parent_id: str) -> Runnable:
        """The final chain required for the quick search.

        Args:
        parent_id (str): The root node containing all the nodes that is being searched/used.

        Returns:
        Runnable: Runnable that is used to generate the final response to the user's query.        
        """
        chain = (
        RunnableParallel(
            {
                "context": RunnableLambda(lambda x: cls._context_from_vector_search(x["question"], x["parent_id"])),
                "question": RunnablePassthrough(),
            }
        )
        | cls._get_final_prompt()
        | cls._get_llm()
        | StrOutputParser()
        )
        return chain

    @classmethod
    def query_document(cls, query: str, parent_id: str, chat_history: List[Tuple[str, str]] | None = None) -> str:
        """A callable to return the response to the users based on their queries.

        Args:
        query (str): The question supplied by the user.
        parent_id (str): The root node containing all the nodes that is being searched/used.
        chat_history List[Tuple[str, str]] | None: Chat between user and ai or None if does not exist.

        Returns:
        str: The response to the user question.
        """
        chain = cls._get_chain(parent_id)
        if chat_history is not None:
            print("yes history")
            llm_response = chain.invoke({"question": query, "parent_id": parent_id, "chat_history": chat_history})
            return llm_response
        llm_response = chain.invoke({"question": query, "parent_id": parent_id})
        return llm_response

    @classmethod   
    def query_document_quick(cls, query: str, parent_id: str) -> str:
        """Queries the document using just vector search to get the relevant documents to
        perfrom quick search.

        Args:
        query (str): The question or query passed by the user.
        parent_id (str): The root node containing all the nodes that is being searched/used.

        Returns:
        str: The response to the user question.
        """
        chain = cls._get_quick_chain(parent_id)
        llm_response = chain.invoke({"question": query, "parent_id": parent_id})
        return llm_response

if __name__ == "__main__":
    chat_history = [("What is Chromium?", "Chromium is one of the browsers supported by Playwright, a library used to control browser automation.")]
    # response = QueryDocument.query_document("What is Chromium?", "7dbcc9ede1a24c5fb26d37fcf8da8fb7")
    # response = QueryDocument.query_document("What is xxxxxxxx?", "7dbcc9ede1a24c5fb26d37fcf8da8fb7")
    # response = QueryDocument.query_document("What is Headless mode?", "7dbcc9ede1a24c5fb26d37fcf8da8fb7", chat_history) 
    # response = QueryDocument.query_document("What is Markdown?", "8bd4014e479f4a878ce06779d2efd24e")
    response = QueryDocument.query_document_quick("What is Markdown?", "003f07657ba64a47992a76d84998d3bb") 
    print(response)      