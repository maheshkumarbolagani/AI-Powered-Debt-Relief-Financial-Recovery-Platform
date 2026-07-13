from pydantic import BaseModel


class LoanCreate(BaseModel):
    lender_name: str
    loan_type: str

    loan_amount: float
    outstanding_amount: float

    emi: float

    interest_rate: float

    overdue_months: int = 0

    due_date: str