"""Groq LLM service for text generation and reasoning."""

from typing import Optional
import httpx

from app.core.config import settings


class GroqLLMService:
    """Service for interacting with Groq LLM API."""
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
        json_mode: bool = False
    ) -> str:
        """Generate text using Groq LLM."""
        
        if not self.api_key:
            # Return mock response for development
            return self._mock_response(prompt)
        
        model = model or settings.GROQ_MODEL_FAST
        
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=30.0
            )
            
            response.raise_for_status()
            data = response.json()
            
            return data["choices"][0]["message"]["content"]
    
    async def analyze_intent(self, message: str) -> dict:
        """Analyze user message intent and extract entities."""
        
        prompt = f"""
        Analyze this user message and extract intent and entities:
        
        Message: {message}
        
        Return JSON with:
        - intent: primary intent (greeting, question, goal_setting, tax_query, etc.)
        - entities: key entities mentioned
        - sentiment: positive, neutral, or negative
        - urgency: high, medium, low
        """
        
        response = await self.generate(
            prompt=prompt,
            model=settings.GROQ_MODEL_REASONING,
            temperature=0.2,
            json_mode=True
        )
        
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "intent": "unknown",
                "entities": {},
                "sentiment": "neutral",
                "urgency": "low"
            }
    
    def _mock_response(self, prompt: str) -> str:
        """Generate mock response for development without API key."""
        
        if "welcome" in prompt.lower() or "greeting" in prompt.lower():
            return """Welcome to ET AI Concierge! I'm your personal financial assistant powered by The Economic Times. 

I can help you with:
• 3-minute financial profiling
• Tax planning and optimization  
• Personalized investment recommendations
• ET product suggestions
• IPO tracking and alerts

What brings you here today? Are you looking to plan for a specific goal or need help with tax savings?"""
        
        elif "json" in prompt.lower() or "extract" in prompt.lower():
            return """{
    "life_events": [],
    "entities": {
        "income": null,
        "age": null,
        "family_status": null,
        "goals": [],
        "risk_appetite": null
    },
    "intent": "greeting",
    "follow_up_question": "Could you tell me about your current financial situation and any goals you're working toward?"
}"""
        
        else:
            return "I understand. Let me help you with that. Could you provide more details about your financial situation?"
