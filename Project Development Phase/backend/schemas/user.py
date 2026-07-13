from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    monthly_income: float
    monthly_expenses: float


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str
    email: EmailStr
    monthly_income: float
    monthly_expenses: float