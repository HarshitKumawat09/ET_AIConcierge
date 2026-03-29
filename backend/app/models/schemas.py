"""Pydantic schemas for API request/response validation."""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    """User profile schema."""
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    income_profile: Dict = Field(default_factory=dict)
    family_members: List[Dict] = Field(default_factory=list)
    risk_profile: str = "balanced"
    life_stage: Optional[str] = None


class ChatMessageSchema(BaseModel):
    """Chat message schema."""
    role: str  # user, assistant, system
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    intent: Optional[str] = None
    entities: List[Dict] = Field(default_factory=list)


class ChatSessionSchema(BaseModel):
    """Chat session schema."""
    session_id: str
    user_id: int
    current_node: str = "welcome"
    collected_data: Dict = Field(default_factory=dict)
    messages: List[ChatMessageSchema] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str
    session_id: Optional[str] = None
    user_id: Optional[int] = None
    context: Optional[Dict] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    response: str
    session_id: str
    current_node: str
    recommendations: List[Dict] = Field(default_factory=list)
    actions: List[Dict] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0)


class GoalSchema(BaseModel):
    """Financial goal schema."""
    title: str
    target_amount: Optional[float] = None
    current_amount: float = 0
    deadline: Optional[datetime] = None
    category: str  # emergency, retirement, education, vacation, etc.
    priority: str = "medium"


class ProductRecommendation(BaseModel):
    """ET product recommendation schema."""
    product_id: str
    name: str
    category: str
    relevance_score: float
    reasoning: str
    benefits: List[str]
    match_factors: List[str]


class DocumentAnalysisRequest(BaseModel):
    """Request for document analysis."""
    document_type: str  # salary_slip, form16, bank_statement, insurance
    content: str
    file_type: str = "pdf"


class DocumentAnalysisResponse(BaseModel):
    """Response for document analysis."""
    document_type: str
    extracted_fields: Dict[str, Any]
    confidence: str
    recommendations: List[str]
    tax_implications: Optional[Dict] = None


class TaxCalculationRequest(BaseModel):
    """Request for tax calculation."""
    income: float
    deductions_80c: float = 0
    deductions_80d: float = 0
    hra: float = 0
    other_income: float = 0
    regime: str = "new"  # old or new


class TaxCalculationResponse(BaseModel):
    """Response for tax calculation."""
    total_income: float
    taxable_income: float
    tax_liability: float
    effective_tax_rate: float
    savings_recommendations: List[str]
    monthly_tds: float
