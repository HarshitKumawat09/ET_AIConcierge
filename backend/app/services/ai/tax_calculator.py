"""Tax calculator service for Indian tax computation."""

from typing import Dict, List


class TaxCalculator:
    """Calculate tax liability under Indian tax regime."""
    
    # Tax slabs for New Regime (FY 2024-25)
    NEW_REGIME_SLABS = [
        (0, 300000, 0),
        (300000, 700000, 0.05),
        (700000, 1000000, 0.10),
        (1000000, 1200000, 0.15),
        (1200000, 1500000, 0.20),
        (1500000, float('inf'), 0.30)
    ]
    
    # Tax slabs for Old Regime
    OLD_REGIME_SLABS = [
        (0, 250000, 0),
        (250000, 500000, 0.05),
        (500000, 1000000, 0.20),
        (1000000, float('inf'), 0.30)
    ]
    
    async def calculate(
        self,
        income: float,
        deductions_80c: float = 0,
        deductions_80d: float = 0,
        hra: float = 0,
        other_income: float = 0,
        regime: str = "new"
    ) -> Dict:
        """Calculate tax liability."""
        
        # Standard deduction
        standard_deduction = 50000 if regime == "new" else 0
        
        # Calculate taxable income
        if regime == "new":
            # New regime: minimal deductions allowed
            taxable_income = max(0, income + other_income - standard_deduction)
            slabs = self.NEW_REGIME_SLABS
        else:
            # Old regime: deductions allowed
            total_deductions = min(deductions_80c, 150000)  # 80C limit
            total_deductions += min(deductions_80d, 25000)  # 80D limit (self)
            total_deductions += min(hra, 0.4 * income)  # HRA limit
            
            taxable_income = max(0, income + other_income - standard_deduction - total_deductions)
            slabs = self.OLD_REGIME_SLABS
        
        # Calculate tax
        tax = self._calculate_tax_from_slabs(taxable_income, slabs)
        
        # Add cess (4% health and education cess)
        cess = tax * 0.04
        total_tax = tax + cess
        
        # Calculate effective rate
        total_income = income + other_income
        effective_rate = (total_tax / total_income * 100) if total_income > 0 else 0
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            income, deductions_80c, regime, taxable_income, total_tax
        )
        
        # Monthly TDS estimate
        monthly_tds = total_tax / 12 if total_tax > 0 else 0
        
        return {
            "total_income": total_income,
            "taxable_income": taxable_income,
            "tax_liability": round(total_tax, 2),
            "effective_tax_rate": round(effective_rate, 2),
            "savings_recommendations": recommendations,
            "monthly_tds": round(monthly_tds, 2),
            "regime": regime,
            "breakdown": {
                "base_tax": round(tax, 2),
                "cess": round(cess, 2)
            }
        }
    
    def _calculate_tax_from_slabs(self, income: float, slabs: List) -> float:
        """Calculate tax based on slabs."""
        tax = 0
        remaining = income
        
        for low, high, rate in slabs:
            if remaining <= 0:
                break
            
            taxable_in_slab = min(remaining, high - low)
            tax += taxable_in_slab * rate
            remaining -= taxable_in_slab
        
        return tax
    
    def _generate_recommendations(
        self,
        income: float,
        deductions_80c: float,
        regime: str,
        taxable_income: float,
        total_tax: float
    ) -> List[str]:
        """Generate tax saving recommendations."""
        
        recommendations = []
        
        if regime == "new":
            recommendations.append("Consider switching to Old Regime if you have significant deductions")
            
            if income > 700000:
                recommendations.append("Your income exceeds ₹7L - you are not eligible for full rebate under Section 87A")
        else:
            # Old regime recommendations
            remaining_80c = 150000 - deductions_80c
            if remaining_80c > 0:
                recommendations.append(f"Invest ₹{remaining_80c:,.0f} more in 80C instruments (ELSS, PPF, LIC)")
                recommendations.append("Consider ELSS mutual funds for tax saving + wealth creation")
            else:
                recommendations.append("You've maximized your 80C deductions!")
            
            recommendations.append("Start NPS for additional ₹50,000 deduction under 80CCD(1B)")
            recommendations.append("Get health insurance for family - 80D allows ₹25,000 deduction")
        
        # General recommendations
        if total_tax > 100000:
            recommendations.append("Consider advance tax payment to avoid interest penalties")
        
        recommendations.append("Review Form 16 for any discrepancies in TDS")
        recommendations.append("File ITR before July 31st to avoid late fees")
        
        return recommendations
    
    async def get_savings_suggestions(self, income: float, current_80c: float = 0) -> List[Dict]:
        """Get specific tax saving investment suggestions."""
        
        suggestions = []
        remaining = max(0, 150000 - current_80c)
        
        if remaining > 0:
            suggestions.append({
                "instrument": "ELSS Mutual Funds",
                "amount": min(remaining, 50000),
                "benefits": ["3-year lock-in", "Potential high returns", "Tax saving"],
                "risk": "High",
                "expected_return": "12-15%"
            })
            
            suggestions.append({
                "instrument": "PPF (Public Provident Fund)",
                "amount": min(remaining, 50000),
                "benefits": ["15-year tenure", "Guaranteed returns", "Tax-free interest"],
                "risk": "Low",
                "expected_return": "7.1%"
            })
            
            suggestions.append({
                "instrument": "Term Insurance Premium",
                "amount": min(remaining, 20000),
                "benefits": ["Life cover", "Peace of mind", "80C benefit"],
                "risk": "None",
                "expected_return": "Protection only"
            })
        
        # NPS suggestion
        suggestions.append({
            "instrument": "National Pension System (NPS)",
            "amount": 50000,
            "benefits": ["Additional 80CCD(1B) deduction", "Retirement corpus", "Market-linked returns"],
            "risk": "Medium",
            "expected_return": "9-11%",
            "section": "80CCD(1B)"
        })
        
        return suggestions
