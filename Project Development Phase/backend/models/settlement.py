from sqlalchemy import Column, Integer, Float, String, ForeignKey
from database.connection import Base


class SettlementRecord(Base):
    __tablename__ = "settlement_records"

    settlement_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    loan_id = Column(Integer, ForeignKey("loans.loan_id"))

    settlement_prediction = Column(String)
    recommended_amount = Column(Float)
    priority_level = Column(String)