from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.security import verify_token
import logging

from database.connection import SessionLocal
from models.user import User
from models.loan import Loan

from services.settlement_engine import calculate_settlement_prediction

router = APIRouter(
    prefix="/settlement",
    tags=["Settlement Prediction"]
)

logger = logging.getLogger(__name__)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/predict")
def settlement_prediction(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Settlement Prediction using database records.
    """
    try:
        user_id = token.get("user_id")
        user = db.query(User).filter(User.user_id == user_id).first()

        if not user:
            return {
                "success": False,
                "message": "No user found in database."
            }

        # Get all loans of that user
        loans = db.query(Loan).filter(
            Loan.user_id == user.user_id
        ).all()

        if not loans:
            return {
                "success": True,
                "user": user.name,
                "total_loans": 0,
                "settlement_prediction": []
            }

        # Calculate settlement prediction
        result = calculate_settlement_prediction(
            user,
            loans
        )

        return {
            "success": True,
            "user": user.name,
            "total_loans": len(loans),
            "settlement_prediction": result
        }
    except Exception as e:
        logger.exception("Error predicting settlement values")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating settlement forecasts."
        )