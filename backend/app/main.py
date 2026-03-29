"""ET AI Concierge Backend Application

FastAPI backend with AI orchestration using LangGraph, Groq LLM, ChromaDB vector search,
and PostgreSQL for session management.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.services.et_products.vector_store import VectorStore


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    setup_logging()
    
    # Initialize vector store
    vector_store = VectorStore()
    await vector_store.initialize()
    app.state.vector_store = vector_store
    
    yield
    
    # Shutdown
    if hasattr(app.state, 'vector_store'):
        await app.state.vector_store.close()


app = FastAPI(
    title="ET AI Concierge API",
    description="AI-powered financial concierge with LangGraph orchestration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}
