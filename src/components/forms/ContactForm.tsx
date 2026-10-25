"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is required"),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<ContactFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "Equipment enquiry",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          ...data,
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      setSubmittedData(data);
      setStatus("success");
    } catch {
      setSubmittedData(data);
      setStatus("success");
    }
  };

  const getWhatsAppMessage = () => {
    if (!submittedData) return "";
    return `Hello DK Unique, I sent a message regarding: ${submittedData.subject}. Message: ${submittedData.message}. Name: ${submittedData.name}, Phone: ${submittedData.phone}.`;
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-paper p-6 sm:p-8 rounded-[2px] text-center space-y-6">
        <div className="p-4 bg-black/[0.03] border border-line rounded-[2px]">
          <h3 className="font-display font-bold text-xl text-ink mb-2">
            {copy.forms.success}
          </h3>
          <p className="font-mono text-xs text-muted">
            Subject: {submittedData?.subject}
          </p>
        </div>

        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
            getWhatsAppMessage()
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center min-h-[48px] px-6 py-3 bg-ink text-paper font-body text-sm font-medium rounded-[2px] hover:bg-ink/90"
        >
          {copy.forms.sendWhatsApp}
        </a>

        <Button
          variant="secondary"
          onClick={() => {
            reset();
            setStatus("idle");
            setSubmittedData(null);
          }}
          className="w-full"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-line bg-paper p-6 sm:p-8 rounded-[2px] space-y-5"
    >
      <div className="border-b border-line pb-4 mb-2">
        <h3 className="font-display font-bold text-xl text-ink">
          {copy.forms.contact.title}
        </h3>
      </div>

      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        {...register("honeypot")}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.contact.fields.name}
          error={errors.name?.message}
          required
        >
          <Input
            {...register("name")}
            placeholder="Your name"
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field
          label={copy.forms.contact.fields.phone}
          error={errors.phone?.message}
          required
        >
          <Input
            {...register("phone")}
            placeholder="e.g. +91 98765 43210"
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.contact.fields.email}
          error={errors.email?.message}
        >
          <Input
            type="email"
            {...register("email")}
            placeholder="name@company.com"
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field
          label={copy.forms.contact.fields.subject}
          error={errors.subject?.message}
          required
        >
          <Input
            {...register("subject")}
            placeholder="Subject"
            aria-invalid={!!errors.subject}
          />
        </Field>
      </div>

      <Field
        label={copy.forms.contact.fields.message}
        error={errors.message?.message}
        required
      >
        <Textarea
          {...register("message")}
          placeholder="Tell us what you need"
          rows={4}
          aria-invalid={!!errors.message}
        />
      </Field>

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono">
          {copy.forms.error.replace("{phone}", siteConfig.phoneDisplay)}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? copy.forms.submitting : copy.forms.submit}
      </Button>
    </form>
  );
}
