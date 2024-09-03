from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from typing import Callable
from ..exceptions import APIError
from loguru import logger

# Exception handler factory function
def create_exception_handler(
    status_code: int, initial_detail: str
) -> Callable[[Request, APIError], JSONResponse]:
    detail = {"message": initial_detail}  # Using a dictionary to hold the detail

    async def exception_handler(_: Request, exc: APIError) -> JSONResponse:
        if exc.message:
            detail["message"] = exc.message

        if exc.name:
            detail["message"] = f"{detail['message']} [{exc.name}]"

        logger.error(exc)
        return JSONResponse(
            status_code=status_code, content={"detail": detail["message"]}
        )
    
    return exception_handler