"""
The backend of the Legal_AI_App.
"""

from fastapi import FastAPI
from app.routes import action

app = FastAPI()
prefix = "/api/v1"
app.include_router(router=action.router, prefix=prefix)

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
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)