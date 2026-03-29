"""Tax planning API endpoints."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import TaxCalculationRequest, TaxCalculationResponse
from app.services.ai.tax_calculator import TaxCalculator

router = APIRouter()


@router.post("/calculate", response_model=TaxCalculationResponse)
async def calculate_tax(request: TaxCalculationRequest):
    """Calculate tax liability and provide savings recommendations."""
    try:
        calculator = TaxCalculator()
        result = await calculator.calculate(
            income=request.income,
            deductions_80c=request.deductions_80c,
            deductions_80d=request.deductions_80d,
            hra=request.hra,
            other_income=request.other_income,
            regime=request.regime
        )
        return TaxCalculationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/savings-suggestions")
async def get_savings_suggestions(income: float, current_80c: float = 0):
    """Get tax savings suggestions based on income and current investments."""
    try:
        calculator = TaxCalculator()
        suggestions = await calculator.get_savings_suggestions(
            income=income,
            current_80c=current_80c
        )
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
