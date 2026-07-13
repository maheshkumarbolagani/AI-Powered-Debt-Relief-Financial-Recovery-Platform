from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from database.connection import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    monthly_income = Column(Float, default=0)
    monthly_expenses = Column(Float, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)