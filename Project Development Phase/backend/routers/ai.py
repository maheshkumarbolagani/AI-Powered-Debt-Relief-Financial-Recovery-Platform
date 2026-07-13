from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from database.connection import SessionLocal
from models.user import User
from models.loan import Loan
from services.ai_engine import generate_negotiation_strategy
from utils.security import verify_token

router = APIRouter(
    prefix="/ai",
    tags=["AI Negotiation"]
)

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/strategy")
def ai_strategy(
    loan_id: int = None,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = token.get("user_id")
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User profile not found.")

        # Find the loan: either specific loan_id or the first one available
        loan = None
        if loan_id:
            loan = db.query(Loan).filter(Loan.loan_id == loan_id, Loan.user_id == user.user_id).first()
        else:
            loan = db.query(Loan).filter(Loan.user_id == user.user_id).first()

        if not loan:
            # Fallback mock loan if borrower has no loans registered yet
            class FallbackLoan:
                lender_name = "Mock Lender"
                loan_type = "Personal Loan"
                outstanding_amount = 100000.0
                interest_rate = 12.0
                emi = 5000.0
                overdue_months = 3

            loan = FallbackLoan()

        return generate_negotiation_strategy(user, loan)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error generating negotiation strategy")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the AI negotiation strategy."
        )