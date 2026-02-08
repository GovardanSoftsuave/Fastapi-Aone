import traceback
from fastapi import Request
from fastapi.responses import JSONResponse
from core.config import logger

def register_exception_handlers(app):
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Handle all uncaught exceptions.
        """
        tb_str = ''.join(traceback.format_tb(exc.__traceback__))
        logger.error(f"Unhandled exception: {request.method} {request.url.path} \n")
        logger.error(f"Traceback:\n{tb_str}")

        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error"},
        )