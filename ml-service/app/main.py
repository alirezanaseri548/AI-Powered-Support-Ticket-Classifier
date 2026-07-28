from fastapi import FastAPI

from app.classifier import classify_ticket
from app.schemas import (
    TicketClassificationRequest,
    TicketClassificationResponse,
)


app = FastAPI(
    title="AI Ticket Classifier ML Service",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ml-service",
    }


@app.post(
    "/classify",
    response_model=TicketClassificationResponse,
)
def classify(
    payload: TicketClassificationRequest,
) -> TicketClassificationResponse:
    return classify_ticket(payload)
