"""Document analysis API endpoints."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import DocumentAnalysisRequest, DocumentAnalysisResponse
from app.services.ai.document_processor import DocumentProcessor

router = APIRouter()


@router.post("/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(request: DocumentAnalysisRequest):
    """Analyze a financial document and extract key information."""
    try:
        processor = DocumentProcessor()
        result = await processor.analyze(
            content=request.content,
            doc_type=request.document_type
        )
        return DocumentAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
