"""AI Orchestrator using LangGraph for state machine management.

Implements the LangGraph state machine for the 3-Minute Profiler workflow:
1. Welcome Node (Greeting)
2. Profiler Node (Life event detection)
3. Product Mapper Node (Vector search for ET products)
4. Cross-sell Node (Additional recommendations)
"""

from typing import Dict, List, Optional, TypedDict
import json

from langgraph.graph import StateGraph, END

from app.core.config import settings
from app.services.ai.groq_llm import GroqLLMService
from app.services.et_products.vector_store import VectorStore


class AIState(TypedDict):
    """State definition for the AI orchestrator."""
    session_id: str
    user_id: Optional[int]
    current_node: str
    message: str
    context: Dict
    collected_data: Dict
    life_events: List[str]
    extracted_entities: Dict
    recommendations: List[Dict]
    response: str
    confidence: float


class AIOrchestrator:
    """LangGraph-based AI orchestrator for the ET Concierge."""
    
    def __init__(self):
        self.llm = GroqLLMService()
        self.vector_store: Optional[VectorStore] = None
        self.graph = self._build_graph()
    
    async def process_message(
        self,
        message: str,
        session_id: Optional[str] = None,
        user_id: Optional[int] = None,
        context: Optional[Dict] = None
    ) -> Dict:
        """Process a user message through the LangGraph state machine."""
        
        # Initialize vector store if not already done
        if self.vector_store is None:
            self.vector_store = VectorStore()
            await self.vector_store.initialize()
        
        # Create initial state
        initial_state: AIState = {
            "session_id": session_id or self._generate_session_id(),
            "user_id": user_id,
            "current_node": "welcome",
            "message": message,
            "context": context or {},
            "collected_data": {},
            "life_events": [],
            "extracted_entities": {},
            "recommendations": [],
            "response": "",
            "confidence": 0.0
        }
        
        # Run through the graph
        result = await self.graph.ainvoke(initial_state)
        
        return {
            "response": result["response"],
            "session_id": result["session_id"],
            "current_node": result["current_node"],
            "recommendations": result["recommendations"],
            "actions": self._determine_actions(result),
            "confidence": result["confidence"]
        }
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph state machine."""
        
        # Create graph
        workflow = StateGraph(AIState)
        
        # Add nodes
        workflow.add_node("welcome", self._welcome_node)
        workflow.add_node("profiler", self._profiler_node)
        workflow.add_node("product_mapper", self._product_mapper_node)
        workflow.add_node("cross_sell", self._cross_sell_node)
        workflow.add_node("marketplace", self._marketplace_node)
        
        # Add edges
        workflow.add_edge("welcome", "profiler")
        workflow.add_edge("profiler", "product_mapper")
        workflow.add_edge("product_mapper", "cross_sell")
        workflow.add_edge("cross_sell", "marketplace")
        workflow.add_edge("marketplace", END)
        
        # Set entry point
        workflow.set_entry_point("welcome")
        
        return workflow.compile()
    
    async def _welcome_node(self, state: AIState) -> AIState:
        """Welcome node - Initial greeting and rapport building."""
        
        prompt = f"""
        You are the ET AI Concierge, a friendly financial assistant for The Economic Times.
        
        User message: {state['message']}
        Context: {json.dumps(state['context'])}
        
        Provide a warm, professional greeting. If this is the first interaction,
        introduce yourself and mention you can help with:
        - 3-minute financial profiling
        - Tax planning and optimization
        - Investment recommendations
        - ET product suggestions
        - IPO tracking and alerts
        
        Keep the response conversational and inviting. Ask one open-ended question
        to understand the user's current financial situation or life stage.
        """
        
        response = await self.llm.generate(
            prompt=prompt,
            model=settings.GROQ_MODEL_FAST,
            temperature=0.7
        )
        
        state["response"] = response
        state["current_node"] = "profiler"
        state["confidence"] = 0.8
        
        return state
    
    async def _profiler_node(self, state: AIState) -> AIState:
        """Profiler node - Extract life events and financial entities."""
        
        prompt = f"""
        Analyze this user message and extract financial/life information:
        
        User message: {state['message']}
        
        Return ONLY a JSON object with this structure:
        {{
            "life_events": ["list of detected life events"],
            "entities": {{
                "income": "extracted or null",
                "age": "extracted or null",
                "family_status": "extracted or null",
                "goals": ["list of goals"],
                "risk_appetite": "extracted or null"
            }},
            "intent": "primary user intent",
            "follow_up_question": "what to ask next"
        }}
        
        Life events to detect: getting_married, having_baby, buying_home, 
        career_change, retirement_planning, starting_business, education_planning
        """
        
        response = await self.llm.generate(
            prompt=prompt,
            model=settings.GROQ_MODEL_REASONING,
            temperature=0.2,
            json_mode=True
        )
        
        try:
            extracted = json.loads(response)
            state["life_events"] = extracted.get("life_events", [])
            state["extracted_entities"] = extracted.get("entities", {})
            state["collected_data"].update(extracted.get("entities", {}))
            
            # Append follow-up to response
            state["response"] = f"{state['response']}\n\n{extracted.get('follow_up_question', '')}".strip()
        except json.JSONDecodeError:
            state["life_events"] = []
            state["extracted_entities"] = {}
        
        state["current_node"] = "product_mapper"
        return state
    
    async def _product_mapper_node(self, state: AIState) -> AIState:
        """Product mapper node - Search vector DB for relevant ET products."""
        
        if not self.vector_store:
            state["recommendations"] = []
            state["current_node"] = "cross_sell"
            return state
        
        # Build search query from collected data
        search_terms = []
        if state["life_events"]:
            search_terms.extend(state["life_events"])
        if state["extracted_entities"].get("goals"):
            search_terms.extend(state["extracted_entities"]["goals"])
        
        query = " ".join(search_terms) if search_terms else "financial planning"
        
        # Search vector store
        products = await self.vector_store.search(
            query=query,
            top_k=settings.VECTOR_SEARCH_TOP_K
        )
        
        # Format recommendations
        recommendations = []
        for product in products:
            recommendations.append({
                "product_id": product["id"],
                "name": product["name"],
                "category": product["category"],
                "relevance_score": product["score"],
                "reasoning": product.get("reasoning", ""),
                "benefits": product.get("benefits", []),
                "match_factors": product.get("match_factors", [])
            })
        
        state["recommendations"] = recommendations
        
        # Generate explanation
        prompt = f"""
        Based on the user's profile:
        - Life events: {', '.join(state['life_events'])}
        - Goals: {', '.join(state['extracted_entities'].get('goals', []))}
        
        Explain why these ET products would be relevant in 2-3 sentences:
        {', '.join([r['name'] for r in recommendations[:3]])}
        """
        
        explanation = await self.llm.generate(
            prompt=prompt,
            model=settings.GROQ_MODEL_FAST,
            temperature=0.6
        )
        
        state["response"] = f"{state['response']}\n\n{explanation}".strip()
        state["current_node"] = "cross_sell"
        
        return state
    
    async def _cross_sell_node(self, state: AIState) -> AIState:
        """Cross-sell node - Suggest complementary products."""
        
        # Logic to determine cross-sell opportunities
        cross_sells = []
        
        if "tax_saver" in [r["category"] for r in state["recommendations"]]:
            cross_sells.append({
                "product": "ET Prime Subscription",
                "reasoning": "Get expert tax planning insights"
            })
        
        if "retirement" in state["life_events"]:
            cross_sells.append({
                "product": "Retirement Planning Guide",
                "reasoning": "Comprehensive retirement corpus calculator"
            })
        
        state["collected_data"]["cross_sell"] = cross_sells
        state["current_node"] = "marketplace"
        
        return state
    
    async def _marketplace_node(self, state: AIState) -> AIState:
        """Marketplace node - Connect to external services if needed."""
        
        # Check if user needs external services
        needs_insurance = any("insurance" in event.lower() for event in state["life_events"])
        needs_loan = any(word in state["message"].lower() for word in ["home", "loan", "mortgage"])
        
        marketplace_actions = []
        
        if needs_insurance:
            marketplace_actions.append({
                "type": "marketplace",
                "service": "insurance_comparison",
                "message": "Compare insurance plans from top providers"
            })
        
        if needs_loan:
            marketplace_actions.append({
                "type": "marketplace", 
                "service": "loan_eligibility",
                "message": "Check your loan eligibility"
            })
        
        state["collected_data"]["marketplace_actions"] = marketplace_actions
        state["current_node"] = "complete"
        state["confidence"] = min(0.95, 0.7 + len(state["recommendations"]) * 0.05)
        
        return state
    
    def _determine_actions(self, state: AIState) -> List[Dict]:
        """Determine follow-up actions based on state."""
        actions = []
        
        if state["recommendations"]:
            actions.append({
                "type": "view_products",
                "label": "View Recommendations",
                "data": state["recommendations"][:3]
            })
        
        if state["collected_data"].get("marketplace_actions"):
            actions.extend(state["collected_data"]["marketplace_actions"])
        
        actions.append({
            "type": "continue_chat",
            "label": "Ask Follow-up",
            "data": {}
        })
        
        return actions
    
    def _generate_session_id(self) -> str:
        """Generate a unique session ID."""
        import uuid
        return str(uuid.uuid4())
