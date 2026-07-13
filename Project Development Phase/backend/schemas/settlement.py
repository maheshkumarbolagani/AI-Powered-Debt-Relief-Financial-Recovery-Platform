from pydantic import BaseModel


class SettlementResponse(BaseModel):
    settlement_prediction: str
    recommended_amount: float
    priority_level: str