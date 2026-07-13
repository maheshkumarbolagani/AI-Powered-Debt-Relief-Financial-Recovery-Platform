from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Base, engine

# Import all models
from models.user import User
from models.loan import Loan
from models.financial_profile import FinancialProfile
from models.settlement import SettlementRecord
from models.ai_history import AIHistory

# Import routers
from routers.users import router as user_router
from routers.settlement import router as settlement_router
from routers.ai import router as ai_router
from routers.api import router as api_router
from routers.loan import router as loan_router
from routers.dashboard import router as dashboard_router
from routers.history import router as history_router

app = FastAPI(
    title="FinRelief AI",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-powered-debt-relief-financial-re-livid.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(user_router)
app.include_router(settlement_router)
app.include_router(ai_router)
app.include_router(api_router)
app.include_router(loan_router)
app.include_router(dashboard_router)
app.include_router(history_router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to FinRelief AI 🚀",
        "status": "running"
    }