from sqlalchemy import Column, Integer, String, ForeignKey
from database.connection import Base


class AIHistory(Base):
    __tablename__ = "ai_history"

    history_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"))

    negotiation_strategy = Column(String)
    settlement_letter = Column(String)
    ai_response = Column(String)