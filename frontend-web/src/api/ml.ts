import { api } from "./client";
import type { ClassifyTicketPayload, ClassifyTicketResponse } from "../types/ml";

export async function classifyTicket(
  payload: ClassifyTicketPayload,
): Promise<ClassifyTicketResponse> {
  const { data } = await api.post<ClassifyTicketResponse>("/ml/classify", payload);
  return data;
}
