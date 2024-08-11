from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from app.dependencies.external.get_llm import LLM
 # from ..internal.customised.neo4j_graph import Neo4jGraph
from app.dependencies.internal.customised import Neo4jGraph
from app.model.pydantic_model.payload.query_documents import Entities
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
from langchain_core.language_models import LanguageModelInput
from langchain_community.vectorstores import Neo4jVector
from langchain_core.messages import AIMessage, HumanMessage

class QueryDocument:
    groq_model : str = "llama3-70b-8192"
    openai_model : str = "gpt-3.5-turbo-0125"

    @classmethod
    def _get_llm(cls) -> ChatGroq | ChatOpenAI:
        llm = LLM(model=cls.groq_model, temperature=0).get_groq()
        return llm

    @classmethod
    def _get_entity_extraction_prompt(cls) -> ChatPromptTemplate:
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
        llm = cls._get_llm()
        prompt = cls._get_entity_extraction_prompt()
        entity_chain = prompt | llm.with_structured_output(Entities)
        return entity_chain
    
    @classmethod
    def _generate_full_text_query(cls, input: str) -> str:
        """
        This function creates and returns a full text query that is Lucene compatible. 
        """
        full_text_query = ""
        words = [el for el in remove_lucene_chars(input).split() if el]
        for word in words[:-1]:
            full_text_query += f" {word}~2 AND"
        full_text_query += f" {words[-1]}~2"
        return full_text_query.strip()
    
    @classmethod
    def _get_graph(cls) -> Neo4jGraph:
        graph = Neo4jGraph()
        return graph 
    
    @classmethod
    def _structured_retriever(cls, question: str, parent_id: str) -> str:
        """
        Returns a entity relationship string with each relationship between entities separated by a new line. It checks for bidirectional relationship as show by UNION ALL.
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
                CALL {
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
    def _get_vector_index(cls) -> Neo4jVector:
        from langchain_openai import OpenAIEmbeddings
        vector_index = Neo4jVector.from_existing_index(embedding=OpenAIEmbeddings(), index_name="vector", search_type="hybrid", keyword_index_name="keyword")
        return vector_index
    
    @classmethod
    def _context_retriever(cls, question: str, parent_id: str) -> str:
        """
        Returns a string that is a combination of both the structured_data that shows relationship and unstructured data obtained from similarity search.
        """
        print(f"Search query: {question} {parent_id}")
        vector_index = cls._get_vector_index()
        structured_data = cls._structured_retriever(question, parent_id)
        print(structured_data)
        unstructured_data = [el.page_content for el in vector_index.similarity_search(question)]
        final_data = f"""Structured data:
                    {structured_data}
                    Unstructured data:
                    {"#Document ". join(unstructured_data)}
                        """
        return final_data
    
    @classmethod
    def _get_condensed_prompt(cls) -> PromptTemplate:
        """
        Based on the chat history, it creates a new prompt while rephrasing the question.
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
        """
        Converts the chat history containing a tuple of two strings to the array of human message and ai message.
        """
        buffer = []
        for human, ai in chat_history:
            buffer.append(HumanMessage(content=human))
            buffer.append(AIMessage(content=ai))
        return buffer
    
    @classmethod
    def _get_search_query(cls, parent_id: str) -> RunnableBranch:
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
        template = """Answer the question based only on the following context:
        {context}

        Question: {question}
        Use natural language and be concise.
        Answer:"""
        prompt = ChatPromptTemplate.from_template(template)
        return prompt
    
    @classmethod
    def _get_chain(cls, parent_id: str) -> Runnable:
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
    def query_document(cls, query: str, parent_id: str, chat_history: List[Tuple[str, str]] | None = None) -> str:
        chain = cls._get_chain(parent_id)
        if chat_history is not None:
            print("yes history")
            llm_response = chain.invoke({"question": query, "parent_id": parent_id, "chat_history": chat_history})
            return llm_response
        llm_response = chain.invoke({"question": query, "parent_id": parent_id})
        return llm_response
        # print(query, parent_id)

if __name__ == "__main__":
    chat_history = [("What is Chromium?", "Chromium is one of the browsers supported by Playwright, a library used to control browser automation.")]
    # response = QueryDocument.query_document("What is Chromium?", "7dbcc9ede1a24c5fb26d37fcf8da8fb7")
    response = QueryDocument.query_document("What is Headless mode?", "7dbcc9ede1a24c5fb26d37fcf8da8fb7", chat_history)  
    print(response)      