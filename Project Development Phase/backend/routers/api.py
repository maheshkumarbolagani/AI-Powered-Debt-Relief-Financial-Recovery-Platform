from fastapi import APIRouter, HTTPException, status
import logging

from services.ai_engine import generate_negotiation_strategy

router = APIRouter(
    prefix="/api",
    tags=["API Development"]
)

logger = logging.getLogger(__name__)


@router.post("/generate-strategy")
def generate_strategy():
    try:
        # Temporary dummy data
        class DummyUser:
            name = "Rahul Sharma"
            monthly_income = 50000
            monthly_expenses = 20000

        class DummyLoan:
            loan_id = 1
            lender_name = "HDFC Bank"
            loan_type = "Personal Loan"
            outstanding_amount = 300000
            interest_rate = 14
            emi = 12000
            overdue_months = 3

        result = generate_negotiation_strategy(
            DummyUser(),
            DummyLoan()
        )

        return {
            "success": True,
            "message": "AI Strategy Generated Successfully",
            "data": result
        }
    except Exception as e:
        logger.exception("Error in generate-strategy API")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating sample strategy."
        )