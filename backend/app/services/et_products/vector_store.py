"""ChromaDB vector store for ET product knowledge graph."""

from typing import Dict, List, Optional

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings


class VectorStore:
    """Vector store for ET product recommendations using ChromaDB."""
    
    def __init__(self):
        self.client: Optional[chromadb.Client] = None
        self.collection = None
    
    async def initialize(self):
        """Initialize ChromaDB client and collection."""
        
        # Create persistent client
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(
                anonymized_telemetry=False
            )
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        
        # Initialize with ET products if empty
        if self.collection.count() == 0:
            await self._seed_products()
    
    async def _seed_products(self):
        """Seed the vector store with ET financial products."""
        
        products = [
            {
                "id": "et_tax_saver_1",
                "name": "ET Tax Saver Fund - Direct Plan",
                "category": "tax_saver",
                "description": "ELSS mutual fund for 80C tax saving with 3-year lock-in. Equity-linked savings scheme with high return potential.",
                "benefits": ["3-year lock-in", "Tax saving under 80C", "High return potential", "Professional management"],
                "match_factors": ["tax_saving", "long_term_growth", "equity_exposure"]
            },
            {
                "id": "et_retirement_1",
                "name": "ET Retirement Wealth Builder",
                "category": "retirement",
                "description": "Long-term wealth creation fund designed for retirement planning with balanced risk profile.",
                "benefits": ["Long-term compounding", "Balanced risk", "Automatic rebalancing", "Goal-based investing"],
                "match_factors": ["retirement", "long_term", "wealth_creation"]
            },
            {
                "id": "et_emergency_1",
                "name": "ET Liquid Plus Fund",
                "category": "emergency",
                "description": "Liquid fund for emergency corpus with instant redemption and capital preservation.",
                "benefits": ["Instant redemption", "Capital preservation", "Better than savings account", "No lock-in"],
                "match_factors": ["emergency_fund", "liquidity", "safety"]
            },
            {
                "id": "et_child_1",
                "name": "ET Child Future Fund",
                "category": "education",
                "description": "Goal-based fund for child's education and future expenses with step-up SIP option.",
                "benefits": ["Goal-based investing", "Step-up SIP", "Education focused", "Long-term horizon"],
                "match_factors": ["child_education", "long_term", "goal_based"]
            },
            {
                "id": "et_insure_1",
                "name": "ET Protect+ Term Plan",
                "category": "insurance",
                "description": "Pure term insurance with high coverage at affordable premiums. Return of premium option available.",
                "benefits": ["High coverage", "Low premium", "Rider options", "Tax benefits"],
                "match_factors": ["protection", "life_cover", "affordable"]
            },
            {
                "id": "et_health_1",
                "name": "ET Health Shield",
                "category": "health_insurance",
                "description": "Comprehensive health insurance with cashless claims and no room rent capping.",
                "benefits": ["Cashless claims", "No room rent cap", "Pre-existing cover", "Annual health checkup"],
                "match_factors": ["health", "protection", "family"]
            },
            {
                "id": "et_prime_1",
                "name": "ET Prime Subscription",
                "category": "subscription",
                "description": "Premium subscription for exclusive financial insights, market analysis, and expert recommendations.",
                "benefits": ["Expert analysis", "Exclusive reports", "Market insights", "Portfolio tracking"],
                "match_factors": ["knowledge", "expert_guidance", "market_updates"]
            },
            {
                "id": "et_nps_1",
                "name": "ET NPS Tier 1",
                "category": "retirement",
                "description": "National Pension System tier 1 account for additional tax benefit under 80CCD(1B) and retirement corpus.",
                "benefits": ["Additional 50K tax benefit", "Market-linked returns", "Low cost", "Pension income"],
                "match_factors": ["retirement", "additional_tax_benefit", "pension"]
            }
        ]
        
        # Add documents to collection
        documents = [p["description"] + " " + " ".join(p["benefits"]) for p in products]
        metadatas = [{k: v for k, v in p.items() if k != "id"} for p in products]
        ids = [p["id"] for p in products]
        
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    
    async def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for relevant products based on query."""
        
        if not self.collection:
            return []
        
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        products = []
        for i, doc_id in enumerate(results["ids"][0]):
            metadata = results["metadatas"][0][i]
            distance = results["distances"][0][i]
            
            # Convert distance to similarity score (0-1)
            score = 1 - min(distance, 1.0)
            
            products.append({
                "id": doc_id,
                **metadata,
                "score": round(score, 3),
                "reasoning": f"Matches your financial goals and life stage"
            })
        
        return products
    
    async def add_product(self, product: Dict):
        """Add a new product to the vector store."""
        
        if not self.collection:
            return
        
        doc = product["description"] + " " + " ".join(product.get("benefits", []))
        metadata = {k: v for k, v in product.items() if k != "id"}
        
        self.collection.add(
            documents=[doc],
            metadatas=[metadata],
            ids=[product["id"]]
        )
    
    async def close(self):
        """Close the vector store connection."""
        # ChromaDB persistent client doesn't need explicit closing
        pass
