import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classifyTicket } from "./api/ml";
import {
  classifyTicketSchema,
  type ClassifyTicketFormData,
} from "./schemas/classifyTicketSchema";
import "./index.css";

function App() {
  const [result, setResult] = useState<null | {
    category: string;
    priority: string;
    confidence: number;
  }>(null);

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassifyTicketFormData>({
    resolver: zodResolver(classifyTicketSchema),
    defaultValues: {
      subject: "Payment failed",
      description: "Customer cannot complete payment and needs billing support urgently.",
      customerEmail: "customer@example.com",
    },
  });

  const onSubmit = async (values: ClassifyTicketFormData) => {
    try {
      setApiError("");
      setResult(null);
      const response = await classifyTicket(values);
      setResult(response);
    } catch {
      setApiError("Request failed. Make sure backend is running on http://127.0.0.1:3000");
    }
  };

  return (
    <main className="page">
      <section className="card">
        <p className="badge">Connected to Backend: http://127.0.0.1:3000/ml/classify</p>
        <h1>AI Support Ticket Classifier</h1>
        <p className="subtitle">
          Submit a support ticket and receive category, priority, and confidence from the ML service.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <label>
            Subject
            <input {...register("subject")} />
            {errors.subject && <span className="error">{errors.subject.message}</span>}
          </label>

          <label>
            Description
            <textarea {...register("description")} rows={6} />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </label>

          <label>
            Customer Email
            <input {...register("customerEmail")} />
            {errors.customerEmail && <span className="error">{errors.customerEmail.message}</span>}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Classifying..." : "Classify Ticket"}
          </button>
        </form>

        {apiError && <p className="errorBox">{apiError}</p>}

        {result && (
          <section className="result">
            <h2>Classification Result</h2>
            <div className="resultGrid">
              <div>
                <strong>Category</strong>
                <p>{result.category}</p>
              </div>
              <div>
                <strong>Priority</strong>
                <p>{result.priority}</p>
              </div>
              <div>
                <strong>Confidence</strong>
                <p>{result.confidence}</p>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
