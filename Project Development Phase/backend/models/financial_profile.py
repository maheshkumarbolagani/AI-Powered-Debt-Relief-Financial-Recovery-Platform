from sqlalchemy import Column, Integer, Float, ForeignKey
from database.connection import Base


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    monthly_income = Column(Float)
    monthly_expenses = Column(Float)
    existing_debts = Column(Float)
    financial_health_score = Column(Float)