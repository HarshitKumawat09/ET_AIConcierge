"""Application configuration using Pydantic Settings."""

from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "ET AI Concierge"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/et_concierge"
    
    # Groq LLM
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL_REASONING: str = "llama-3.3-70b-reasoning"
    GROQ_MODEL_FAST: str = "llama-3.1-8b-instant"
    GROQ_TEMPERATURE: float = 0.3
    GROQ_MAX_TOKENS: int = 4096
    
    # Vector Store (ChromaDB)
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "et_products"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    VECTOR_SEARCH_TOP_K: int = 5
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
