"""
Main entry point for the Ziver Backend API application.

This file initializes the FastAPI app, sets up CORS middleware,
creates database tables, and includes the API routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import routes as v1_routes
from app.db.database import Base, engine

# This creates all the database tables defined in your models
# based on the SQLAlchemy Base metadata. It's suitable for development.
# For production, it's recommended to use a migration tool like Alembic.
Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application instance
app = FastAPI(
    title="Ziver Backend API",
    description="API for Ziver: Gamifying Web3 Engagement & Empowering the TON Ecosystem.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# A list of allowed origins. These are the URLs that can make requests to your API.
origins = [
    "https://ziver-mvp-frontend.onrender.com",  # Your deployed frontend
    "http://localhost:8080",                   # Your local dev URL
    "http://localhost:8000",                   # Your local dev URL
    "http://localhost:5173",                   # Default Vite dev URL (common)
]

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Use the specific list of origins
    allow_credentials=True,
    allow_methods=["*"],        # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allows all headers
)

# Include all the API endpoints from the v1 router WITH the /api/v1 prefix
app.include_router(v1_routes.router, prefix="/api/v1")


@app.get("/")
async def root():
    """
    Root endpoint for a basic health check.
    """
    return {
        "message": "Welcome to Ziver Backend API! Visit /docs for the interactive API documentation."
    }
