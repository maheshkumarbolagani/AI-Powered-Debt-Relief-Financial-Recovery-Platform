from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.security import verify_token
import logging

from database.connection import SessionLocal
from models.user import User
from models.loan import Loan

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/summary")
def dashboard_summary(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = token.get("user_id")
        user = db.query(User).filter(User.user_id == user_id).first()

        if not user:
            return {
                "success": False,
                "message": "No user found."
            }

        loans = db.query(Loan).filter(
            Loan.user_id == user.user_id
        ).all()

        total_outstanding = sum(
            loan.outstanding_amount for loan in loans
        )

        total_emi = sum(
            loan.emi for loan in loans
        )

        return {
            "success": True,
            "total_loans": len(loans),
            "outstanding_debt": total_outstanding,
            "monthly_emi": total_emi,
            "monthly_income": user.monthly_income,
            "monthly_expenses": user.monthly_expenses
        }
    except Exception as e:
        logger.exception("Error loading dashboard summary")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while loading dashboard metrics."
        )