"""Goals API endpoints."""

from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import GoalSchema

router = APIRouter()


@router.post("/")
async def create_goal(goal: GoalSchema):
    """Create a new financial goal."""
    # Implementation would save to database
    return {"id": 1, **goal.dict(), "status": "created"}


@router.get("/", response_model=List[GoalSchema])
async def list_goals(user_id: int):
    """List all goals for a user."""
    # Implementation would fetch from database
    return []


@router.get("/{goal_id}")
async def get_goal(goal_id: int):
    """Get a specific goal."""
    # Implementation would fetch from database
    return {"id": goal_id}


@router.put("/{goal_id}")
async def update_goal(goal_id: int, goal: GoalSchema):
    """Update a goal."""
    # Implementation would update database
    return {"id": goal_id, **goal.dict()}


@router.delete("/{goal_id}")
async def delete_goal(goal_id: int):
    """Delete a goal."""
    # Implementation would delete from database
    return {"message": "Goal deleted"}
