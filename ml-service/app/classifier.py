from app.schemas import (
    TicketClassificationRequest,
    TicketClassificationResponse,
)


def classify_ticket(
    ticket: TicketClassificationRequest,
) -> TicketClassificationResponse:
    text = f"{ticket.subject} {ticket.description}".lower()

    billing_keywords = [
        "payment",
        "charged",
        "charge",
        "refund",
        "invoice",
        "billing",
        "paid",
        "subscription",
    ]

    account_keywords = [
        "login",
        "password",
        "account",
        "reset",
        "signin",
        "sign in",
        "auth",
        "authentication",
    ]

    technical_keywords = [
        "error",
        "bug",
        "crash",
        "server",
        "api",
        "timeout",
        "failed",
        "not working",
        "technical",
    ]

    high_priority_keywords = [
        "urgent",
        "urgently",
        "immediately",
        "critical",
        "blocked",
        "down",
        "cannot",
        "can't",
    ]

    medium_priority_keywords = [
        "issue",
        "problem",
        "failed",
        "not working",
        "needs",
    ]

    if any(keyword in text for keyword in billing_keywords):
        category = "BILLING"
        confidence = 0.85
    elif any(keyword in text for keyword in account_keywords):
        category = "ACCOUNT"
        confidence = 0.82
    elif any(keyword in text for keyword in technical_keywords):
        category = "TECHNICAL"
        confidence = 0.80
    else:
        category = "GENERAL"
        confidence = 0.60

    if any(keyword in text for keyword in high_priority_keywords):
        priority = "HIGH"
    elif any(keyword in text for keyword in medium_priority_keywords):
        priority = "MEDIUM"
    else:
        priority = "LOW"

    return TicketClassificationResponse(
        category=category,
        priority=priority,
        confidence=confidence,
    )
