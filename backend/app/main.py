"""
The backend of the Legal_AI_App.
"""

from fastapi import FastAPI, status
from app.routes import (action, user, document_handling, api_key)
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.exceptions.handler.exception_handler import create_exception_handler
from app.exceptions import (
    DocumentDoesNotExistError
)

app = FastAPI()
prefix = "/api/v1"
app.include_router(router=action.router, prefix=prefix)
app.include_router(router=user.router, prefix=prefix)
app.include_router(router=document_handling.router, prefix=prefix)
app.include_router(router=api_key.router, prefix=prefix)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],  
)

app.add_exception_handler(exc_class_or_status_code=DocumentDoesNotExistError, handler=create_exception_handler(status.HTTP_400_BAD_REQUEST, "Document does not exist"))

init_db()

@app.get("/")
def run_server():
    print("hello")
    return {"msg": "Hello from main API"}

if __name__ == "__main__":
    """In case you are invoking this via Python directly.
    This is probably never actually used but it is here for completeness.
    You'd execute this by running `python -m your-assistant.main`
    """
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5500, reload=False)