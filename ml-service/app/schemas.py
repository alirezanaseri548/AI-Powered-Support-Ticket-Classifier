from typing import Literal

from pydantic import BaseModel, Field


class TicketClassificationRequest(BaseModel):
    subject: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    customerEmail: str = Field(..., min_length=3)


class TicketClassificationResponse(BaseModel):
    category: Literal["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL"]
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    confidence: float = Field(..., ge=0.0, le=1.0)
