"""Document processing service for financial document analysis."""

import re
from typing import Dict, Any

from app.services.ai.groq_llm import GroqLLMService


class DocumentProcessor:
    """Process financial documents and extract key information."""
    
    def __init__(self):
        self.llm = GroqLLMService()
    
    async def analyze(self, content: str, doc_type: str) -> Dict[str, Any]:
        """Analyze document content and extract structured information."""
        
        # Clean content
        content = self._clean_content(content)
        
        # Route to specific analyzer
        if doc_type == "salary_slip":
            return await self._analyze_salary_slip(content)
        elif doc_type == "form16":
            return await self._analyze_form16(content)
        elif doc_type == "bank_statement":
            return await self._analyze_bank_statement(content)
        elif doc_type == "insurance":
            return await self._analyze_insurance(content)
        else:
            return await self._generic_analysis(content)
    
    def _clean_content(self, content: str) -> str:
        """Clean extracted document content."""
        # Remove extra whitespace
        content = re.sub(r'\s+', ' ', content)
        # Remove special characters but keep currency symbols
        content = re.sub(r'[^\w\s\.\-,₹$%]', '', content)
        return content.strip()
    
    async def _analyze_salary_slip(self, content: str) -> Dict[str, Any]:
        """Extract information from salary slip."""
        
        patterns = {
            "employee_name": r'(?:Employee\s*Name|Name)[:\s]+([A-Za-z\s]+)',
            "employee_id": r'(?:Employee\s*ID|ID)[:\s]+(\w+)',
            "basic_salary": r'(?:Basic\s*Salary|Basic)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "hra": r'(?:HRA|House\s*Rent)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "special_allowance": r'(?:Special\s*Allowance)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "pf_contribution": r'(?:PF|Provident\s*Fund)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "professional_tax": r'(?:Professional\s*Tax)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "tds": r'(?:TDS|Tax\s*Deducted)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "net_salary": r'(?:Net\s*Salary|Take\s*Home)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
        }
        
        extracted = self._extract_with_patterns(content, patterns)
        
        # Calculate missing fields
        basic = float(extracted.get("basic_salary", "0").replace(",", ""))
        hra = float(extracted.get("hra", "0").replace(",", ""))
        special = float(extracted.get("special_allowance", "0").replace(",", ""))
        pf = float(extracted.get("pf_contribution", "0").replace(",", ""))
        pt = float(extracted.get("professional_tax", "0").replace(",", ""))
        tds = float(extracted.get("tds", "0").replace(",", ""))
        
        gross = basic + hra + special
        net = gross - pf - pt - tds
        annual_ctc = gross * 12
        
        if not extracted.get("net_salary"):
            extracted["net_salary"] = net
        
        extracted["gross_salary"] = gross
        extracted["annual_ctc"] = annual_ctc
        extracted["monthly_in_hand"] = net
        
        return {
            "document_type": "Salary Slip",
            "extracted_fields": extracted,
            "confidence": "High" if len(extracted) > 5 else "Medium",
            "recommendations": [
                f"Your monthly in-hand salary is ₹{net:,.2f}",
                f"Annual CTC: ₹{annual_ctc:,.2f}",
                "Consider maximizing your 80C deductions up to ₹1.5L",
                "Review your HRA exemption eligibility"
            ],
            "tax_implications": {
                "monthly_tds": tds,
                "projected_annual_tax": tds * 12,
                "suggested_80c_investment": max(0, 150000 - pf * 12)
            }
        }
    
    async def _analyze_form16(self, content: str) -> Dict[str, Any]:
        """Extract information from Form 16."""
        
        patterns = {
            "pan": r'(?:PAN|Permanent\s*Account\s*Number)[:\s]+([A-Z]{5}\d{4}[A-Z])',
            "tan": r'(?:TAN)[:\s]+([A-Z]{4}\d{5}[A-Z])',
            "assessment_year": r'(?:Assessment\s*Year)[:\s]+(\d{4}-\d{2})',
            "gross_salary": r'(?:Gross\s*Salary)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "exemptions": r'(?:Exemptions)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "deductions_80c": r'(?:80C|Section\s*80C)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "deductions_80d": r'(?:80D|Section\s*80D)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "taxable_income": r'(?:Taxable\s*Income)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "tds_deducted": r'(?:TDS|Tax\s*Deducted)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
        }
        
        extracted = self._extract_with_patterns(content, patterns)
        
        taxable = float(extracted.get("taxable_income", "0").replace(",", ""))
        tds = float(extracted.get("tds_deducted", "0").replace(",", ""))
        c_80c = float(extracted.get("deductions_80c", "0").replace(",", ""))
        
        # Calculate remaining 80C limit
        remaining_80c = max(0, 150000 - c_80c)
        
        return {
            "document_type": "Form 16",
            "extracted_fields": extracted,
            "confidence": "High" if extracted.get("pan") else "Medium",
            "recommendations": [
                f"Taxable income: ₹{taxable:,.2f}",
                f"TDS deducted: ₹{tds:,.2f}",
                f"You can still invest ₹{remaining_80c:,.2f} under 80C" if remaining_80c > 0 else "You've maximized your 80C deductions!",
                "Consider NPS for additional ₹50,000 deduction under 80CCD(1B)"
            ],
            "tax_implications": {
                "taxable_income": taxable,
                "tds_deducted": tds,
                "remaining_80c_limit": remaining_80c
            }
        }
    
    async def _analyze_bank_statement(self, content: str) -> Dict[str, Any]:
        """Extract information from bank statement."""
        
        patterns = {
            "account_number": r'(?:Account\s*Number|A/c\s*No)[:\s]+(\d+)',
            "account_holder": r'(?:Account\s*Holder|Name)[:\s]+([A-Za-z\s]+)',
            "bank_name": r'(?:Bank)[:\s]+([A-Za-z\s]+)',
            "opening_balance": r'(?:Opening\s*Balance)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "closing_balance": r'(?:Closing\s*Balance)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
        }
        
        extracted = self._extract_with_patterns(content, patterns)
        
        # Extract transactions
        transaction_pattern = r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+([\w\s]+?)\s+([\d,]+\.?\d*)'
        transactions = re.findall(transaction_pattern, content)
        
        opening = float(extracted.get("opening_balance", "0").replace(",", ""))
        closing = float(extracted.get("closing_balance", "0").replace(",", ""))
        
        return {
            "document_type": "Bank Statement",
            "extracted_fields": extracted,
            "confidence": "Medium",
            "recommendations": [
                f"Average monthly balance: ₹{((opening + closing) / 2):,.2f}",
                f"Closing balance: ₹{closing:,.2f}",
                "Track your expenses by category",
                "Set up automatic savings transfers",
                f"Found {len(transactions)} transactions in statement"
            ],
            "tax_implications": {
                "interest_income_estimate": closing * 0.03  # Assume 3% interest rate
            }
        }
    
    async def _analyze_insurance(self, content: str) -> Dict[str, Any]:
        """Extract information from insurance policy."""
        
        patterns = {
            "policy_number": r'(?:Policy\s*Number|Policy\s*No)[:\s]+(\w+)',
            "policy_holder": r'(?:Policy\s*Holder|Insured)[:\s]+([A-Za-z\s]+)',
            "insurance_type": r'(?:Type|Plan\s*Type)[:\s]+([A-Za-z\s]+)',
            "sum_assured": r'(?:Sum\s*Assured|Coverage)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "premium_amount": r'(?:Premium)[:\s]+[₹$]?\s*([\d,]+\.?\d*)',
            "premium_frequency": r'(?:Frequency|Mode)[:\s]+(\w+)',
            "policy_term": r'(?:Term|Policy\s*Term)[:\s]+(\d+)\s*years?',
        }
        
        extracted = self._extract_with_patterns(content, patterns)
        
        sum_assured = float(extracted.get("sum_assured", "0").replace(",", ""))
        premium = float(extracted.get("premium_amount", "0").replace(",", ""))
        
        return {
            "document_type": "Insurance Policy",
            "extracted_fields": extracted,
            "confidence": "High" if extracted.get("policy_number") else "Medium",
            "recommendations": [
                f"Sum assured: ₹{sum_assured:,.2f}",
                f"Premium: ₹{premium:,.2f}",
                "Ensure coverage is at least 10x your annual income",
                "Review beneficiaries periodically",
                "Premium qualifies for 80C deduction" if "life" in extracted.get("insurance_type", "").lower() else "Health premium qualifies for 80D deduction"
            ],
            "tax_implications": {
                "80c_eligible": "life" in extracted.get("insurance_type", "").lower(),
                "80d_eligible": "health" in extracted.get("insurance_type", "").lower(),
                "annual_premium": premium * 12 if extracted.get("premium_frequency", "").lower() == "monthly" else premium
            }
        }
    
    async def _generic_analysis(self, content: str) -> Dict[str, Any]:
        """Generic document analysis using LLM."""
        
        prompt = f"""
        Analyze this financial document and extract key information:
        
        {content[:3000]}
        
        Return a JSON with:
        - document_type: inferred type
        - extracted_fields: key-value pairs
        - summary: brief summary
        - recommendations: list of actionable insights
        """
        
        try:
            response = await self.llm.generate(prompt=prompt, json_mode=True)
            import json
            return json.loads(response)
        except:
            return {
                "document_type": "Unknown",
                "extracted_fields": {},
                "confidence": "Low",
                "recommendations": ["Could not analyze document automatically"]
            }
    
    def _extract_with_patterns(self, content: str, patterns: Dict[str, str]) -> Dict[str, str]:
        """Extract data using regex patterns."""
        extracted = {}
        
        for field, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                extracted[field] = match.group(1).strip()
        
        return extracted
