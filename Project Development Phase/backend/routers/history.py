from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.security import verify_token
from database.connection import SessionLocal
from models.ai_history import AIHistory
from pydantic import BaseModel
import logging

router = APIRouter(
    prefix="/history",
    tags=["AI History"]
)

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class HistoryCreate(BaseModel):
    negotiation_strategy: str
    settlement_letter: str
    ai_response: str


@router.get("")
def get_history(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = token.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        records = db.query(AIHistory).filter(
            AIHistory.user_id == user_id
        ).all()

        return {
            "success": True,
            "history": [
                {
                    "history_id": r.history_id,
                    "negotiation_strategy": r.negotiation_strategy,
                    "settlement_letter": r.settlement_letter,
                    "ai_response": r.ai_response
                }
                for r in records
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error getting history records")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while loading your AI strategy logs."
        )


@router.post("")
def create_history(
    history_in: HistoryCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = token.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        new_record = AIHistory(
            user_id=user_id,
            negotiation_strategy=history_in.negotiation_strategy,
            settlement_letter=history_in.settlement_letter,
            ai_response=history_in.ai_response
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

        return {
            "success": True,
            "message": "History saved successfully.",
            "history_id": new_record.history_id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Error creating history log entry")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving your negotiation strategy history."
        )


@router.delete("/{history_id}")
def delete_history(
    history_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        user_id = token.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        record = db.query(AIHistory).filter(
            AIHistory.history_id == history_id,
            AIHistory.user_id == user_id
        ).first()

        if not record:
            return {
                "success": False,
                "message": "History item not found or unauthorized."
            }

        db.delete(record)
        db.commit()

        return {
            "success": True,
            "message": "History item deleted successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception(f"Error deleting history entry {history_id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the strategy log entry."
        )
