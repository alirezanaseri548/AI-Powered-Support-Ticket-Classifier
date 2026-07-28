import { z } from "zod";

export const classifyTicketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  customerEmail: z.string().email("Invalid email address"),
});

export type ClassifyTicketFormData = z.infer<typeof classifyTicketSchema>;
