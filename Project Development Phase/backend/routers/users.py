from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from database.connection import SessionLocal
from models.user import User
from schemas.user import UserRegister, UserLogin, UserUpdate
from utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

logger = logging.getLogger(__name__)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    try:
        existing_user = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing_user:
            return {
                "success": False,
                "message": "Email already registered."
            }

        new_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password),
            monthly_income=user.monthly_income,
            monthly_expenses=user.monthly_expenses
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "User registered successfully.",
            "user_id": new_user.user_id
        }
    except Exception as e:
        db.rollback()
        logger.exception("Error registering user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account. Please try again."
        )


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(
            User.email == user.email
        ).first()

        if not db_user:
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        if not verify_password(
            user.password,
            db_user.password
        ):
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        access_token = create_access_token(
            {
                "sub": db_user.email,
                "user_id": db_user.user_id
            }
        )

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.user_id,
                "name": db_user.name,
                "email": db_user.email,
                "monthly_income": db_user.monthly_income,
                "monthly_expenses": db_user.monthly_expenses
            }
        }
    except Exception as e:
        logger.exception("Error during login")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your login. Please try again."
        )


@router.put("/update-profile")
def update_profile(
    user_data: UserUpdate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        email = token.get("sub")
        db_user = db.query(User).filter(
            User.email == email
        ).first()

        if not db_user:
            return {
                "success": False,
                "message": "User not found."
            }

        # Check email uniqueness if email is changed
        if db_user.email != user_data.email:
            existing_email = db.query(User).filter(
                User.email == user_data.email
            ).first()
            if existing_email:
                return {
                    "success": False,
                    "message": "Email already in use."
                }

        db_user.name = user_data.name
        db_user.email = user_data.email
        db_user.monthly_income = user_data.monthly_income
        db_user.monthly_expenses = user_data.monthly_expenses

        db.commit()
        db.refresh(db_user)

        return {
            "success": True,
            "message": "Profile updated successfully.",
            "user": {
                "id": db_user.user_id,
                "name": db_user.name,
                "email": db_user.email,
                "monthly_income": db_user.monthly_income,
                "monthly_expenses": db_user.monthly_expenses
            }
        }
    except Exception as e:
        db.rollback()
        logger.exception("Error updating user profile")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating your profile. Please try again."
        )