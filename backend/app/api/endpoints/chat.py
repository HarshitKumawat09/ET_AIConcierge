"""Chat API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai.orchestrator import AIOrchestrator

router = APIRouter()


@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    """Process a chat message and return AI response."""
    try:
        orchestrator = AIOrchestrator()
        result = await orchestrator.process_message(
            message=request.message,
            session_id=request.session_id,
            user_id=request.user_id,
            context=request.context
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get chat session history."""
    # Implementation would fetch from database
    return {"session_id": session_id, "messages": []}
