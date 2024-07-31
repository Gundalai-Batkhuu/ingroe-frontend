from pydantic import BaseModel

class Search():
    class_var: str = "xyz"

    @classmethod
    def search_documents(cls, search_string):
        print(search_string)

Search.search_documents("hello")