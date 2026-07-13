from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database.connection import Base


class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    lender_name = Column(String, nullable=False)
    loan_type = Column(String, nullable=False)

    loan_amount = Column(Float, nullable=False)
    outstanding_amount = Column(Float, nullable=False)

    emi = Column(Float, nullable=False)

    interest_rate = Column(Float)

    overdue_months = Column(Integer, default=0)

    due_date = Column(String)