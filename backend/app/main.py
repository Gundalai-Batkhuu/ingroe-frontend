"""
The backend of the Legal_AI_App.
"""

from fastapi import FastAPI
from .routes import action
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
prefix = "/api/v1"

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=action.router, prefix=prefix)

@app.get("/")
def run_server():
    return {"msg": "Hello from main API"}

if __name__ == "__main__":
    """In case you are invoking this via Python directly.
    This is probably never actually used but it is here for completeness.
    You'd execute this by running `python -m your-assistant.main`
    """
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)