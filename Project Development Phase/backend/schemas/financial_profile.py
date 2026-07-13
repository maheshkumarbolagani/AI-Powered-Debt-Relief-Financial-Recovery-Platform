from pydantic import BaseModel


class FinancialProfileCreate(BaseModel):
    monthly_income: float
    monthly_expenses: float
    existing_debts: float