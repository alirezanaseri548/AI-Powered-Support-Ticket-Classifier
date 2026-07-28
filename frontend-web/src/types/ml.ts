export type ClassifyTicketPayload = {
  subject: string;
  description: string;
  customerEmail: string;
};

export type ClassifyTicketResponse = {
  category: string;
  priority: string;
  confidence: number;
};
