"""API router configuration."""

from fastapi import APIRouter

from app.api.endpoints import chat, documents, goals, tax, users, websocket

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(tax.router, prefix="/tax", tags=["tax"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
