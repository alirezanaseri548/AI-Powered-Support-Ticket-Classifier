import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classifyTicket } from "../api/ml";
import {
  classifyTicketSchema,
  type ClassifyTicketFormData,
} from "../schemas/classifyTicketSchema";

export default function TicketScreen() {
  const [result, setResult] = useState<null | {
    category: string;
    priority: string;
    confidence: number;
  }>(null);

  const [apiError, setApiError] = useState("");

  const {
    control,
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
      setApiError("API failed. Android Emulator uses http://10.0.2.2:3000. For real phone, use your PC LAN IP.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.badge}>Backend: http://10.0.2.2:3000/ml/classify</Text>
      <Text style={styles.title}>AI Ticket Classifier</Text>

      <Text style={styles.label}>Subject</Text>
      <Controller
        control={control}
        name="subject"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} value={value} onChangeText={onChange} />
        )}
      />
      {errors.subject && <Text style={styles.error}>{errors.subject.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            value={value}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

      <Text style={styles.label}>Customer Email</Text>
      <Controller
        control={control}
        name="customerEmail"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.customerEmail && <Text style={styles.error}>{errors.customerEmail.message}</Text>}

      <Button
        title={isSubmitting ? "Classifying..." : "Classify Ticket"}
        onPress={handleSubmit(onSubmit)}
      />

      {apiError ? <Text style={styles.errorBox}>{apiError}</Text> : null}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Classification Result</Text>
          <Text>Category: {result.category}</Text>
          <Text>Priority: {result.priority}</Text>
          <Text>Confidence: {result.confidence}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  badge: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
    padding: 8,
    borderRadius: 999,
    fontWeight: "700",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  error: {
    color: "#dc2626",
    marginBottom: 8,
  },
  errorBox: {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    fontWeight: "700",
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    gap: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
});
