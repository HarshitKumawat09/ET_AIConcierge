"""WebSocket endpoint for real-time chat."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

from app.services.ai.orchestrator import AIOrchestrator

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections."""
    
    def __init__(self):
        self.active_connections: dict = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
    
    async def send_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json(message)


manager = ConnectionManager()


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time AI chat."""
    await manager.connect(websocket, client_id)
    orchestrator = AIOrchestrator()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process with AI orchestrator
            result = await orchestrator.process_message(
                message=message_data.get("message", ""),
                session_id=message_data.get("session_id"),
                user_id=message_data.get("user_id"),
                context=message_data.get("context", {})
            )
            
            # Send response back to client
            await manager.send_message(client_id, {
                "type": "response",
                "data": result
            })
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        await manager.send_message(client_id, {
            "type": "error",
            "message": str(e)
        })
        manager.disconnect(client_id)
