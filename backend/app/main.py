from fastapi import FastAPI
from app.api.v1.routes import router as v1_router

app = FastAPI(title="Ziver Backend API")

app.include_router(v1_router, prefix="/api/v1")
